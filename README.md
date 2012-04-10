# CPS.JS

Constraint Satisfaction Problem Solver
Niels Joubert

## What is this?

This is a library for expressing and solving constraint satisfaction problems, in pure JavaScript.

Currently it only solves discrete finite-domain problems, and provides a couple of solvers.

In the future I hope to support infinite-domain problems and continuous problems as well.

## What is a CSP?

A Constraint Satisfaction Problem is formally defined as:

- A set of variables, Xi ... Xn
- Each variable has a domain of values it can take, Di ... Dn
- A set of constraints Ci ... Cn that specifies allowable combinations of values for a subset of the variables.

That is, a set of variables, with relations between the valid values of these variables.

There are multiple classes of CSPs:

- *Discrete problems*, where the values of each variable can be enumerated
- *Finite problems*, where the size of domain is finite
- *Continuous problems*, where the values of each variable is a range
- *Infinite problems*, where the domain of a variable is of infinite extent

Then there are subclasses of these:

- *Integer problems*, discrete infinite problems on the integers
- *Linear problems*, where all the constraints are linear
- *Integer Linear problems*, where all the constraints are linear and the values integers. This is the hardest kind of constraint problem.



## Credits

This project started as a port of the [python-constraint](http://labix.org/python-constraint) library