// All things related to blocks and palettes

// Define palette objects
function Palette (name) {
    this.name = name;
    this.color = 'white';
    this.backgroundColor = 'green';
    this.blockList = [];
};

Palette.prototype.getInfo = function() {
    return this.color + ' ' + this.name + ' palette: ' + this.blockList;
};

// Instantiate the palettes
var paletteList = [];

var turtlePalette = new Palette('turtle');
paletteList.push(turtlePalette);
turtlePalette.color = 'white';
turtlePalette.backgroundColor = 'green';

var penPalette = new Palette('pen');
paletteList.push(penPalette);
penPalette.color = 'black';
penPalette.backgroundColor = 'cyan';

var numberPalette = new Palette('number');
paletteList.push(numberPalette);
numberPalette.color = 'white';
numberPalette.backgroundColor = 'purple';

var flowPalette = new Palette('flow');
paletteList.push(flowPalette);
flowPalette.color = 'black';
flowPalette.backgroundColor = 'orange';

var blocksPalette = new Palette('blocks');
paletteList.push(blocksPalette);
blocksPalette.color = 'black';
blocksPalette.backgroundColor = 'yellow';

var sensorsPalette = new Palette('sensors');
paletteList.push(sensorsPalette);
sensorsPalette.color = 'white';
sensorsPalette.backgroundColor = 'red';

currentPalette = 0;  // Turtle

// Define block proto objects
function ProtoBlock (name) {
    this.name = name;
    this.palette = null;
    this.style = null;
    this.expandable = false;
    this.args = 0;
    this.defaults = [];
    this.size = 1;
    this.docks = [];
}

ProtoBlock.prototype.getInfo = function() {
    return this.backgroundColor + ' ' + this.name + ' block';
}

ProtoBlock.prototype.getSvgPath = function() {
    return 'images/' + this.name + '.svg';
}

ProtoBlock.prototype.getFillerSvgPath = function() {
    return 'images/' + this.palette.name + '-filler.svg';
}

ProtoBlock.prototype.getBottomSvgPath = function() {
    return 'images/' + this.palette.name + '-bottom.svg';
}

ProtoBlock.prototype.getArgFillerSvgPath = function() {
    return 'images/' + this.palette.name + '-arg-filler.svg';
}

ProtoBlock.prototype.getArgBottomSvgPath = function() {
    return 'images/' + this.palette.name + '-arg-bottom.svg';
}

ProtoBlock.prototype.getSpecialFillerSvgPath = function() {
    return 'images/' + this.name + '-filler.svg';
}

ProtoBlock.prototype.getSpecialBottomSvgPath = function() {
    return 'images/' + this.name + '-bottom.svg';
}

// Instantiate the proto blocks
var protoBlockList = []

// Turtle palette
var clearBlock = new ProtoBlock('clear');
protoBlockList.push(clearBlock);
clearBlock.palette = turtlePalette;
turtlePalette.blockList.push(clearBlock);
clearBlock.docks = [[20, 0, 'out'], [20, 42, 'in']];

var forwardBlock = new ProtoBlock('forward');
protoBlockList.push(forwardBlock);
forwardBlock.palette = turtlePalette;
turtlePalette.blockList.push(forwardBlock);
forwardBlock.args = 1;
forwardBlock.defaults.push(100);
forwardBlock.docks = [[20, 0, 'out'], [98, 20, 'numberin'], [20, 42, 'in']];

var rightBlock = new ProtoBlock('right');
protoBlockList.push(rightBlock);
rightBlock.palette = turtlePalette;
turtlePalette.blockList.push(rightBlock);
rightBlock.args = 1;
rightBlock.defaults.push(90);
rightBlock.docks = [[20, 0, 'out'], [98, 20, 'numberin'], [20, 42, 'in']];

var backBlock = new ProtoBlock('back');
protoBlockList.push(backBlock);
backBlock.palette = turtlePalette;
turtlePalette.blockList.push(backBlock);
backBlock.args = 1;
backBlock.defaults.push(100);
backBlock.docks = [[20, 0, 'out'], [98, 20, 'numberin'], [20, 42, 'in']];

var leftBlock = new ProtoBlock('left');
protoBlockList.push(leftBlock);
leftBlock.palette = turtlePalette;
turtlePalette.blockList.push(leftBlock);
leftBlock.args = 1;
leftBlock.defaults.push(90);
leftBlock.docks = [[20, 0, 'out'], [98, 20, 'numberin'], [20, 42, 'in']];

// Pen palette
var setcolorBlock = new ProtoBlock('setcolor');
protoBlockList.push(setcolorBlock);
setcolorBlock.palette = penPalette;
penPalette.blockList.push(setcolorBlock);
setcolorBlock.args = 1;
setcolorBlock.defaults.push(0);
setcolorBlock.docks = [[20, 0, 'out'], [98, 20, 'numberin'], [20, 42, 'in']];

var colorBlock = new ProtoBlock('color');
protoBlockList.push(colorBlock);
colorBlock.palette = penPalette;
penPalette.blockList.push(colorBlock);
colorBlock.style = 'arg';
colorBlock.docks = [[0, 20, 'numberout']];

// Numbers palette
var numberBlock = new ProtoBlock('number');
protoBlockList.push(numberBlock);
numberBlock.palette = numberPalette;
numberPalette.blockList.push(numberBlock);
numberBlock.style = 'value';
numberBlock.docks = [[0, 20, 'numberout']];

var plusBlock = new ProtoBlock('plus');
protoBlockList.push(plusBlock);
plusBlock.palette = numberPalette;
numberPalette.blockList.push(plusBlock);
plusBlock.yoff = 49;
plusBlock.loff = 42;
plusBlock.expandable = true;
plusBlock.style = 'arg';
plusBlock.size = 2;
plusBlock.args = 2;
plusBlock.docks = [[0, 20, 'numberout'], [68, 20, 'numberin'],
		   [68, 62, 'numberin']];

var greaterBlock = new ProtoBlock('greater');
protoBlockList.push(greaterBlock);
greaterBlock.palette = numberPalette;
numberPalette.blockList.push(greaterBlock);
greaterBlock.style = 'arg';
greaterBlock.size = 2;
greaterBlock.args = 2;
greaterBlock.docks = [[0, 40, 'booleanout'], [86, 20, 'numberin'],
 		      [86, 62, 'numberin']];

// Blocks palette
var textBlock = new ProtoBlock('text');
protoBlockList.push(textBlock);
textBlock.palette = blocksPalette;
blocksPalette.blockList.push(textBlock);
textBlock.style = 'value';
textBlock.docks = [[0, 20, 'textout']];

var boxBlock = new ProtoBlock('box');
protoBlockList.push(boxBlock);
boxBlock.palette = blocksPalette;
blocksPalette.blockList.push(boxBlock);
boxBlock.args = 1;
boxBlock.defaults.push('box');
boxBlock.style = 'arg';
boxBlock.docks = [[0, 20, 'numberout'], [68, 20, 'textin']];

var storeinBlock = new ProtoBlock('storein');
protoBlockList.push(storeinBlock);
storeinBlock.palette = blocksPalette;
blocksPalette.blockList.push(storeinBlock);
storeinBlock.yoff = 49;
storeinBlock.loff = 42;
storeinBlock.expandable = true;
storeinBlock.style = 'special';
storeinBlock.size = 2;
storeinBlock.args = 2;
storeinBlock.defaults.push('box');
storeinBlock.defaults.push(100);
storeinBlock.docks = [[20, 0, 'out'], [98, 20, 'textin'],
		      [98, 62, 'numberin'], [20, 84, 'in']];

var runBlock = new ProtoBlock('run');
protoBlockList.push(runBlock);
runBlock.palette = blocksPalette;
blocksPalette.blockList.push(runBlock);
runBlock.args = 1;
runBlock.defaults.push('action');
runBlock.docks = [[20, 0, 'out'], [98, 20, 'textin'], [20, 42, 'in']];

var actionBlock = new ProtoBlock('action');
protoBlockList.push(actionBlock);
actionBlock.palette = blocksPalette;
blocksPalette.blockList.push(actionBlock);
actionBlock.yoff = 86;
actionBlock.loff = 42;
actionBlock.args = 1;
actionBlock.defaults.push('action');
actionBlock.expandable = true;
actionBlock.style = 'clamp';
actionBlock.docks = [[20, 0, 'unavailable'], [98, 34, 'textin'],
		     [38, 55, 'in'], [20, 80, 'unavailable']];

var startBlock = new ProtoBlock('start');
protoBlockList.push(startBlock);
startBlock.palette = blocksPalette;
blocksPalette.blockList.push(startBlock);
startBlock.yoff = 86;
startBlock.loff = 42;
startBlock.args = 1;
startBlock.expandable = true;
startBlock.style = 'clamp';
startBlock.docks = [[20, 0, 'unavailable'], [38, 55, 'in'],
		    [20, 80, 'unavailable']];

// Flow palette
var repeatBlock = new ProtoBlock('repeat');
protoBlockList.push(repeatBlock);
repeatBlock.palette = flowPalette;
flowPalette.blockList.push(repeatBlock);
repeatBlock.yoff = 74;
repeatBlock.loff = 42;
repeatBlock.expandable = true;
repeatBlock.style = 'clamp';
repeatBlock.size = 2;
repeatBlock.args = 2;
repeatBlock.defaults.push(4);
repeatBlock.docks = [[20, 0, 'out'], [98, 20, 'numberin'], [38, 42, 'in'],
		     [20, 126, 'in']];

var ifBlock = new ProtoBlock('if');
protoBlockList.push(ifBlock);
ifBlock.palette = flowPalette;
flowPalette.blockList.push(ifBlock);
ifBlock.yoff = 116;
ifBlock.loff = 42;
ifBlock.expandable = true;
ifBlock.style = 'clamp';
ifBlock.size = 3;
ifBlock.args = 2;
ifBlock.docks = [[20, 0, 'out'], [56, 40, 'booleanin'], [38, 84, 'in'],
 		 [20, 168, 'in']];

var vspaceBlock = new ProtoBlock('vspace');
protoBlockList.push(vspaceBlock);
vspaceBlock.palette = flowPalette;
flowPalette.blockList.push(vspaceBlock);
vspaceBlock.docks = [[20, 0, 'out'], [20, 42, 'in']];

// Sensors palette
var timeBlock = new ProtoBlock('time');
protoBlockList.push(timeBlock);
timeBlock.palette = sensorsPalette;
sensorsPalette.blockList.push(timeBlock);
timeBlock.style = 'arg';
timeBlock.docks = [[0, 20, 'numberout']];

var mousexBlock = new ProtoBlock('mouse x');
protoBlockList.push(mousexBlock);
mousexBlock.palette = sensorsPalette;
sensorsPalette.blockList.push(mousexBlock);
mousexBlock.style = 'arg';
mousexBlock.docks = [[0, 20, 'numberout']];

var mouseyBlock = new ProtoBlock('mouse y');
protoBlockList.push(mouseyBlock);
mouseyBlock.palette = sensorsPalette;
sensorsPalette.blockList.push(mouseyBlock);
mouseyBlock.style = 'arg';
mouseyBlock.docks = [[0, 20, 'numberout']];

// Define block instance objects
function Block (protoblock) {
    this.protoblock = protoblock;
    this.name = protoblock.name;
    this.label = null;
    this.value = null;
    this.image = null;
    this.bitmap = null;
    this.x = 0;
    this.y = 0;
    this.docks = [];  // Proto dock is copied here.
    this.connections = [];
}

Block.prototype.copyDocks = function() {
    for (var i = 0; i < this.protoblock.docks.length; i++) {
	this.docks.push(this.protoblock.docks[i]);
    }
}

Block.prototype.getInfo = function() {
    return this.name + ' block';
}

// Some functions we need from activity.js
var updater = null;
var adjuster = null;

// A place to keep the blocks we create...
var blockList = [];

// We need to keep track of certain classes of blocks that exhibit
// different types of behavior:

var expandableBlocks = [];  // Blocks with parts that expand
var clampBlocks = [];  // Blocks that contain other blocks
var argBlocks = [];  // Blocks that are used as arguments to other blocks
var valueBlocks = [];  // Blocks that return values
var specialBlocks = [];  // Blocks with special parts
for (i = 0; i < protoBlockList.length; i++) {
    if (protoBlockList[i].expandable) {
	expandableBlocks.push(protoBlockList[i].name);
    }
    if (protoBlockList[i].style == 'clamp') {
	clampBlocks.push(protoBlockList[i].name);
    }
    if (protoBlockList[i].style == 'special') {
	specialBlocks.push(protoBlockList[i].name);
    }
    if (protoBlockList[i].style == 'arg') {
	argBlocks.push(protoBlockList[i].name);
    }
    if (protoBlockList[i].style == 'value') {
	argBlocks.push(protoBlockList[i].name);
	valueBlocks.push(protoBlockList[i].name);
    }
}

// Blocks that cannot be run on their own
var noRunBlocks = ['action'];

// and a place in the DOM to put them.
var labelElem = document.getElementById('labelDiv');

// and a place in the DOM to put palettes.
var paletteElem = document.getElementById('header');

colorTable = ['#FF0000', '#FF0D00', '#FF1A00', '#FF2600', '#FF3300',
	      '#FF4000', '#FF4D00', '#FF5900', '#FF6600', '#FF7300',
	      '#FF8000', '#FF8C00', '#FF9900', '#FFA600', '#FFB300',
	      '#FFBF00', '#FFCC00', '#FFD900', '#FFE600', '#FFF200',
	      '#FFFF00', '#E6FF00', '#CCFF00', '#B3FF00', '#99FF00',
	      '#80FF00', '#66FF00', '#4DFF00', '#33FF00', '#1AFF00',
	      '#00FF00', '#00FF0D', '#00FF1A', '#00FF26', '#00FF33',
	      '#00FF40', '#00FF4D', '#00FF59', '#00FF66', '#00FF73',
	      '#00FF80', '#00FF8C', '#00FF99', '#00FFA6', '#00FFB3',
	      '#00FFBF', '#00FFCC', '#00FFD9', '#00FFE6', '#00FFF2',
	      '#00FFFF', '#00F2FF', '#00E6FF', '#00D9FF', '#00CCFF',
	      '#00BFFF', '#00B3FF', '#00A6FF', '#0099FF', '#008CFF',
	      '#0080FF', '#0073FF', '#0066FF', '#0059FF', '#004DFF',
	      '#0040FF', '#0033FF', '#0026FF', '#001AFF', '#000DFF',
	      '#0000FF', '#0D00FF', '#1A00FF', '#2600FF', '#3300FF',
	      '#4000FF', '#4D00FF', '#5900FF', '#6600FF', '#7300FF',
	      '#8000FF', '#8C00FF', '#9900FF', '#A600FF', '#B300FF',
	      '#BF00FF', '#CC00FF', '#D900FF', '#E600FF', '#F200FF',
	      '#FF00FF', '#FF00E6', '#FF00CC', '#FF00B3', '#FF0099',
	      '#FF0080', '#FF0066', '#FF004D', '#FF0033', '#FF001A'];


function $() {
    var elements = new Array();

    for (var i = 0; i < arguments.length; i++) {
	var element = arguments[i];
	if (typeof element == 'string')
	    element = document.getElementById(element);
	if (arguments.length == 1)
	    return element;
	elements.push(element);
    }
    return elements;
}

// Generate the IDs for the DOM elements we need
function getPaletteButtonId(palette) {
    return '_' + paletteList[palette].name + '_palette_button';
}

function getPaletteId(palette) {
    return '_' + paletteList[palette].name + '_palette_div';
}

function getBlockButtonId(palette, blk) {
    return '_' + paletteList[palette].blockList[blk].name + '_block_button';
}

function getBlockId(blk) {
    return '_' + blk.toString();
}

// Toggle which palette is visible, updating button colors
function toggle(name) {
    // TODO: change color of buttons and button backgrounds
    // refactor to generate Ids on the fly from palette name

    var palette = Number(name);
    var paletteButtonId = getPaletteButtonId(palette);
    var paletteId = getPaletteId(palette);
    var currentPaletteId = getPaletteId(currentPalette);
    var currentPaletteButtonId = getPaletteButtonId(currentPalette);
    document.getElementById(currentPaletteButtonId).style.backgroundColor = '#808080';
    document.getElementById(currentPaletteButtonId).style.color = '#ffffff';
    document.getElementById(paletteButtonId).style.backgroundColor = paletteList[palette].backgroundColor;
    document.getElementById(paletteButtonId).style.color = paletteList[palette].color;

    toggler(currentPaletteId);
    toggler(paletteId);
    currentPalette = palette;
}

function toggler(obj) {
    for ( var i=0; i < arguments.length; i++ ) {
	$(arguments[i]).style.display = ($(arguments[i]).style.display != 'none' ? 'none' : '');
    }
}

// Palettes live in the DOM for the time being:
// a row of palette buttons and a row of block buttons for each palette
function updatePalettes() {
    // Modify the header id with palette info.
    var html = ''
    var text = ''
    for (var palette = 0; palette < paletteList.length; palette++) {
	text = '<button id="' + getPaletteButtonId(palette) + '" ' +
	    'onclick="return toggle(\'' + palette + // getPaletteId(palette) +
	    '\');">' + paletteList[palette].name + '</button>';
	html = html + text;
    }

    for (var palette = 0; palette < paletteList.length; palette++) {
	text = '<div id="' + getPaletteId(palette) + '">';
	html = html + text;
	for (var blk = 0; blk < paletteList[palette].blockList.length; blk++) {
	    text = '<button id="' + 
		getBlockButtonId(palette, blk) + '"' +
		' class="' + paletteList[palette].backgroundColor + '"' + 
		' onclick="return makeBlock(\'' +
		paletteList[palette].blockList[blk].name + '\');">' +
		paletteList[palette].blockList[blk].name + '</button>';
	    html = html + text;
	}
	text = '</div>';
	html = html + text;
    }
    paletteElem.innerHTML = html;

    // Open the turtle palette to start
    toggle('0');
    // and hide all the others
    for (var palette = 1; palette < paletteList.length; palette++) {
	toggler(getPaletteId(palette));
    }
}

function makeBlock(name) {
    for (proto=0; proto < protoBlockList.length; proto++) {
	if (protoBlockList[proto].name == name) {
	    blockList.push(new Block(protoBlockList[proto]));
	    break;
	}
    }
    blk = blockList.length - 1;
    blockList[blk].copyDocks();
    for (i = 0; i < blockList[blk].docks.length; i++) {
	blockList[blk].connections.push(null);
    }

    // Attach default args if any
    cblk = blk + 1;
    for (i = 0; i < blockList[blk].protoblock.defaults.length; i++) {
	var value = blockList[blk].protoblock.defaults[i];
	if (blockList[blk].docks[i + 1][2] == 'textin') {
	    blockList.push(new Block(textBlock));
	} else {
	    blockList.push(new Block(numberBlock));
	}
	blockList[cblk + i].copyDocks();
	blockList[cblk + i].connections = [blk];
	blockList[cblk + i].value = value;
	blockList[blk].connections[i + 1] = cblk + i;
    }

    // Generate and position the block bitmaps and labels
    updater();
    adjuster(blk);
}

// The modifiable labels are stored in the DOM with a
// unique id for each block.  For the moment, we only have
// labels for number and text blocks.
function updateBlockLabels() {
    var html = ''
    var text = ''
    var value = ''
    for (var blk = 0; blk < blockList.length; blk++) {
	if (blockList[blk].name == 'number') {
	    if (blockList[blk].label == null) {
		if (blockList[blk].value == null) {
		    blockList[blk].value = 100;
		}
		value = blockList[blk].value.toString();
	    } else {
		value = blockList[blk].label.value;
	    }
	    text = '<textarea id="' + getBlockId(blk) +
		'" style="position: absolute; ' + 
		'-webkit-user-select: text;" ' +
		'class="number", ' +
		'cols="6", rows="1", maxlength="6">' +
		value + '</textarea>'
	} else if (blockList[blk].name == 'text') {
	    if (blockList[blk].label == null) {
		if (blockList[blk].value == null) {
		    blockList[blk].value = 'text';
		}
		value = blockList[blk].value;
	    } else {
		value = blockList[blk].label.value;
	    }
	    text = '<textarea id="' + getBlockId(blk) +
		'" style="position: absolute; ' + 
		'-webkit-user-select: text;" ' +
		'class="text", ' +
		'cols="6", rows="1", maxlength="6">' +
		value + '</textarea>'
	} else {
	    text = ''
	}
	html = html + text
    }
    labelElem.innerHTML = html;

    // Then create a list of the label elements
    for (var blk = 0; blk < blockList.length; blk++) {
	var myBlock = blockList[blk];
	if (myBlock.bitmap == null) {
	    var x = myBlock.x
	    var y = myBlock.y
	} else {
	    var x = myBlock.bitmap.x
	    var y = myBlock.bitmap.y
	}
	if (isValueBlock(blk)) {
	    myBlock.label = document.getElementById(getBlockId(blk));
	    myBlock.label.addEventListener('change', function() {
		labelChanged(myBlock);
	    });
	    adjustLabelPosition(blk, x, y);
	} else {
	    myBlock.label = null;
	}
    }
}

function labelChanged(block) {
    // Update the block values as they change in the DOM label
    if (block.label != null) {
	console.log(block.label.value);
	block.value = block.label.value;
    }
    // If the label was the name of an action, update the
    // associated run blocks and the palette buttons

    // If the label was the name of a storein, update the
    //associated box blocks and the palette buttons

}

function adjustLabelPosition(canvas, blk, x, y) {
    // Move the label when the block moves.
    if (blockList[blk].label == null) {
	return;
    }
    if (blockList[blk].protoblock.name == 'number') {
	blockList[blk].label.style.left = Math.round(
	    x + canvas.offsetLeft + 30) + 'px';
    } else if (blockList[blk].protoblock.name == 'text') {
	blockList[blk].label.style.left = Math.round(
	    x + canvas.offsetLeft + 30) + 'px';
    } else {
	blockList[blk].label.style.left = Math.round(
	    x + canvas.offsetLeft + 10) + 'px';
    }
    blockList[blk].label.style.top = Math.round(
	y + canvas.offsetTop + 5) + 'px';
}

// Utility functions
function isValueBlock(blk) {
    if (valueBlocks.indexOf(blockList[blk].name) != -1) {
	return true;
    } else {
	return false;
    }
}

function isArgBlock(blk) {
    if (argBlocks.indexOf(blockList[blk].name) != -1) {
	return true;
    } else {
	return false;
    }
}

function isSpecialBlock(blk) {
    if (specialBlocks.indexOf(blockList[blk].name) != -1) {
	return true;
    } else {
	return false;
    }
}

function isClampBlock(blk) {
    if (clampBlocks.indexOf(blockList[blk].name) != -1) {
	return true;
    } else {
	return false;
    }
}

function isNoRunBlock(blk) {
    if (noRunBlocks.indexOf(blockList[blk].name) != -1) {
	return true;
    } else {
	return false;
    }
}

function isExpandableBlock(blk) {
    if (expandableBlocks.indexOf(blockList[blk].name) != -1) {
	return true;
    } else {
	return false;
    }
}
