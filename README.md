# ngCsp.JS

This library is fork of the CSP.JS library, it adds anuglar functionality to already existing library. 
By using this library you are able to do the csp algorithm in declarative way (see the example).

CSP.js is a library for expressing and solving constraint satisfaction problems, in pure JavaScript. Currently it only solves discrete finite-domain problems, and provides a couple of solvers. In the future I hope to support infinite-domain problems and continuous problems as well.

## Example

	app.controller("testCtrl", ["$csp", function ($csp) {
	    // available options with constraints
	    var configuration = {
	        options: {
                'roof': ['chrome', 'white', 'black', 'gold'],
                'floor': ['white', 'black']
            },
            constraints: [
                {
                    properties: ['roof', 'floor'],
                    relations: [
                        ['chrome', 'black'],
                        ['chrome', 'white'],
                        ['gold', 'black'],
                        ['white', 'white'],
                        ['white', 'black'],
                        ['black', 'white'],
                        ['white', 'white']
                    ]
                }
            ]
	    };
	    
	    // will print all available soltuions - for floow element all options will be used
	    console.log($csp.getSoltuions(configuration, {roof: 'gold'}, 'floor'));
	    
	}
    
## Solvers and Problems we support

Currently we support finite-domain problems, with the following solvers:

- Recursive Backtracking

## Intro to CSPs
	
### What is a CSP?

A Constraint Satisfaction Problem is formally defined as:

- A set of variables, `Xi ... Xn`
- Each variable has a domain of values it can take, `Di ... Dn`
- A set of constraints `Ci ... Cn` that specifies allowable combinations of values for a subset of the variables.

That is, a set of variables, with relations between the valid values of these variables.

There are multiple classes of CSPs:

- *Discrete problems*, where the values of each variable can be enumerated
- *Finite problems*, where the size of domain is finite
- *Continuous problems*, where the values of each variable is a range
- *Infinite problems*, where the domain of a variable is of infinite extent

Then there are subclasses of these:

- *Integer problems*, discrete infinite problems on the integers
- *Binary constraint problems*, where all the constraints are between two variables
- *Linear problems*, where all the constraints are linear
- *Integer Linear problems*, where all the constraints are linear and the values integers. This is the hardest kind of constraint problem.
- And many more...

### Examples of real-world CSPs

There are tons and tons of problems that can reduce to constraint satisfaction problems, and it is a rich field of study. But, here's some that everyone knows about:

- Sudoku
- Coloring maps
- Scheduling blocks of time
- Collecting parts for car, lamps etc.

## Credits

This project started as fork of the [cps.js](https://github.com/njoubert/csp.js/tree/master#cspjs) library