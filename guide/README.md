Guide to Using Turtle Art JS
============================

Turtle Blocks expands upon what children can do with Logo and how it
can be used as the underlying motivator for “improving” programming
languages and programmable devices.

In this guide, we illustrate this point by both walking the reader
through numerous examples, but also by discussing some of our favorite
explorations of Turtle Blocks, including multi-media, the Internet
(both as a forum for collaboration and data collection), and a broad
collection of sensors.

Getting Started
---------------

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

The traditional introduction to Logo has been to draw a square. Often
times when running a workshop, I have the learners form a circle
around one volunteer, the "turtle", and invite them to instruct the
turtle to draw a square. (I coach the volunteer beforehand to take
every command literally, as does our graphical turtle.) Eventually the
group converges on "go forward some number of steps", "turn right (or
left) 90 degrees", "go forward some number of steps", "turn right (or
left) 90 degrees", "go forward some number of steps", "turn right (or
left) 90 degrees", "go forward some number of steps". It is only on
rare occasions that the group includes a final "turn right (or left)
90 degrees" in order to return the turtle to its original
orientation. At this point I introduce the concept of "repeat" and
then we start in with programming with Turtle Blocks.

1. Turtle Basics
----------------

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/basics1.svg'</img>

A single line of length 100

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/basics2.svg'</img>

Changing the line length to 200

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/basics3.svg'</img>

Adding a right turn of 90 degrees. Running this stack four times
produces a square.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/basics4.svg'</img>

Forward, right, forward, right, ...

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/basics5.svg'</img>

Using the Repeat block from the Flow palette

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/basics6.svg'</img>

Using the Arc block to make rounded corners

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/basics7.svg'</img>

Using the Begin Fill and End Fill blocks from the Pen palette to make
a solid square

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/basics8.svg'</img>

Changing the color to 70 (blue) using the Set Color block from the Pen palette

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/basics9.svg'</img>

Using the Random block from the Numbers palette to select a random
color (0 to 100)

A SHOEBOX
---------
When explaining boxes in workshops, I often use a shoebox. I have
someone write a number on a piece of paper and put it in the
shoebox. I then ask repeatedly, "What is the number in the box?" Once
it is clear that we can reference the number in the shoebox, I have
someone put a different number in the shoebox. Again I ask, "What is
the number in the box?" The power of the box is that you can refer to
it multiple times from multiple places in your program.

2. Boxes
--------
Boxes let you store an object, e.g., a number, and then refer to the
object by using the name of the box. (Whenever you name a box, a new
block is created on the Boxes palette that lets you access the content
of the box.) This is used in a trivial way in the first example below:
putting 100 in the box and then referencing the box from the Forward
block. In the second example, we increase the value of the number
stored in the box so each time the box is referenced by the Forward
block, the value is larger.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/boxes1.svg'</img>

Putting a value in a box and then referring to the value in box

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/boxes2.svg'</img>

We can change the value in a box as the program runs. Here we add 10 to the value in the box with each iteration. The result in this case is a spiral, since the turtle goes forward further with each step.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/boxes3.svg'</img>

If we want to make a more complex change, we can store in the box some
computed value based on the current content of the box. Here we
multiply the content of the box by 1.2 and store the result in the
box. The result in this case is also a spiral, but one that grows
geometrically instead of arithmetically.

3. Action Stacks
----------------
With Turtle Blocks there is an opportunity for the learner to expand
upon the language, taking the conversation in directions unanticipated
by the Turtle Block developers.

Action stacks let you to extend the Turtle Blocks language by defining
new blocks. For example, if you draw lots of squares, you may want a
block to draw squares. In the examples below, we define an action
which draws a square (repeat 4 forward 100 right 90), which in turn
results in a new block on the Actions palette that we can use whenever
we want to draw a square. Every new action stack results in a new
block.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/actions1.svg'</img>

Defining an action to create a new block, "square"

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/actions2.svg'</img>

Using the "square" block

4. Parameters
-------------

Parameter blocks hold a value that represents the state of some turtle attribute, e.g., the x or y position of the turtle, the heading of the turtle, the color of the pen, the size of the pen, etc. You can use parameter blocks interchangeably with number blocks. You can change their values with the Add block or with the corresponding set blocks.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/parameters1.svg'</img>

Using the heading parameter, which changes each time the turtle changes direction, to change the color of a spiral

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/parameters2.svg'</img>

"Squiral" by Brian Silverman uses the heading and x parameter blocks. [RUN LIVE](https://turtle.sugarlabs.org/?file=Card-36.tb&run=True)

5. Conditionals
---------------
Conditionals are a powerful tool in computing. They let your program
behave differently under differing circumstances. The basic idea is
that if a condition is true, then take some action. Variants include
if-then-else, while, until, and forever. Turtle Blocks provides
logical constructs such as equal, greater than, less than, and, or,
and not.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/conditionals1.svg'</img>

Using a conditonal to select a color: Once the heading > 179, the color changes. [RUN LIVE](http://turtle.sugarlabs.org/?file=Conditionals-1.tb&run=true)

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/conditionals2.svg'</img>

Conditionals along with the Random block can be used to simulate a coin toss.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/conditionals3.svg'</img>

A coin toss is such a common operation that we added the One-of block as a convenience.

6. Multimedia
-------------

7. Sensors
----------

8. Example: Paint
-----------------

As described in the Sensors section, Turtle Blocks enables the
programmer/artist to incorporate sensors into their work. Among the
sensors available are the mouse button and mouse x and y
position. These can be used to create a simple paint program, as
illustrated below. Writing your own paint program is empowering: it
demystifies a commonly used tool. At the same time, it places the
burden of responsibility on the programmer: once we write it, it
belongs to us, and we are responsible for making it cool. Some
variations of paint are also shown below, including using microphone
levels to vary the pen size as ambient sound-levels change. Once
learners realize that they can make changes to the behavior of their
paint program, they become deeply engaged. How will you modify paint?

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/paint1.svg'</img>

In its simplest form, paint is just a matter of moving the turtle to whereever the mouse is positioned.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/paint2.svg'</img>

Adding a test for the mouse button lets us move the turtle without leaving a trail of ink.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/paint3.svg'</img>

In this example, we change the pen size based on the volume of microphone input.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/paint4.svg'</img>

In another example, inspired by a student in a workshop in Colombia, we use time to change both the pen color and the pen size. [RUN LIVE](http://turtle.sugarlabs.org/?file=Paint-4.tb&run=true)

9. Example: Slide Show
----------------------

10. Turtles and Sprites
-----------------------

11. The Heap
------------

12. Advanced Actions
--------------------

13. Example: Fibonacci
----------------------
Calculating the Fibonacci sequence is often done using a resursive method. In the example below, we pass an argument to the Fib action, which returns a value if the argument is &lt; 2; otherwise it returns the sum of the result of calling the Fib action with argument - 1 and argument - 2.

<img src='https://rawgithub.com/walterbender/turtleblocksjs/master/guide/fibonacci1.svg'</img>

Calculating Fibonacci [RUN LIVE](http://turtle.sugarlabs.org/?file=Fibonacci-1.tb&run=true)

14. Advanced Boxes
------------------

15. Extras
----------

16. Debugging Aids
------------------

17. Plugins
-----------
