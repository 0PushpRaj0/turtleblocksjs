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

// Turtles
var defaultColor = 5;
var defaultValue = 50;
var defaultChroma = 100;
var defaultStroke = 5;

function Turtle (name) {
    this.name = name;

    // Things used for drawing the turtle.
    this.container = null;
    this.x = 0;
    this.y = 0;
    this.bitmap = null;
    this.skinChanged = false;  // Should we reskin the turtle on clear?

    // Which start block is assocated with this turtle?
    this.startBlock = null;
    this.decorationBitmap = null;  // Start block decoration.

    // Queue of blocks this turtle is executing.
    this.runQueue = [];

    // Things used for what the turtle draws.
    this.drawingCanvas = null;
    this.color = defaultColor;
    this.value = defaultValue;
    this.chroma = defaultChroma;
    this.stroke = defaultStroke;
    this.canvasColor = '#ff0031';
    this.orientation = 0;
    this.fillState = false;
    this.penState = true;
    this.media = [];  // Media (text, images) we need to remove on clear.
};

// The list of all of our turtles, one for each start block. Each
// turtle has its on drawing canvas.
var turtleList = [];

// Queue entry for managing running blocks.
function Queue (blk, count) {
    this.blk = blk;
    this.count = count;
}
