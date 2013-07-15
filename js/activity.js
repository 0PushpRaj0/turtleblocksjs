define(function (require) {
    var activity = require("sugar-web/activity/activity");
    var icon = require("sugar-web/graphics/icon");
    require("easel");

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {

        // Initialize the activity.
        activity.setup();

        // Colorize the activity icon.
        var activityButton = document.getElementById("activity-button");
        activity.getXOColor(function (error, colors) {
            icon.colorize(activityButton, colors);
        });

        var newButton = document.getElementById("new-button");
        newButton.onclick = function () {
            new_positions();
        }

        // Make the activity stop with the stop button.
        var stopButton = document.getElementById("stop-button");
        stopButton.addEventListener('click', function (e) {
            activity.close();
        });

        var canvas, stage;

        // the display object currently under the mouse, or being dragged
        var mouseTarget;
        // indicates whether we are currently in a drag operation
        var dragStarted;
        var offset;
        var update = true;
        var drawingCanvas;
        var oldPt;
        var midPt;
        var oldMidPt;
        var color;
        var stroke;
        var colors;
        var index;
        var imagepos = new Array();
        var myimages = new Array();
        var bitmaps = new Array();
        var pen_bitmap;
        var Star = "images/star.svg";
        var Dot = "images/dot.svg";
        var Pen = "images/pen.svg";
        var triangle = [[400, 150], [550, 400], [250, 400], [400, 100]];
        var square = [[250, 100], [600, 100], [600, 400], [200, 400],
		      [200, 100]];
        var circle = [[175, 400], [150, 300], [200, 100], [400, 50], [600, 100],
                      [650, 300], [600, 500], [400, 550], [200, 500]];
	var star = [[400, 100], [200, 500], [650, 200], [150, 200], [600, 500],
		   [400, 50]];
        var flower = [[293, 16], [352, 101], [422, 20], [462, 120], [436, 257],
                      [334, 316], [324, 476], [550, 268], [555, 395],
		      [479, 530], [343, 558], [242, 558], [60, 487], [40, 263],
                      [252, 471], [264, 321], [155, 258], [131, 121],
                      [171, 26], [243, 91]];
	var cat = [[420,  93], [450, 104], [492,  63], [513, 152], [488, 203],
		   [500, 275], [445, 361], [447, 430], [478, 490], [392, 405],
                   [333, 461], [379, 483], [210, 499], [ 98, 526], [106, 571],
                   [ 54, 518], [178, 446], [210, 340], [282, 239], [401, 198],
                   [385,  83]];
        var hand = [[175, 150], [200, 125], [280, 220], [330, 200], [425, 25],
                    [440, 175], [540, 50], [480, 210], [620, 100], [520, 280],
                    [680, 270], [520, 330], [420, 420], [400, 450], [280, 450],
                    [260, 340], [200, 200]];
        var baby = [[300,   0], [345,  50], [313, 175], [358, 206], [475, 367],
                    [370, 313], [370, 408], [434, 501], [311, 600], [348, 504],
                    [300, 463], [210, 504], [248, 600], [124, 487], [191, 401],
                    [191, 303], [ 76, 367], [216, 205], [248, 175], [213,  50]];
        var moon = [[479, 530], [300, 419], [254, 286], [300, 137], [476, 45],
                    [293, 16], [160, 78], [76, 233], [122, 447], [294, 552]];
        var bird = [[557, 127], [492, 165], [493, 287], [444, 388], [317, 448],
                    [311, 496], [332, 536], [384, 558], [284, 558], [277, 436],
                    [165, 425], [25, 475], [75, 436], [25, 435], [212, 309],
                    [377, 183], [419, 111], [460, 87], [505, 106]];
        var fish = [[354, 25], [412, 80], [515, 130], [571, 202], [523, 220],
                    [549, 255], [418, 301], [322, 369], [353, 311], [243, 297],
                    [99, 224], [25, 319], [55, 182], [25, 52], [99, 147],
                    [234, 75], [356, 70]];
        var lightning = [[391, 25], [247, 50], [152, 299], [281, 293],
                         [209, 554], [430, 195], [285, 210], [363, 73]];
        var shapes = [triangle, square, circle, star, lightning,
                      moon, flower, fish, bird, cat, hand, baby];
        var shape = 0;
        var nlabels = [n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12,
                       n13, n14, n15, n16, n17, n18, n19, n20];

        function init() {
            if (window.top != window) {
                document.getElementById("header").style.display = "none";
            }
            document.getElementById("loader").className = "loader";
            // create stage and point it to the canvas:
            canvas = document.getElementById("testCanvas");

            index = 0;
            colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad",
                  "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00",
                  "#f9a71f"];
            oldPt = new createjs.Point(400, 300);
            midPt = oldPt;
            oldMidPt = oldPt;

            //check to see if we are running in a browser with touch support
            stage = new createjs.Stage(canvas);

            // enable touch interactions if supported on the current device:
            createjs.Touch.enable(stage);

            // keep tracking the mouse even when it leaves the canvas
            stage.mouseMoveOutside = true;

            // enabled mouse over / out events
            stage.enableMouseOver(10);

            // load the source images: a dot, a star and a turtle
            for (i = 0; i < nlabels.length; i++) {
                imagepos[i] = [-100, -100];
            }
            for (i = 0; i < nlabels.length; i++) {
                myimages[i] = new Image();
                if (i == 0) {
                    myimages[i].src = Star;
                } else {
                    myimages[i].src = Dot;
                }
                myimages[i].onload = handleImageLoad;
            }

            pen = new Image();
            pen.src = Pen;
            pen.onload = handlePenLoad;

            drawingCanvas = new createjs.Shape();
            stage.addChild(drawingCanvas);
            new_positions();
            stage.update();
        }

        function stop() {
            createjs.Ticker.removeEventListener("tick", tick);
        }

        function handleImageLoad(event) {
            var image = event.target;
            var imgW = image.width;
            var imgH = image.height;
            var bitmap;
            var container = new createjs.Container();
            stage.addChild(container);

            // create a shape that represents the center of the icon:
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#FFF").drawEllipse(-11, -14, 24, 18);
            // position hitArea relative to the internal coordinate system
            // of the target (bitmap instances):
            hitArea.x = imgW / 2;
            hitArea.y = imgH / 2;

            i = myimages.indexOf(image)
            // Create and populate the screen with number icons.
            bitmap = new createjs.Bitmap(image);
            bitmaps[i] = bitmap // Save now so we can reposition later.
            container.addChild(bitmap);
            bitmap.x = imagepos[i][0]
            bitmap.y = imagepos[i][1]
            bitmap.regX = imgW / 2 | 0;
            bitmap.regY = imgH / 2 | 0;
	    if (i == 0) {
	        bitmap.scaleX = bitmap.scaleY = bitmap.scale = 0.5
            } else {
	        bitmap.scaleX = bitmap.scaleY = bitmap.scale = 1.5
            }
            bitmap.name = "bmp_" + i;

            bitmap.cursor = "pointer";

            // Eventually, we can check this to make sure the number
            // has been touched.
            bitmap.hitArea = hitArea;

            (function (target) {})(bitmap);

            document.getElementById("loader").className = "";
            createjs.Ticker.addEventListener("tick", tick);
        }

        function handlePenLoad(event) {
            var image = event.target;
            var imgW = image.width;
            var imgH = image.height;
            var bitmap;
            var container = new createjs.Container();
            stage.addChild(container);

            // create a shape that represents the center of the icon
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#FFF").drawEllipse(-11, -14, 24, 18);
            // position hitArea relative to the internal coordinate system
            // of the target (bitmap instances):
            hitArea.x = imgW / 2;
            hitArea.y = imgH / 2;

            // create a pen
            pen_bitmap = new createjs.Bitmap(image);
            container.addChild(pen_bitmap);
            pen_bitmap.x = imagepos[0][0]
            pen_bitmap.y = imagepos[0][1]
            pen_bitmap.regX = imgW / 2 | 0;
            pen_bitmap.regY = imgH / 2 | 0;
            pen_bitmap.scaleX = pen_bitmap.scaleY = pen_bitmap.scale = 1
            pen_bitmap.name = "bmp_pen";

            pen_bitmap.cursor = "pointer";

            // assign the hitArea to each bitmap to use it for hit tests:
            pen_bitmap.hitArea = hitArea;

            // wrapper function to provide scope for the event handlers:
            (function (target) {
                pen_bitmap.onPress = function (evt) {
                    // bump the target in front of its siblings:
                    container.addChild(target);
                    var offset = {
                        x: target.x - evt.stageX,
                        y: target.y - evt.stageY
                    };

                    evt.onMouseMove = function (ev) {
                        target.x = ev.stageX + offset.x;
                        target.y = ev.stageY + offset.y;
                        // indicate that the stage should be updated
                        // on the next tick:
                        update = true;
                        var midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1,
                            oldPt.y + stage.mouseY >> 1);

                        drawingCanvas.graphics.setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

                        oldPt.x = stage.mouseX;
                        oldPt.y = stage.mouseY;

                        oldMidPt.x = midPt.x;
                        oldMidPt.y = midPt.y;
                    }
                }
                pen_bitmap.onMouseOver = function () {
                    target.scaleX = target.scaleY = target.scale * 1.2;
                    update = true;
                    color = colors[(index++) % colors.length];
                    stroke = Math.random() * 30 + 10 | 0;
                    oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
                    oldMidPt = oldPt;
                }
                pen_bitmap.onMouseOut = function () {
                    target.scaleX = target.scaleY = target.scale;
                    update = true;
                }
            })(pen_bitmap);

            document.getElementById("loader").className = "";
            createjs.Ticker.addEventListener("tick", tick);
        }

        function tick(event) {
            // this set makes it so the stage only re-renders when
            // an event handler indicates a change has happened.
            if (update) {
                update = false; // only update once
                stage.update(event);
            }
        }

        function new_positions() {
            for (i = 0; i < bitmaps.length; i++) {
                if (shape < shapes.length) {
                    if (i < shapes[shape].length) {
                        bitmaps[i].x = shapes[shape][i][0];
                        bitmaps[i].y = shapes[shape][i][1];
                    } else {
                        bitmaps[i].x = -100;
                        bitmaps[i].y = -100;
                    }
                } else {
                    bitmaps[i].x = canvas.width * Math.random() | 0;
                    bitmaps[i].y = canvas.height * Math.random() | 0;
                }
            }
            for (i = 0; i < bitmaps.length; i++) {
                // Put the label in the dot 
                if (i < 10) {
                    nlabels[i].style.left = Math.round(bitmaps[i].x + canvas.offsetLeft - 5) + "px";
                } else {
                    nlabels[i].style.left = Math.round(bitmaps[i].x + canvas.offsetLeft - 11) + "px";
                }
                nlabels[i].style.top = Math.round(bitmaps[i].y + canvas.offsetTop - 30) + "px";
            }

            pen_bitmap.x = bitmaps[0].x;
            pen_bitmap.y = bitmaps[0].y;

            drawingCanvas.graphics.clear();

            update = true;
            shape = shape + 1;
        }

        // Get things started
        init();
    });

});
