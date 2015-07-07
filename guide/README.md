Guide to Using Turtle Art JS
============================

Turtle Blocks Javascript is designed to run in a browser. Most of the
development has been done in Chrome, but it should also work in
Firefox. You can run it directly from index.html, from a [server
maintained by Sugar Labs](http://turtle.sugarlabs.org), from the
[github
repo](http://rawgit.com/walterbender/turtleblocksjs/master/index.html),
or by setting up a [local
server](https://github.com/walterbender/turtleblocksjs/blob/master/server.md).

Once you've launched it in your browser, start by clicking on (or
dragging) blocks from the Turtle palette. Use multiple blocks to
create drawings; as the turtle moves under your control, colorful
lines are drawn.

You add blocks to your program by clicking on or dragging them from
the palette to the main area. You can delete a block by dragging it
back onto the palette. Click anywhere on a "stack" of blocks to start
executing that stack or by clicking in the Rabbit (fast) or Turtle
(slow) on the Main Toolbar.

TO SQUARE
---------

The traditional introduction to Logo has been to draw a square. Often times when running a workshop, I have the learners form a circle around one volunteer, the "turtle", and invite them to instruct the turtle to draw a square. (I coach the volunteer beforehand to take every command literally, as does our graphical turtle.) Eventually the group converges on "go forward some number of steps", "turn right (or left) 90 degrees", "go forward some number of steps", "turn right (or left) 90 degrees", "go forward some number of steps", "turn right (or left) 90 degrees", "go forward some number of steps". It is only on rare occasions that the group includes a final "turn right (or left) 90 degrees" in order to return the turtle to its original orientation. At this point I introduce the concept of "repeat" and then we start in with programming with Turtle Blocks.

1. Forward/Right
----------------

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing1.svg'</img>
A single line of length 100

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing2.svg'</img>
Changing the line length to 200

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing3.svg'</img>
Adding a right turn of 90 degrees. Running this stack four times produces a square.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing4.svg'</img>
Forward, right, forward, right, ...

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing5.svg'</img>
Using the Repeat block from the Flow palette

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing8.svg'</img>
Using the Arc block to make rounded corners

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing9.svg'</img>
Using the Begin Fill and End Fill blocks from the Pen palette to make a solid square

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing10.svg'</img>
Changing the color to 70 (blue) using the Set Color block from the Pen palette

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing11.svg'</img>
Using the Random block from the Numbers palette to select a random color (0 to 100)

2. Boxes
--------
When explaining boxes in workshops, I often use a shoebox. I have someone write a number on a piece of paper and put it in the shoebox. I then ask repeatedly, "What is the number in the box?" Once it is clear that we can reference the number in the shoebox, I have someone put a different number in the shoebox. Again I ask, "What is the number in the box?" The power of the box is that you can refer to it multiple times from multiple places in your program.

Boxes let you store an object, e.g., a number, and then refer to the object by using the name of the box. (Whenever you name a box, a new block is created on the Boxes palette that lets you access the content of the box.) This is used in a trivial way in the first example below: putting 100 in the box and then referencing the box from the Forward block. In the second example, we increase the value of the number stored in the box so each time the box is referenced by the Forward block, the value is larger.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing12.svg'</img>
Putting a value in a box and then referring to the value in box

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing13.svg'</img>
We can change the value in a box as the program runs. The result in this case is a spiral, since the turtle goes forward further with each step.

3. Action Stacks
----------------
Action stacks let you to extend the Turtle Blocks language by defining new blocks. For example, if you draw lots of squares, you may want a block to draw squares. In the examples below, we define an action which draws a square (repeat 4 forward 100 right 90), which in turn results in a new block on the Actions palette that we can use whenever we want to draw a square. Every new action stack results in a new block.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing6.svg'</img>
Defining an action to create a new block, "square"

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing7.svg'</img>
Using the "square" block

4. Parameters
-------------

Parameter blocks hold a value that represents the state of some turtle attribute, e.g., the x or y position of the turtle, the heading of the turtle, the color of the pen, the size of the pen, etc. You can use parameter blocks interchangeably with number blocks. You can change their values with the Add block or with the corresponding set blocks.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing14.svg'</img>
Using the heading parameter, which changes each time the turtle changes direction, to change the color of a spiral

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/drawing15.svg'</img>
"Squiral" by Brian Silverman uses the heading and x parameter blocks.
