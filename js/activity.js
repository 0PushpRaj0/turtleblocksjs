// Copyright (c) 2014 Walter Bender
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License, or
// (at your option) any later version.
//
// You should have received a copy of the GNU General Public License
// along with this library; if not, write to the Free Software
// Foundation, 51 Franklin Street, Suite 500 Boston, MA 02110-1335 USA

// Note: This code is inspired by the Python Turtle Blocks project
// (https://github.com/walterbender/turtleart), but implemented from
// scratch. -- Walter Bender, October 2014.

define(function (require) {
    var activity = require('sugar-web/activity/activity');
    var icon = require('sugar-web/graphics/icon');
    require('easel');
    require('activity/artwork');
    require('activity/utils');
    require('activity/munsell');
    require('activity/trash');
    require('activity/turtle');
    require('activity/palette');
    require('activity/blocks');  

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {

        // Initialize the activity.
        activity.setup();

        // Colorize the activity icon.
        var activityButton = docById('activity-button');
        var colors;  // I should be getting the XO colors here?
        activity.getXOColor(function (error, colors) {
            icon.colorize(activityButton, colors);
        });

	//
        var canvas = docById('myCanvas');
	var stage;
	var turtles;
	var palettes;
	var blocks;

	// default values
	var defaultBackgroundColor = [70, 80, 20];
	var defaultDelay = 500;  // MS

	var turtleDelay = defaultDelay;

	// Used to track mouse state for mouse button block
	var stageMouseDown = false;

        var fastButton = docById('fast-button');
        fastButton.onclick = function () {
	    turtleDelay = 1;
	    runLogoCommands();
        }

        var slowButton = docById('slow-button');
        slowButton.onclick = function () {
	    turtleDelay = defaultDelay;
	    runLogoCommands();
        }

	var stopTurtle = false;
        var stopTurtleButton = docById('stop-turtle-button');
        stopTurtleButton.onclick = function () {
	    doStopTurtle();
        }

        var paletteButton = docById('palette-button');
        paletteButton.onclick = function () {
	    changePaletteVisibility();
        }

	// var blocksVisible = true;
        var blockButton = docById('hide-blocks-button');
        blockButton.onclick = function () {
	    changeBlockVisibility();
        }

        var clearButton = docById('clear-button');
        clearButton.onclick = function () {
	    allClear();
	}

	var cartesianVisible = false;
        var cartesianButton = docById('cartesian-button');
        cartesianButton.onclick = function () {
	    if (cartesianVisible) {
		hideCartesian();
		cartesianVisible = false;
	    } else {
		showCartesian();
		cartesianVisible = true;
	    }
        }

	var polarVisible = false;
        var polarButton = docById('polar-button');
        polarButton.onclick = function () {
	    if (polarVisible) {
		hidePolar();
		polarVisible = false;
	    } else {
		showPolar();
		polarVisible = true;
	    }
        }

        var openButton = docById('open-button');
        openButton.onclick = function () {
	    doOpen();
	}

        var saveButton = docById('save-button');
        saveButton.onclick = function () {
	    doSave();
	}

        // Make the activity stop with the stop button.
        var stopButton = docById('stop-button');
        stopButton.addEventListener('click', function (e) {
            activity.close();
        });

	// Do we need to update the stage?
        var update = true;

	// The list of [action name, block]
        var actionList = [];

	// The list of [box name, value]
	var boxList = [];
	
	// Set the default background color...
	var canvasColor = getMunsellColor(
	    defaultBackgroundColor[0], defaultBackgroundColor[1], defaultBackgroundColor[2]);
	setBackgroundColor(-1);
	// then set default canvas color.
	canvasColor = getMunsellColor(defaultColor, defaultValue, defaultChroma);

	// Time when we hit run
	var time = 0;
	// Used by pause block
	var waitTime = 0;

	// Coordinate grid
        var cartesianBitmap = null;
	// Polar grid
        var polarBitmap = null;

	// Get things started
	init();

        function init() {
            docById('loader').className = 'loader';

            // Check to see if we are running in a browser with touch support.
            stage = new createjs.Stage(canvas);
	    createjs.Ticker.addEventListener('tick', tick);
	    trashcan = new Trashcan(canvas, stage, refreshCanvas, restoreTrash, sendAllToTrash);
	    turtles = new Turtles(canvas, stage, refreshCanvas);
	    palettes = initPalettes(canvas, stage, refreshCanvas);
	    blocks = new Blocks(canvas, stage, refreshCanvas, trashcan);
	    palettes.setBlocks(blocks);
	    turtles.setBlocks(blocks);
	    blocks.setTurtles(turtles);
	    blocks.setLogo(runLogoCommands);
	    initProtoBlocks(palettes, blocks);

	    this.svgOutput = '';

	    // Workaround to chrome security issues
	    // createjs.LoadQueue(true, null, true);

            // Enable touch interactions if supported on the current device.
            createjs.Touch.enable(stage);
            // Keep tracking the mouse even when it leaves the canvas.
            stage.mouseMoveOutside = true;
            // Enabled mouse over and mouse out events.
            stage.enableMouseOver(10); // default is 20

	    var cartesian = new Image();
	    cartesian.src = 'images/Cartesian.svg';
            var container = new createjs.Container();
            stage.addChild(container);

            cartesianBitmap = new createjs.Bitmap(cartesian);
            container.addChild(cartesianBitmap);
	    cartesianBitmap.cache(0, 0, 1200, 900);

            cartesianBitmap.x = (canvas.width - 1200) / 2;
            cartesianBitmap.y = (canvas.height - 900) / 2;
            cartesianBitmap.scaleX = cartesianBitmap.scaleY = cartesianBitmap.scale = 1;
            cartesianBitmap.name = 'bmp_cartesian';
	    cartesianBitmap.visible = false;
	    cartesianBitmap.updateCache();

	    var polar = new Image();
	    polar.src = 'images/polar.svg';
            var container = new createjs.Container();
            stage.addChild(container);

            polarBitmap = new createjs.Bitmap(polar);
            container.addChild(polarBitmap);
	    polarBitmap.cache(0, 0, 1200, 900);

            polarBitmap.x = (canvas.width - 1200) / 2;
            polarBitmap.y = (canvas.height - 900) / 2;
            polarBitmap.scaleX = polarBitmap.scaleY = polarBitmap.scale = 1;
            polarBitmap.name = 'bmp_polar';
	    polarBitmap.visible = false;
	    polarBitmap.updateCache();

	    var URL = window.location.href;
	    console.log(URL);
	    var projectName = null;
	    if (URL.indexOf('?') > 0) {
		var urlParts = URL.split('?');
		if (urlParts[1].indexOf('=') > 0) {
		    var projectName = urlParts[1].split('=')[1];
		}
	    }
	    if (projectName != null) {
		console.log('load ' + projectName);
		loadProject(projectName);
	    } else {
		loadStart();
	    }

	    // Make sure blocks are aligned.
	    blocks.findStacks();
	    for (i = 0; i < blocks.stackList.length; i++) {
		blocks.findDragGroup(blocks.stackList[i]);
		blocks.adjustBlockPositions();
	    }

	    // Set up event handler for stage mouse events
	    stage.on('stagemousedown', function(event) {
		stageMouseDown = true;
	    });

	    stage.on('stagemouseup', function(event) {
		stageMouseDown = false;
	    });
        }

	function restoreTrash() {
	    var dx = -110;
	    var dy = 55;
	    for (var blk in blocks.blockList) {
		if (blocks.blockList[blk].trash) {
		    blocks.blockList[blk].trash = false;
		    blocks.moveBlockRelative(blk, dx, dy);
		    blocks.blockList[blk].show();
		}
	    }
	    update = true;
	}

	function sendAllToTrash() {
	    var dx = 2000;
	    var dy = 55;
	    for (var blk in blocks.blockList) {
		blocks.blockList[blk].trash = true;
		blocks.moveBlockRelative(blk, dx, dy);
		blocks.blockList[blk].hide();
	    }
	    console.log('loading new start block');
	    blocks.makeNewBlock('start');
	    last(blocks.blockList).x = 50;
	    last(blocks.blockList).y = 50;
	    last(blocks.blockList).connections = [null, null, null];
	    turtles.add();
	    // Overwrite session data too.
	    console.log('overwriting session data');
	    if(typeof(Storage) !== "undefined") {
		localStorage.setItem('sessiondata', prepareExport());
		// console.log(localStorage.getItem('sessiondata'));
	    } else {
		// Sorry! No Web Storage support..
	    }

	    blocks.updateBlockImages();
	    blocks.updateBlockLabels();

	    update = true;
	}

	function changePaletteVisibility() {
	    if (palettes.visible) {
		palettes.hide();
	    } else {
		palettes.show();
		palettes.bringToTop();
	    }
	}

	function changeBlockVisibility() {
	    if (blocks.visible) {
		hideBlocks();
	    } else {
		showBlocks();
	    }
	}

        function stop() {
	    //
            createjs.Ticker.removeEventListener('tick', tick);
        }

        function doStopTurtle() {
	    //
	    stopTurtle = true;
	    blocks.bringToTop();
        }

	function refreshCanvas() {
	    update = true;
	}

        function tick(event) {
            // This set makes it so the stage only re-renders when an
            // event handler indicates a change has happened.
            if (update) {
                update = false; // Only update once
                stage.update(event);
            }
        }

	function httpGet(projectName)
	{
	    var xmlHttp = null;
	    
	    xmlHttp = new XMLHttpRequest();
	    xmlHttp.open("GET", 'https://turtle.sugarlabs.org/server/', false);
	    xmlHttp.setRequestHeader('x-api-key', '3tgTzMXbbw6xEKX7');
	    xmlHttp.setRequestHeader('x-project-id', projectName);
	    xmlHttp.send();
	    return xmlHttp.responseText;
	}

	function httpPost(projectName, data)
	{
	    var xmlHttp = null;
	    console.log('sending ' + data);
	    xmlHttp = new XMLHttpRequest();
	    xmlHttp.open("POST", 'https://turtle.sugarlabs.org/server/', false);
	    xmlHttp.setRequestHeader('x-api-key', '3tgTzMXbbw6xEKX7');
	    xmlHttp.setRequestHeader('x-project-id', projectName);
	    xmlHttp.send(data);
	    // return xmlHttp.responseText;
	    return 'https://apps.facebook.com/turtleblocks/?file=' + projectName;
	}

	function loadProject(projectName) {
	    palettes.updatePalettes();

	    try {
		var rawData = httpGet(projectName);
		console.log('receiving ' + rawData);
		var cleanData = rawData.replace('\n', ' ');
		var obj = JSON.parse(cleanData);
		blocks.load(obj);
	    } catch (e) {
		loadStart();
		return;
	    }
	    update = true;
	}

	function saveProject(projectName) {
	    palettes.updatePalettes();

	    try {
		return httpPost(projectName, prepareExport());
	    } catch (e) {
		console.log(e);
		return;
	    }
	}

	function loadStart() {
	    // where to put this?
	    palettes.updatePalettes();

	    sessionData = null;
	    // Try restarting where we were when we hit save.
	    if(typeof(Storage) !== "undefined") {
		// localStorage is how we'll save the session (and metadata)
		sessionData = localStorage.getItem('sessiondata');
	    }
	    if (sessionData != null) {
		try {
		    console.log('restoring session');
		    var obj = JSON.parse(sessionData);
		    blocks.load(obj);
		} catch (e) {
		}
	    } else {
		console.log('loading start');
		blocks.makeNewBlock('start');
		blocks.blockList[0].x = 50;
		blocks.blockList[0].y = 50;
		blocks.blockList[0].connections = [null, null, null];
		turtles.add();
	    }
	    blocks.updateBlockImages();
	    blocks.updateBlockLabels();

	    update = true;
	}

	function addTurtle() {
	    turtles.add();
	}

        function runLogoCommands(startHere) {
	    // Save the state before running
	    if(typeof(Storage) !== "undefined") {
		localStorage.setItem('sessiondata', prepareExport());
		// console.log(localStorage.getItem('sessiondata'));
	    } else {
		// Sorry! No Web Storage support..
	    }

	    stopTurtle = false;
	    blocks.bringToTop();  // Draw under blocks.

	    // We run the logo commands here.
	    var d = new Date();
	    time = d.getTime();

	    // console.log(blocks.blockList);

	    // First we need to reconcile the values in all the value blocks
	    // with their associated textareas.
	    for (var blk = 0; blk < blocks.blockList.length; blk++) {
		if (blocks.blockList[blk].label != null) {
		    blocks.blockList[blk].value = blocks.blockList[blk].label.value;
		}
	    }

	    // Init the graphic state.
	    for (var turtle = 0; turtle < turtles.turtleList.length; turtle++) {
		turtles.turtleList[turtle].container.x = turtles.turtleX2screenX(turtles.turtleList[turtle].x);
		turtles.turtleList[turtle].container.y = turtles.invertY(turtles.turtleList[turtle].y);
	    }

	    // Execute turtle code here...  Find the start block
	    // (or the top of each stack) and build a list of all of
	    // the named action stacks (wishing I had a Python
	    // dictionary about now.)
	    var startBlocks = [];
	    blocks.findStacks();
	    actionList = [];
	    for (var blk = 0; blk < blocks.stackList.length; blk++) {
		if (blocks.blockList[blocks.stackList[blk]].name == 'start') {
		    // Don't start on a start block in the trash.
		    if (!blocks.blockList[blocks.stackList[blk]].trash) {
			startBlocks.push(blocks.stackList[blk]);
		    }
		} else if (blocks.blockList[blocks.stackList[blk]].name == 'action') {
		    // does the action stack have a name?
		    c = blocks.blockList[blocks.stackList[blk]].connections[1];
		    b = blocks.blockList[blocks.stackList[blk]].connections[2];
		    if (c != null && b != null) {
			// Don't use an action block in the trash.
			if (!blocks.blockList[blocks.stackList[blk]].trash) {
			    actionList.push([blocks.blockList[c].value, b]);
			}
		    }
		}
	    }

	    // (2) Execute the stack.
	    if (startHere != null) {
		// Which turtle should we use?
		var i = 0;
		if (blocks.blockList[startHere].name == 'start') {
		    var i = startBlocks.indexOf(startHere);
		}
		turtles.turtleList[i].queue = [];
		runFromBlock(i, startHere);
	    } else if (startBlocks.length > 0) {
		for (var turtle = 0; turtle < startBlocks.length; turtle++) {
		    turtles.turtleList[turtle].queue = [];
		    runFromBlock(turtle, startBlocks[turtle]);
		}
	    } else {
		for (var blk = 0; blk < blocks.stackList.length; blk++) {
		    if (blocks.blockList[blk].isNoRunBlock()) {
			continue;
		    } else {
			if (!blocks.blockList[blocks.stackList[blk]].trash) {
			    runFromBlock(0, blocks.stackList[blk]);
			}
		    }
		}
	    }
            update = true;
        }

	function runFromBlock(thisTurtle, blk) { 
	    if (blk == null) {
		return;
	    }
	    var delay = turtleDelay + waitTime;
	    waitTime = 0;
	    if (!stopTurtle) {
		setTimeout(function(){runFromBlockNow(thisTurtle, blk);}, delay);
	    }
	}

        function runFromBlockNow(turtle, blk) {
	    // Run a stack of blocks, beginning with blk.
	    // (1) Evaluate any arguments (beginning with connection[1]);
	    var args = [];
	    if(blocks.blockList[blk].protoblock.args > 0) {
		for (var i = 1; i < blocks.blockList[blk].protoblock.args + 1; i++) {
		    args.push(parseArg(turtle, blocks.blockList[blk].connections[i]));
		}
	    }

	    // (2) Run function associated with the block;

	    if (blocks.blockList[blk].isValueBlock()) {
		var nextFlow = null;
	    } else {
		// All flow blocks have a nextFlow, but it can be null
		// (end of flow)
		var nextFlow = last(blocks.blockList[blk].connections);
	    }
	    if (nextFlow != null) {
		var queueBlock = new Queue(nextFlow, 1);
		turtles.turtleList[turtle].queue.push(queueBlock);
	    }
	    // Some flow blocks have childflows, e.g., repeat
	    var childFlow = null;
	    var childFlowCount = 0;

	    if (turtleDelay > 0) {
		blocks.highlight(blk);
	    }

	    switch (blocks.blockList[blk].name) {
	    case 'start':
		eval("if (args.length == 1) {childFlow = args[0]; childFlowCount = 1;}");
		break;
 		if (args.length == 1) {
		    childFlow = args[0];
		    childFlowCount = 1;
		}
		break;
	    case 'publish':
 		if (args.length == 1) {
		    doPublish(args[0]);
		}
		break;
	    case 'savesvg':
 		if (args.length == 1) {
		    doSaveSVG(args[0]);
		}
		break;
	    case 'wait':
 		if (args.length == 1) {
		    doWait(args[0]);
		}
		break;
	    case 'do':
 		if (args.length == 1) {
		    for (i = 0; i < actionList.length; i++) {
			if (actionList[i][0] == args[0]) {
			    childFlow = actionList[i][1];
			    childFlowCount = 1;
			    break;
			}
		    }
		}
		break;
	    case 'repeat':
 		if (args.length == 2) {
		    childFlow = args[1];
		    childFlowCount = args[0];
		}
		break;
	    case 'if':
 		if (args.length == 2) {
		    if (args[0]) {
			childFlow = args[1];
			childFlowCount = 1;
		    }
		}
		break;
	    case 'storein':
 		if (args.length == 2) {
		    doStorein(args[0], args[1]);
		}
		break;
	    case 'clear':
		turtles.turtleList[turtle].doClear();
		break;
	    case 'setxy':
 		if (args.length == 2) {
		    turtles.turtleList[turtle].doSetXY(args[0], args[1]);
		}
		break;
	    case 'arc':
 		if (args.length == 2) {
		    turtles.turtleList[turtle].doArc(args[0], args[1]);
		}
		break;
            case 'forward':
 		if (args.length == 1) {
		    turtles.turtleList[turtle].doForward(args[0]);
		}
		break;
            case 'back':
		if (args.length == 1) {
		    turtles.turtleList[turtle].doForward(-args[0]);
         	}
		break;
            case 'right':
		if (args.length == 1) {
		    turtles.turtleList[turtle].doRight(args[0]);
         	}
		break;
            case 'left':
		if (args.length == 1) {
		    turtles.turtleList[turtle].doRight(-args[0]);
         	}
		break;
            case 'setheading':
		if (args.length == 1) {
		    turtles.turtleList[turtle].doSetHeading(args[0]);
         	}
		break;
	    case 'show':
		if (args.length == 2) {
		    turtles.turtleList[turtle].doShowText(args[0], args[1]);
         	}
		break;
	    case 'image':
		if (args.length == 2) {
		    turtles.turtleList[turtle].doShowImage(args[0], args[1]);
         	}
		break;
	    case 'turtleshell':
		if (args.length == 2) {
		    turtles.turtleList[turtle].doTurtleShell(args[0], args[1]);
         	}
		break;
            case 'setcolor':
		if (args.length == 1) {
		    turtles.turtleList[turtle].doSetColor(args[0]);
         	}
		break;
            case 'setshade':
		if (args.length == 1) {
		    turtles.turtleList[turtle].doSetValue(args[0]);
         	}
		break;
            case 'setgrey':
		if (args.length == 1) {
		    turtles.turtleList[turtle].doSetChroma(args[0]);
         	}
		break;
            case 'setpensize':
		if (args.length == 1) {
		    turtles.turtleList[turtle].doSetPensize(args[0]);
         	}
		break;
            case 'beginfill':
		turtles.turtleList[turtle].doStartFill();
		break;
            case 'endfill':
		turtles.turtleList[turtle].doEndFill();
		break;
            case 'fillscreen':
		setBackgroundColor(turtle);
		break;
            case 'penup':
		turtles.turtleList[turtle].doPenUp();
		break;
            case 'pendown':
		turtles.turtleList[turtle].doPenDown();
		break;
	    }

	    // (3) Queue block below this block.

	    // If there is a childFlow, queue it.
	    if (childFlow != null) {
		var queueBlock = new Queue(childFlow, childFlowCount);
		turtles.turtleList[turtle].queue.push(queueBlock);
	    }

	    var nextBlock = null;
	    // Run the last flow in the queue.
	    if (turtles.turtleList[turtle].queue.length > 0) {
		nextBlock = last(turtles.turtleList[turtle].queue).blk;
		if(last(turtles.turtleList[turtle].queue).count == 1) {
		    // Finished child so pop it off the queue.
		    turtles.turtleList[turtle].queue.pop();
		} else {
		    // Decrement the counter.
		    last(turtles.turtleList[turtle].queue).count -= 1;
		}
	    }
	    if (nextBlock != null) {
		runFromBlock(turtle, nextBlock);
	    } else {
		setTimeout(function(){blocks.unhighlight(blk);}, turtleDelay);
		// FIXME
		var lastChild = last(stage.children);
		for (var turtle = 0; turtle < turtles.turtleList.length; turtle++) {
		    stage.swapChildren(turtles.turtleList[turtle].Container, lastChild);
		}
		update = true;
	    }
	}

	function parseArg(turtle, blk) {
	    // Retrieve the value of a block.
	    if (blk == null) {
		// activity.showAlert('WARNING', 'missing argument', null, function() {});
		console.log('WARNING: missing argument');
		return null
	    } else if (blocks.blockList[blk].isValueBlock()) {
		return blocks.blockList[blk].value;
	    } else if (blocks.blockList[blk].isArgBlock()) {
		switch (blocks.blockList[blk].name) {
		case 'box':
		    var cblk = blocks.blockList[blk].connections[1];
		    var name = parseArg(turtle, cblk);
		    var i = findBox(name);
		    if (i == null) {
			blocks.blockList[blk].value = null;
		    } else {
			blocks.blockList[blk].value = boxList[i][1];
		    }
		    break;
		case 'sqrt':
		    var cblk = blocks.blockList[blk].connections[1];
		    var a = parseArg(turtle, cblk);
		    blocks.blockList[blk].value = (Math.sqrt(Number(a)));
		    break;
		case 'mod':
		    var cblk1 = blocks.blockList[blk].connections[1];
		    var cblk2 = blocks.blockList[blk].connections[2];
		    var a = parseArg(turtle, cblk1);
		    var b = parseArg(turtle, cblk2);
		    blocks.blockList[blk].value = (Number(a) % Number(b));
		    break;
		case 'greater':
		    var cblk1 = blocks.blockList[blk].connections[1];
		    var cblk2 = blocks.blockList[blk].connections[2];
		    var a = parseArg(turtle, cblk1);
		    var b = parseArg(turtle, cblk2);
		    blocks.blockList[blk].value = (Number(a) > Number(b));
		    break;
		case 'equal':
		    var cblk1 = blocks.blockList[blk].connections[1];
		    var cblk2 = blocks.blockList[blk].connections[2];
		    var a = parseArg(turtle, cblk1);
		    var b = parseArg(turtle, cblk2);
		    blocks.blockList[blk].value = (a = b);
		    break;
		case 'less':
		    var cblk1 = blocks.blockList[blk].connections[1];
		    var cblk2 = blocks.blockList[blk].connections[2];
		    var a = parseArg(turtle, cblk1);
		    var b = parseArg(turtle, cblk2);
		    blocks.blockList[blk].value = (Number(a) < Number(b));
		    break;
		case 'random':
		    var cblk1 = blocks.blockList[blk].connections[1];
		    var cblk2 = blocks.blockList[blk].connections[2];
		    var a = parseArg(turtle, cblk1);
		    var b = parseArg(turtle, cblk2);
		    blocks.blockList[blk].value = doRandom(a, b);
		    break;
		case 'plus':
		    var cblk1 = blocks.blockList[blk].connections[1];
		    var cblk2 = blocks.blockList[blk].connections[2];
		    var a = parseArg(turtle, cblk1);
		    var b = parseArg(turtle, cblk2);
		    blocks.blockList[blk].value = doPlus(a, b);
		    break;
		case 'multiply':
		    var cblk1 = blocks.blockList[blk].connections[1];
		    var cblk2 = blocks.blockList[blk].connections[2];
		    var a = parseArg(turtle, cblk1);
		    var b = parseArg(turtle, cblk2);
		    blocks.blockList[blk].value = doMultiply(a, b);
		    break;
		case 'divide':
		    var cblk1 = blocks.blockList[blk].connections[1];
		    var cblk2 = blocks.blockList[blk].connections[2];
		    var a = parseArg(turtle, cblk1);
		    var b = parseArg(turtle, cblk2);
		    blocks.blockList[blk].value = doDivide(a, b);
		    break;
		case 'minus':
		    var cblk1 = blocks.blockList[blk].connections[1];
		    var cblk2 = blocks.blockList[blk].connections[2];
		    var a = parseArg(turtle, cblk1);
		    var b = parseArg(turtle, cblk2);
		    blocks.blockList[blk].value = doMinus(a, b);
		    break;
		case 'heading':
		    blocks.blockList[blk].value = turtles.turtleList[turtle].orientation;
		    break;
		case 'x':
		    blocks.blockList[blk].value = turtles.screenX2turtleX(turtles.turtleList[turtle].container.x);
		    break;
		case 'y':
		    blocks.blockList[blk].value = turtles.invertY(turtles.turtleList[turtle].container.y);
		    break;
		case 'color':
		    blocks.blockList[blk].value = turtles.turtleList[turtle].color;
		    break;
		case 'shade':
		    blocks.blockList[blk].value = turtles.turtleList[turtle].value;
		    break;
		case 'grey':
		    blocks.blockList[blk].value = turtles.turtleList[turtle].chroma;
		    break;
		case 'pensize':
		    blocks.blockList[blk].value = turtles.turtleList[turtle].stroke;
		    break;
		case 'mousex':
		    blocks.blockList[blk].value = stageX;
		    break;
		case 'mousey':
		    blocks.blockList[blk].value = stageY;
		    break;
		case 'mousebutton':
		    blocks.blockList[blk].value = stageMouseDown;
		    break;
		case 'time':
		    var d = new Date();
		    blocks.blockList[blk].value = (d.getTime() - time) / 1000;
		    break;
		}
		return blocks.blockList[blk].value;
	    } else {
		return blk;
	    }
	}

	function hideBlocks() {
	    // Hide all the blocks.
	    blocks.hide();
	    // And hide some other things.
	    for (var turtle = 0; turtle < turtles.turtleList.length; turtle++) {
		turtles.turtleList[turtle].container.visible = false;
	    }
	    trashcan.hide();
	    update = true;
	}

	function showBlocks() {
	    // Show all the blocks.
	    blocks.show();
	    blocks.bringToTop();
	    // And show some other things.
	    for (var turtle = 0; turtle < turtles.turtleList.length; turtle++) {
		turtles.turtleList[turtle].container.visible = true;
	    }
	    trashcan.show();
	    update = true;
	}

	function hideCartesian() {
	    cartesianBitmap.visible = false;
	    cartesianBitmap.updateCache();
	    update = true;
	}

	function showCartesian() {
	    cartesianBitmap.visible = true;
	    cartesianBitmap.updateCache();
	    update = true;
	}

	function hidePolar() {
	    polarBitmap.visible = false;
	    polarBitmap.updateCache();
	    update = true;
	}

	function showPolar() {
	    polarBitmap.visible = true;
	    polarBitmap.updateCache();
	    update = true;
	}

	// Publish to FB
	function doPublish(desc) {
	    var url = doSave();
	    console.log('push ' + url + ' to FB');
            var descElem = docById("description");
	    var msg = desc + ' ' + descElem.value + ' ' + url;
	    console.log('comment: ' + msg);
	    var post_cb = function() {
		FB.api('/me/feed', 'post', {message: msg});
            };

	    FB.login(post_cb, {scope: 'publish_actions'});
	}

	function doWait(secs) {
	    waitTime = secs * 1000;
	}

	// Logo functions
        function doStorein(name, value) {
	    if (name != null) {
		i = findBox(name);
		if (i == null) {
		    boxList.push([name, value]);
		} else {
		    boxList[i][1] = value;
		}
	    }
	}

	// Math functions
	function doRandom(a, b) {
	    var r = Math.floor(Math.random() * (Number(b) - Number(a) + 1) + Number(a));
	    return Math.floor(Math.random() * (Number(b) - Number(a) + 1) + Number(a));
	}

	function doPlus(a, b) {
	    r = Number(a) + Number(b);
	    return Number(a) + Number(b);
	}

	function doMinus(a, b) {
	    r = Number(a) - Number(b);
	    return Number(a) - Number(b);
	}

	function doMultiply(a, b) {
	    r = Number(a) * Number(b);
	    return Number(a) * Number(b);
	}

	function doDivide(a, b) {
	    // TODO: Alert
	    if (Number(b) == 0) {
		return NaN;
	    } else {
		return Number(a) / Number(b);
	    }
	}

	function doSaveSVG(desc) {
	    var head = '<!DOCTYPE html>\n<html>\n<head>\n<title>' + desc + '</title>\n</head>\n<body>\n';
	    var svg = doSVG(0.4); // scale for saving thumbnail
	    var tail = '</body>\n</html>';
	    console.log(head + svg + tail);
	    // TODO: figure out if popups are blocked
	    var svgWindow = window.open(desc, "_blank", "width=304, height=228");
	    svgWindow.document.write(head + svg + tail);
	}

	function doSVG(scale) {
	    var svg = '<svg width="320" height="240">\n';
	    svg += '<g transform="scale(' + scale + ',' + scale + ')">\n';
	    svg += this.svgOutput;
	    for (var t in turtles.turtleList) {
		svg += turtles.turtleList[t].svgOutput;
	    }
	    svg += '</g>';
	    svg += '</svg>';
	    return svg;
	}

	function setBackgroundColor(turtle) {
	    /// change body background in DOM to current color
	    var body = docById('body');
	    if (turtle == -1) {
		body.style.background = canvasColor;
	    } else {
		body.style.background = turtles.turtleList[turtle].canvasColor;
	    }
	    this.svgOutput = '<rect x="0" y="0" height="' + canvas.height + '" width="' + canvas.width + ' "fill="' + body.style.background + '"/>\n';
	}

	function allClear() {
	    // Clear all the boxes.
	    boxList = [];
	    time = 0;
	    canvasColor = getMunsellColor(
		defaultBackgroundColor[0], defaultBackgroundColor[1], defaultBackgroundColor[2]);
	    setBackgroundColor(-1);
	    for (var turtle = 0; turtle < turtles.turtleList.length; turtle++) {
		turtles.turtleList[turtle].doClear();
	    }
	}

	function findBox(name) {
	    // Return the index of the box with name name.
	    for (i = 0; i < boxList.length; i++) {
		if (boxList[i][0] == name) {
		    return i;
		}
	    }
	    return null;
	}

	function prepareExport() {
	    // We don't save blocks in the trash, so we need to
	    // consolidate the block list and remap the connections.
	    var blockMap = [];
	    for (var blk = 0; blk < blocks.blockList.length; blk++) {
		var myBlock = blocks.blockList[blk];
		if (myBlock.trash) {
		    // Don't save blocks in the trash.
		    continue;
		}
		blockMap.push(blk);
	    }

	    var data = [];
	    for (var blk = 0; blk < blocks.blockList.length; blk++) {
		var myBlock = blocks.blockList[blk];
		if (myBlock.trash) {
		    // Don't save blocks in the trash.
		    continue;
		}
		if (blocks.blockList[blk].isValueBlock()) {
		    var name = [myBlock.name, myBlock.value];
		} else {
		    var name = myBlock.name;
		}

		connections = [];
		for (var c = 0; c < myBlock.connections.length; c++) {
		    connections.push(blockMap[myBlock.connections[c]]);
		}
		data.push([blockMap.indexOf(blk), name, myBlock.container.x, myBlock.container.y, connections]);
	    }
	    return JSON.stringify(data);
	}

	function doOpen() {
	    var fileChooser = docById("myOpenFile");
	    fileChooser.addEventListener("change", function(event) {

		// Read file here.
		// console.log('fileChooser ' + this.value);
		var reader = new FileReader();

		reader.onload = (function(theFile) {
		    var rawData = reader.result;
		    var cleanData = rawData.replace('\n', ' ');
		    var obj = JSON.parse(cleanData);
		    // console.log(obj);
		    blocks.load(obj);
		});

		reader.readAsText(fileChooser.files[0]);
	    }, false);

            fileChooser.focus();
	    fileChooser.click();
	}

	function doSave() {
	    // Save file to turtle.sugarlabs.org
            var titleElem = docById("title");
	    if (titleElem.value.length == 0) {
		// FIXME: ask for a title
		console.log('saving to unknown');
		return saveProject('unknown');
	    } else {
		console.log('saving to ' + titleElem.value);
		return saveProject(titleElem.value);
	    }

	    // var fileChooser = docById("mySaveFile");
	    // fileChooser.addEventListener("change", function(event) {
		// Do something here.
		// console.log('fileChooser ' + this.value);
	    // }, false);
            // fileChooser.focus();
	    // fileChooser.click();
	}

    });

});
