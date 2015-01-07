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

// All things related to palettes

var paletteBlocks = null;
var PALETTESCALE = 1.0;
var PALETTEOFFSET = 20;

function _(text) {
    // this function add a fallback for the case of translation not found
    // can be removed when we find how to read the localization.ini
    // file in the case of local html file opened in the browser
    translation = document.webL10n.get(text);
    if (translation == '') {
        translation = text;
    };
    return translation;
};



function paletteBlockButtonPush(name, arg) {
    // console.log('paletteBlockButtonPush' + name + ' ' + arg);
    blk = paletteBlocks.makeBlock(name, arg);
    return blk;
}


function Palettes(canvas, stage, cellSize, refreshCanvas) {
    this.canvas = canvas;
    this.stage = stage;
    this.cellSize = cellSize;
    this.halfCellSize = Math.floor(cellSize / 2);
    this.refreshCanvas = refreshCanvas;
    this.originalSize = 55; // this is the original svg size

    // The collection of palettes.
    this.dict = {};
    this.buttons = {};
    this.bitmaps = {};
    this.highlightBitmaps = {};

    this.visible = true;
    this.scale = 1.0;

    this.current = 'turtle';

    this.container = new createjs.Container();
    this.stage.addChild(this.container);

    this.setScale = function(scale) {
        this.scale = scale;
    }

    this.setDragging = function(setDraggingFlag) {
        this.setDraggingFlag = setDraggingFlag;
    }

    this.makeMenu = function() {
        // First, an icon/button for each palette
        this.x = 0;
        this.y = this.cellSize;
        for (var name in this.dict) {
            if (name in this.buttons) {
                this.dict[name].updateMenu(true);
            } else {
                this.buttons[name] = new createjs.Container();
                this.stage.addChild(this.buttons[name]);
                this.buttons[name].x = this.x;
                this.buttons[name].y = this.y;
                this.y += this.cellSize;

                function processButton(me, name, bitmap, extras) {
                    me.bitmaps[name] = bitmap;
                    me.buttons[name].addChild(me.bitmaps[name]);
                    if (me.cellSize != me.originalSize) {
                        bitmap.scaleX = me.cellSize / me.originalSize;
                        bitmap.scaleY = me.cellSize / me.originalSize;
                    }
                }

                makePaletteBitmap(this, PALETTEBUTTON.replace('fill_color', '#96d3f3'), name, processButton, null);

                function processHighlightButton(me, name, bitmap, extras) {
                    me.highlightBitmaps[name] = bitmap;
                    me.buttons[name].addChild(me.highlightBitmaps[name]);
                    me.highlightBitmaps[name].visible = false;

                    var image = new Image();
                    image.src = 'images/' + name + '.svg';
                    var icon = new createjs.Bitmap(image);
                    me.buttons[name].addChild(icon);
                    if (me.cellSize != me.originalSize) {
                        icon.scaleX = me.cellSize / me.originalSize;
                        icon.scaleY = me.cellSize / me.originalSize;
                    }

                    var hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill('#FFF').drawEllipse(-me.halfCellSize, -me.halfCellSize, me.cellSize, me.cellSize);
                    hitArea.x = me.halfCellSize;
                    hitArea.y = me.halfCellSize;
                    me.buttons[name].hitArea = hitArea;
                    me.buttons[name].visible = false;

                    me.dict[name].makeMenu();
                    me.dict[name].moveMenu(me.cellSize, me.cellSize);
                    me.dict[name].updateMenu(false);

                    loadPaletteButtonHandler(me, name);
                }

                makePaletteBitmap(this, PALETTEBUTTON.replace('fill_color', '#4d4d4d'), name, processHighlightButton, null);
            }
        }
    }

    this.showMenus = function() {
        // Show the menu buttons, but not the palettes.
        for (var name in this.buttons) {
            this.buttons[name].visible = true;
        }
        for (var name in this.dict) {
            // this.dict[name].showMenu(true);
        }
        this.refreshCanvas();
    }

    this.hideMenus = function() {
        // Hide the menu buttons and the palettes themselves.
        for (var name in this.buttons) {
            this.buttons[name].visible = false;
        }
        for (var name in this.dict) {
            this.dict[name].hideMenu(true);
        }
        this.refreshCanvas();
    }

    this.getInfo = function() {
        for (var key in this.dict) {
            console.log(this.dict[key].getInfo());
        }
    }

    this.updatePalettes = function() {
        this.makeMenu(); // the easel menus
        this.refreshCanvas();
    }

    this.hide = function() {
        this.hideMenus();
        this.visible = false;
    }

    this.show = function() {
        this.showMenus();
        this.visible = true;
    }

    this.setBlocks = function(blocks) {
        paletteBlocks = blocks;
    }

    this.add = function(name, color, bgcolor) {
        this.dict[name] = new Palette(this, name, color, bgcolor);
        return this;
    }

    this.bringToTop = function() {
        // Move all the palettes to the top layer of the stage
        for (var name in this.dict) {
            this.stage.removeChild(this.dict[name].menuContainer);
            this.stage.addChild(this.dict[name].menuContainer);
            for (var item in this.dict[name].protoContainers) {
                this.stage.removeChild(this.dict[name].protoContainers[item]);
                this.stage.addChild(this.dict[name].protoContainers[item]);
            }
        }
        this.refreshCanvas();
    }

    return this;
}


// Palette Button event handlers
function loadPaletteButtonHandler(palettes, name) {
    var locked = false;

    // A palette button opens or closes a palette.
    palettes.buttons[name].on('mouseover', function(event) {
        palettes.setDraggingFlag(true);
        palettes.bitmaps[name].visible = false;
        palettes.highlightBitmaps[name].visible = true;
        palettes.refreshCanvas();
    });

    palettes.buttons[name].on('pressup', function(event) {
        palettes.setDraggingFlag(false);
        palettes.bitmaps[name].visible = true;
        palettes.highlightBitmaps[name].visible = false;
        palettes.refreshCanvas();
    });

    palettes.buttons[name].on('mouseout', function(event) {
        palettes.setDraggingFlag(false);
        palettes.bitmaps[name].visible = true;
        palettes.highlightBitmaps[name].visible = false;
        palettes.refreshCanvas();
    });

    palettes.buttons[name].on('click', function(event) {
        if (locked) {
            console.log('debouncing click');
            return;
        }
        locked = true;
        setTimeout(function() {
            locked = false;
        }, 500);
        for (var i in palettes.dict) {
            if (palettes.dict[i] == palettes.dict[name]) {
                palettes.dict[name].showMenu(true);
                palettes.dict[name].showMenuItems(true);
            } else {
                if (palettes.dict[i].visible) {
                    palettes.dict[i].hideMenu(true);
                    palettes.dict[i].hideMenuItems(false);
                }
            }
        }
        palettes.refreshCanvas();
    });
}


// Define objects for individual palettes.
function Palette(palettes, name, color, bgcolor) {
    this.palettes = palettes;
    this.name = name;
    this.color = color;
    this.backgroundColor = bgcolor;
    this.visible = false;
    this.menuContainer = null;
    this.protoList = [];
    this.protoContainers = {};
    this.protoBackgrounds = {};
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.draggingProtoBlock = false;

    this.makeMenu = function() {
        // Create the menu button
        if (this.menuContainer == null) {
            this.menuContainer = new createjs.Container();

            function processHeader(palette, name, bitmap, extras) {
                palette.menuContainer.addChild(bitmap);

                var image = new Image();
                image.onload = function() {
                    var icon = new createjs.Bitmap(image);
                    icon.scaleX = 0.8;
                    icon.scaleY = 0.8;
                    palette.menuContainer.addChild(icon);
                    palette.palettes.container.addChild(palette.menuContainer);

                    var closeImage = new Image();
                    closeImage.onload = function() {
                        var closeIcon = new createjs.Bitmap(closeImage);
                        closeIcon.scaleX = 0.7;
                        closeIcon.scaleY = 0.7;
                        closeIcon.x = MENUWIDTH - STANDARDBLOCKHEIGHT;
                        palette.menuContainer.addChild(closeIcon);

                        var hitArea = new createjs.Shape();
                        hitArea.graphics.beginFill('#FFF').drawEllipse(-MENUWIDTH / 2, -STANDARDBLOCKHEIGHT / 2, MENUWIDTH, STANDARDBLOCKHEIGHT);
                        hitArea.x = MENUWIDTH / 2;
                        hitArea.y = STANDARDBLOCKHEIGHT / 2;
                        palette.menuContainer.hitArea = hitArea;
                        palette.menuContainer.visible = false;

                        loadPaletteMenuHandler(palette);
                    }
                    closeImage.src = 'images/close.svg';
                }
                image.src = 'images/' + palette.name + '.svg';
            }

            makePaletteBitmap(this, PALETTEHEADER.replace('fill_color', '#282828').replace('palette_label', _(this.name)), this.name, processHeader, null);
        }
    }

    this.updateMenu = function(hide) {
        if (this.menuContainer == null) {
            this.makeMenu();
        } else {
            // Hide the menu while we update.
            if (hide) {
                this.hide();
            }
        }
        for (var blk in this.protoList) {
            // Create a proto block for each palette entry.
            var blkname = this.protoList[blk].name;
            var modname = blkname;
            switch (blkname) {
                // Use the name of the action in the label
                case 'do':
                    modname = 'do ' + this.protoList[blk].defaults[0];
                    // Call makeBlock with the name of the action
                    var arg = this.protoList[blk].defaults[0];
                    break;
                case 'storein':
                    modname = 'store in ' + this.protoList[blk].defaults[0];
                    var arg = this.protoList[blk].defaults[0];
                    break;
                case 'box':
                    modname = this.protoList[blk].defaults[0];
                    var arg = this.protoList[blk].defaults[0];
                    break;
            }
            if (!this.protoContainers[modname]) {
                // create graphics for the palette entry for this block
                this.protoBackgrounds[modname] = new createjs.Container();
                this.protoContainers[modname] = new createjs.Container();
                var y = this.menuContainer.y + this.y + STANDARDBLOCKHEIGHT;
                // Multicolumn
                if (y > 789) {
                    this.x += 160;
                    this.y = 0;
                    y = this.menuContainer.y + this.y + STANDARDBLOCKHEIGHT;
                }
                this.protoBackgrounds[modname].x = this.menuContainer.x + this.x;
                this.protoBackgrounds[modname].y = this.menuContainer.y + this.y + STANDARDBLOCKHEIGHT;
                this.protoBackgrounds[modname].visible = false;
                this.protoContainers[modname].x = this.menuContainer.x + this.x;
                this.protoContainers[modname].y = this.menuContainer.y + this.y + STANDARDBLOCKHEIGHT;
                this.palettes.stage.addChild(this.protoBackgrounds[modname]);
                this.palettes.stage.addChild(this.protoContainers[modname]);
                this.protoContainers[modname].visible = false;

                // We use a filler for the menu background
                var height = STANDARDBLOCKHEIGHT * Math.ceil(last(this.protoList[blk].docks)[1] / STANDARDBLOCKHEIGHT);
                // Some blocks are not shown full-size on the palette.
                if (['if', 'while', 'until', 'ifthenelse'].indexOf(modname) != -1) {
                    height = STANDARDBLOCKHEIGHT;
                } else if (['action', 'start'].indexOf(blkname) != -1) {
                    height += 2 * STANDARDBLOCKHEIGHT;
                } else if (['media', 'camera', 'video'].indexOf(blkname) != -1) {
                    height += STANDARDBLOCKHEIGHT;
                }
                this.size += Math.ceil(height * PALETTESCALE);
                this.y += Math.ceil(height * PALETTESCALE);

                function processFiller(palette, modname, bitmap, extras) {
                    palette.protoBackgrounds[modname].addChild(bitmap);
                    bitmap.y = 0;
                    bounds = palette.protoBackgrounds[modname].getBounds();
                    palette.protoBackgrounds[modname].cache(bounds.x, bounds.y, Math.ceil(bounds.width), Math.ceil(bounds.height));
                    palette.finishPaletteEntry(extras[0], modname, extras[1]);
                }

                makePaletteBitmap(this, PALETTEFILLER.replace(/filler_height/g, height.toString()), modname, processFiller, [blkname, blk]);
            }
        }
    }

    this.finishPaletteEntry = function(blkname, modname, blk) {
        var myBlock = paletteBlocks.protoBlockDict[blkname];
        var block_label = '';
        var top_label = '';
        var mid_label = '';
        var bottom_label = '';

        switch (myBlock.name) {
        case 'text':
            block_label = 'text';
            break;
        case 'number':
            block_label = '100';
            break;
        default:
            if (blkname != modname) {
                // Override label for do, storein, and box
                block_label = this.protoList[blk].defaults[0];
            } else if (myBlock.staticLabels.length > 0) {
                block_label = myBlock.staticLabels[0];
            } else {
                block_label = blkname;
            }
            block_label = _(block_label)
        }

        switch (myBlock.name) {
        case 'box':
            // so the label will fit
            var artwork = VALUEBLOCK;
            break;
        case 'if':
        case 'until':
        case 'while':
            // so the block will fit
            var artwork = BASICBLOCK;
            break;
        case 'ifthenelse':
            // so the block will fit
            var artwork = BASICBLOCK;
            block_label = myBlock.staticLabels[0] + ' ' + myBlock.staticLabels[1] + ' ' + myBlock.staticLabels[2];
            break;
        default:
            var artwork = myBlock.artwork[0];
            if (myBlock.staticLabels.length > 1) {
                top_label = myBlock.staticLabels[1];
            }
            if (myBlock.staticLabels.length > 2) {
                bottom_label = myBlock.staticLabels[2];
            }
            if (myBlock.staticLabels.length == 3 && myBlock.style == 'doubleclamp') {
                mid_label = myBlock.staticLabels[2];
                top_label = myBlock.staticLabels[1];
                block_label = myBlock.staticLabels[0];
            }
            break;
        }

        function processBitmap(palette, modname, bitmap, args) {
            var myBlock = args[0];
            var blk = args[1];
            palette.protoContainers[modname].addChild(bitmap);
            bitmap.x = PALETTEOFFSET;
            bitmap.y = 0;
            bitmap.scaleX = PALETTESCALE;
            bitmap.scaleY = PALETTESCALE;
            bitmap.scale = PALETTESCALE;

            if (!palette.protoList[blk].expandable || (['if', 'while', 'until', 'ifthenelse'].indexOf(modname) != -1)) {
                bounds = palette.protoContainers[modname].getBounds();
                palette.protoContainers[modname].cache(bounds.x, bounds.y, Math.ceil(bounds.width), Math.ceil(bounds.height));
                var hitArea = new createjs.Shape();
                hitArea.graphics.beginFill('#FFF').drawRect(0, 0, Math.ceil(bounds.width), Math.ceil(bounds.height));
                palette.protoContainers[modname].hitArea = hitArea;

                loadPaletteMenuItemHandler(palette, blk, modname);
                palette.palettes.refreshCanvas();
            } else {
                if (myBlock.style == 'doubleclamp') {
                    middleExpandable(palette, modname, myBlock, blk)
                } else {
                    finishExpandable(palette, modname, myBlock, blk);
                }
            }
        }

        makePaletteBitmap(this, artwork.replace(/fill_color/g, PALETTEFILLCOLORS[myBlock.palette.name]).replace(/stroke_color/g, PALETTESTROKECOLORS[myBlock.palette.name]).replace('block_label', block_label).replace('top_label', top_label).replace('bottom_label', bottom_label).replace('font_size', myBlock.fontsize), modname, processBitmap, [myBlock, blk]);

        function middleExpandable(palette, modname, myBlock, blk) {
            if (palette.protoList[blk].expandable) {
                middleArtwork = myBlock.artwork[1];

                function processMiddleBitmap(palette, modname, bitmap, middleOffset) {
                    palette.protoContainers[modname].addChild(bitmap);
                    bitmap.x = PALETTEOFFSET;
                    bitmap.y = middleOffset;
                    bitmap.scaleX = PALETTESCALE;
                    bitmap.scaleY = PALETTESCALE;
                    bitmap.scale = PALETTESCALE;

                    finishExpandable(palette, modname, myBlock, blk)
                }

                var middleOffset = Math.floor(palette.protoList[blk].artworkOffset[1] * PALETTESCALE);
                makePaletteBitmap(palette, middleArtwork.replace(/fill_color/g, PALETTEFILLCOLORS[myBlock.palette.name]).replace(/stroke_color/g, PALETTESTROKECOLORS[myBlock.palette.name]).replace('mid_label', mid_label).replace('font_size', myBlock.fontsize), modname, processMiddleBitmap, middleOffset);
            }
        }

        function finishExpandable(palette, modname, myBlock, blk) {
            if (palette.protoList[blk].expandable) {
                bottomArtwork = last(myBlock.artwork);

                function processBottomBitmap(palette, modname, bitmap, artworkOffset) {
                    palette.protoContainers[modname].addChild(bitmap);
                    bitmap.x = PALETTEOFFSET;
                    var middleOffset = Math.floor(palette.protoList[blk].artworkOffset[1] * PALETTESCALE);
                    bitmap.y = artworkOffset;
                    bitmap.scaleX = PALETTESCALE;
                    bitmap.scaleY = PALETTESCALE;
                    bitmap.scale = PALETTESCALE;

                    bounds = palette.protoContainers[modname].getBounds();
                    palette.protoContainers[modname].cache(bounds.x, bounds.y, Math.ceil(bounds.width), Math.ceil(bounds.height));
                    var hitArea = new createjs.Shape();
                    hitArea.graphics.beginFill('#FFF').drawRect(0, 0, Math.ceil(bounds.width), Math.ceil(bounds.height));
                    palette.protoContainers[modname].hitArea = hitArea;
                    loadPaletteMenuItemHandler(palette, blk, modname);
                    palette.palettes.refreshCanvas();
                }

                var artworkOffset = Math.floor(palette.protoList[blk].artworkOffset[2] * PALETTESCALE);
                makePaletteBitmap(palette, bottomArtwork.replace(/fill_color/g, PALETTEFILLCOLORS[myBlock.palette.name]).replace(/stroke_color/g, PALETTESTROKECOLORS[myBlock.palette.name]).replace('bottom_label', bottom_label).replace('font_size', myBlock.fontsize), modname, processBottomBitmap, artworkOffset);
            }
        }
    }

    this.moveMenu = function(x, y) {
        dx = x - this.menuContainer.x;
        dy = y - this.menuContainer.y;
        this.menuContainer.x = x;
        this.menuContainer.y = y;
        this.moveMenuItemsRelative(dx, dy);
    }

    this.moveMenuRelative = function(dx, dy) {
        this.menuContainer.x += dx;
        this.menuContainer.y += dy;
        this.moveMenuItemsRelative(dx, dy);
    }

    this.hide = function() {
        this.hideMenu();
    }

    this.show = function() {
        this.showMenu();
    }

    this.hideMenu = function() {
        if (this.menuContainer != null) {
            this.menuContainer.visible = false;
            this.hideMenuItems(true);
        }
    }

    this.showMenu = function() {
        this.menuContainer.visible = true;
    }

    this.hideMenuItems = function(init) {
        for (var i in this.protoBackgrounds) {
            this.protoBackgrounds[i].visible = false;
        }
        for (var i in this.protoContainers) {
            this.protoContainers[i].visible = false;
            // If hideMenuItems is called too soon in the init
            // process, there can be a race condition.
            try {
                this.protoContainers[i].updateCache();
            } catch (e) {
                console.log('container not ready? ' + e);
            }
        }
        this.visible = false;

        // Move the menus below up
        var below = false;
        for (var p in this.palettes.dict) {
            if (!init && below) {
                // this.palettes.dict[p].moveMenuRelative(0, -this.size);
            }
            if (p == this.name) {
                below = true;
            }
        }
    }

    this.showMenuItems = function(init) {
        for (var i in this.protoBackgrounds) {
            this.protoBackgrounds[i].visible = true;
        }
        for (var i in this.protoContainers) {
            this.protoContainers[i].visible = true;
            this.protoContainers[i].updateCache();
        }
        this.visible = true;

        // Move the menus below down
        var below = false;
        for (var p in this.palettes.dict) {
            if (!init && below) {
                // this.palettes.dict[p].moveMenuRelative(0, this.size);
            }
            if (p == this.name) {
                below = true;
            }
        }
    }

    this.moveMenuItems = function(x, y) {
        for (var i in this.protoBackgrounds) {
            this.protoBackgrounds[i].x = x;
            this.protoBackgrounds[i].y = y;
        }
        for (var i in this.protoContainers) {
            this.protoContainers[i].x = x;
            this.protoContainers[i].y = y;
        }
    }

    this.moveMenuItemsRelative = function(dx, dy) {
        for (var i in this.protoBackgrounds) {
            this.protoBackgrounds[i].x += dx;
            this.protoBackgrounds[i].y += dy;
        }
        for (var i in this.protoContainers) {
            this.protoContainers[i].x += dx;
            this.protoContainers[i].y += dy;
        }
    }

    this.getInfo = function() {
        var returnString = this.name + ' palette:';
        for (var thisBlock in this.protoList) {
            returnString += ' ' + this.protoList[thisBlock].name;
        }
        return returnString;
    };

    this.add = function(protoblock) {
        this.protoList.push(protoblock);
        return this;
    }

    return this;
};


function initPalettes(canvas, stage, cellSize, refreshCanvas) {
    // Instantiate the palettes object.
    var palettes = new Palettes(canvas, stage, cellSize, refreshCanvas).
    add('turtle', 'black', '#00b700').
    add('pen', 'black', '#00c0e7').
    add('number', 'black', '#ff00ff').
    add('boolean', 'black', '#ff00ff').
    add('flow', 'black', '#fd6600').
    add('blocks', 'black', '#ffc000').
    add('media', 'black', '#ffc000').
    add('sensors', 'white', '#ff0066').
    add('extras', 'white', '#ff0066').
    add('mashape', 'white', '#ff0066');


    // Give the palettes time to load.
    setTimeout(function() {
        palettes.show();
        palettes.bringToTop();
    }, 2000);
    return palettes;
}


// Menu Item event handlers
function loadPaletteMenuItemHandler(palette, blk, blkname) {
    // A menu item is a protoblock that is used to create a new block.
    var locked = false;
    var moved = false;
    var saveX = palette.protoContainers[blkname].x;
    var saveY = palette.protoContainers[blkname].y;

    function makeBlockFromPalette(blk, blkname, palette) {
        var arg = '__NOARG__';
        // console.log('makeBlockFromPalette ' + blkname + ' ' + palette.protoList[blk].name + ' ' + palette.protoList[blk].defaults[0]);
        switch (palette.protoList[blk].name) {
            case 'do':
                blkname = 'do ' + palette.protoList[blk].defaults[0];
                var arg = palette.protoList[blk].defaults[0];
                break;
            case 'storein':
                // Use the name of the box in the label
                blkname = 'store in ' + palette.protoList[blk].defaults[0];
                var arg = palette.protoList[blk].defaults[0];
                break;
            case 'box':
                // Use the name of the box in the label
                blkname = palette.protoList[blk].defaults[0];
                var arg = palette.protoList[blk].defaults[0];
                break;
        }
        return paletteBlockButtonPush(palette.protoList[blk].name, arg);
    }

    palette.protoContainers[blkname].on('mousedown', function(event) {
        moved = false;
        saveX = palette.protoContainers[blkname].x;
        saveY = palette.protoContainers[blkname].y;
        if (palette.draggingProtoBlock) {
            return;
        }
        if (locked) {
            console.log('debouncing click');
            return;
        }
        locked = true;
        setTimeout(function() {
            locked = false;
        }, 500);
        palette.palettes.setDraggingFlag(true);
        var offset = {
            x: palette.protoContainers[blkname].x - Math.round(event.stageX / palette.palettes.scale) - PALETTEOFFSET,
            y: palette.protoContainers[blkname].y - Math.round(event.stageY / palette.palettes.scale)
        };

        palette.protoContainers[blkname].on('pressmove', function(event) {
            moved = true;
            palette.draggingProtoBlock = true;
            palette.protoContainers[blkname].x = Math.round(event.stageX / palette.palettes.scale) - PALETTEOFFSET;
            palette.protoContainers[blkname].y = Math.round(event.stageY / palette.palettes.scale);
            palette.palettes.refreshCanvas();
        });
    });

    palette.protoContainers[blkname].on('pressup', function(event) {
        if (moved) {
            moved = false;
            palette.draggingProtoBlock = false;
            palette.palettes.setDraggingFlag(false);
            // Create the block.
            var newBlock = makeBlockFromPalette(blk, blkname, palette);
            // Move the drag group under the cursor.
            paletteBlocks.findDragGroup(newBlock);
            for (i in paletteBlocks.dragGroup) {
                paletteBlocks.moveBlockRelative(paletteBlocks.dragGroup[i], Math.round(event.stageX / palette.palettes.scale), Math.round(event.stageY / palette.palettes.scale));
            }
        }
        // Return protoblock we've been dragging back to the palette.
        palette.protoContainers[blkname].x = saveX;
        palette.protoContainers[blkname].y = saveY;
        palette.palettes.refreshCanvas();
    });
}


// Palette Menu event handlers
function loadPaletteMenuHandler(palette) {
    // The palette menu is the container for the protoblocks. One
    // palette per palette button.

    var locked = false;

    palette.menuContainer.on('mouseover', function(event) {
        palette.palettes.setDraggingFlag(true);
    });

    palette.menuContainer.on('click', function(event) {
        if (Math.round(event.stageX / palette.palettes.scale) > palette.menuContainer.x + MENUWIDTH - STANDARDBLOCKHEIGHT) {
            palette.hide();
            palette.palettes.refreshCanvas();
            return;
         }

        if (locked) {
            console.log('debouncing click');
            return;
        }
        locked = true;
        setTimeout(function() {
            locked = false;
        }, 500);

        for (p in palette.palettes.dict) {
            if (palette.name != p) {
                if (palette.palettes.dict[p].visible) {
                    palette.palettes.dict[p].hideMenuItems(false);
                }
            }
        }
        if (palette.visible) {
            palette.hideMenuItems(false);
        } else {
            palette.showMenuItems(false);
        }
        palette.palettes.refreshCanvas();
    });

    palette.menuContainer.on('mousedown', function(event) {
        palette.palettes.setDraggingFlag(true);
        // Move them all?
        var offset = {
            x: palette.menuContainer.x - Math.round(event.stageX / palette.palettes.scale),
            y: palette.menuContainer.y - Math.round(event.stageY / palette.palettes.scale)
        };

        palette.menuContainer.on('pressup', function(event) {
            palette.palettes.setDraggingFlag(false);
        });

        palette.menuContainer.on('mouseout', function(event) {
            palette.palettes.setDraggingFlag(false);
        });

        palette.menuContainer.on('pressmove', function(event) {
            var oldX = palette.menuContainer.x;
            var oldY = palette.menuContainer.y;
            palette.menuContainer.x = Math.round(event.stageX / palette.palettes.scale) + offset.x;
            palette.menuContainer.y = Math.round(event.stageY / palette.palettes.scale) + offset.y;
            palette.palettes.refreshCanvas();
            var dx = palette.menuContainer.x - oldX;
            var dy = palette.menuContainer.y - oldY;
            // Hide the menu items while drag.
            palette.hideMenuItems(false);
            palette.moveMenuItemsRelative(dx, dy);
        });
    });

    palette.menuContainer.on('mouseout', function(event) {
        palette.palettes.setDraggingFlag(false);
    });
}


function makePaletteBitmap(palette, data, name, callback, extras) {
    // Async creation of bitmap from SVG data
    // Works with Chrome, Safari, Firefox (untested on IE)
    var img = new Image();
    img.onload = function() {
        bitmap = new createjs.Bitmap(img);
        callback(palette, name, bitmap, extras);
    }
    img.src = 'data:image/svg+xml;base64,' + window.btoa(
        unescape(encodeURIComponent(data)));
}


function last(myList) {
    var i = myList.length;
    if (i == 0) {
        return null;
    } else {
        return myList[i - 1];
    }
}
