/**
 * Classes responsible for resolving solutions by using Constraint satisfaction problem algorithm
 *
 * @author Niels Joubert <njoubert@gmail.com>
 * @returns {{DiscreteProblem: DiscreteProblem}}
 * @constructor
 */
function Csp() {

    /*
     * Variable
     */
    var Variable = function (name, domain) {
        this.name = name;
        this.domain = domain;
    };

    Variable.prototype.toString = function () {
        return "" + this.name + " => [" + this.domain.toString() + "]";
    };

    /*
     * Constraint
     */

    var Constraint = function (variables, fn) {
        this.fn = fn;
        this.variables = variables;
    };

    Constraint.prototype.toString = function () {
        return "(" + this.variables.toString() + ") => " + this.fn.toString();
    };

    /*
     * Problem
     */
    var Problem = function () {
        this.solver = new RecursiveBacktrackingSolver();
        this.variables = {};
        this.constraints = [];
    };

    Problem.prototype.addVariable = function (name, domain) {
        this.variables[name] = new Variable(name, domain);
    };
    Problem.prototype.changeVariable = function (name, newdomain) {
        if (this.variables[name]) {
            this.variables[name].domain = newdomain;
        } else {
            throw new Error("Attempted to change a nonexistant variable.");
        }
    };

    Problem.prototype.addConstraint = function (variables, fn) {
        if (variables.length == 0) {
            return;
        }
        this.constraints.push(new Constraint(variables, fn));
    };

    Problem.prototype.setSolver = function (solver) {
        this.solver = solver;
    };

    Problem.prototype.getSolution = function () {
        return this.solver.getSolution(this);
    };

    Problem.prototype.getSolutions = function () {
        return this.solver.getSolutions(this);
    };

    Problem.prototype.getSolutionIter = function () {
        return this.solver.getSolutions(this);
    };

    /*
     * Solver
     */
    var RecursiveBacktrackingSolver = function () {

    };

    RecursiveBacktrackingSolver.prototype.getSolution = function (csp) {
        var assignment = {};
        if (this.solve(assignment, csp.variables, csp.constraints, true)) {
            return assignment;
        } else {
            return {};
        }
    };

    RecursiveBacktrackingSolver.prototype.getSolutions = function (csp) {
        this.allAssignments = [];
        this.solve({}, csp.variables, csp.constraints, false);
        return this.allAssignments;
    };

    RecursiveBacktrackingSolver.prototype.getSolutionIter = function (csp) {
        throw {
            error: "Unsupported",
            message: "RecursiveBacktrackingSolver does not support a solution iterator"
        }
    };

    RecursiveBacktrackingSolver.prototype.solve = function (assignments, variables, constraints, single) {


        function recursiveSolve(assignments, variables, constraints, single) {
            //Move stuff in here to not re-evaluate the checkAssignment function...

        }

        function hashcopy(obj) {
            return angular.copy(obj);
        }

        if (Object.keys(assignments).length === Object.keys(variables).length) {
            if (!single) {
                this.allAssignments.push(hashcopy(assignments));
            }
            return true;
        }
        //find the next variable
        var nextVar = null;
        for (v in variables) {
            var found = false;
            for (a in assignments) {
                if (v === a) {
                    found = true;
                }
            }
            if (!found) {
                nextVar = variables[v];
                break;
            }
        }

        function checkAssignment(nextVar, val) {
            assignments[nextVar.name] = val;
            for (var c in constraints) {
                args = [];
                var valid = true;

                //try to build the argument list for this constraint...
                for (var k in constraints[c].variables) {
                    var fp = constraints[c].variables[k];
                    if (typeof assignments[fp] != "undefined") {
                        args.push(assignments[fp]);
                    } else {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    //we can check it, so check it.
                    if (!constraints[c].fn.apply(null, args)) {
                        delete assignments[nextVar.name];
                        return false;
                    }
                }

            }
            delete assignments[nextVar.name];
            return true;
        }

        //now try the values in its domain
        for (var j in nextVar.domain) {
            var val = nextVar.domain[j];
            var valid = true;
            if (checkAssignment(nextVar, val)) {
                assignments[nextVar.name] = val;
                if (this.solve(assignments, variables, constraints, single)) {
                    if (single) {
                        return true
                    }
                }
                delete assignments[nextVar.name];
            }
        }
        return false;

    };


    /*
     * Public API
     */
    return {

        DiscreteProblem: function () {
            return new Problem();
        }


    }

}
/**
 * Angular module creates as wrapper for csp solving algorithm
 *
 * @author Kamil Burek <kamil.burek@fingo.pl>
 * @returns {{CspManager}}
 */
angular.module('ngCsp', [])
    .factory('$csp', function () {
        'use strict';
        return new CspManager();
    });
/**
 * CspManager contains useful methods for getting solutions
 *
 * @author Kamil Burek <kamil.burek@fingo.pl>
 * @returns {{CspManager}}
 * @constructor
 */
function CspManager() {

    /**
     * Gets single solution for currentConfiguration
     *
     * @param configuration available options and constraints
     * @param currentConfiguration current configuration
     * @param element element for which we want to get solutions
     *
     * @returns solution or undefined if algorithm couldn't resolve it
     */
    this.getSolution = function (configuration, currentConfiguration, element) {

        var solution = prepare(configuration, currentConfiguration, element).getSolution();
        return isEmpty(solution) ? undefined : solution;

    };


    /**
     * Gets array of solutions for currentConfiguration
     *
     * @param configuration available options and constraints
     * @param currentConfiguration current configuration
     * @param element element for which we want to get solutions
     *
     * @returns solutions or empty array if algorithm couldn't resolve it
     */
    this.getSolutions = function (configuration, currentConfiguration, element) {

        return prepare(configuration, currentConfiguration, element).getSolutions();

    };

    /**
     * Gets all available values for specific element and currentConfiguration
     *
     * @param configuration available options and constraints
     * @param currentConfiguration current configuration
     * @param element element for which we want to get solutions
     *
     * @returns array of values
     */
    this.getValuesFor = function (configuration, currentConfiguration, element) {

        var allSolutions = this.getSolutions(configuration, currentConfiguration, element);
        var result = [];
        for (var i = 0; i < allSolutions.length; i++) {
            if (result.indexOf(allSolutions[i][element]) < 0) {
                result.push(allSolutions[i][element]);
            }
        }
        return result;

    };

    /**
     * Gets first available value specific element and currentConfiguration
     *
     * @param configuration available options and constraints
     * @param currentConfiguration current configuration
     * @param element element for which we want to get solutions
     *
     * @returns value or undefined if algorithm couldn't resolve it
     */
    this.getSingleValueFor = function (configuration, currentConfiguration, element) {

        var solution = this.getSolution(configuration, currentConfiguration, element);
        if (solution) {
            return solution[element];
        }
        return undefined;

    };


    /**
     * Checks if current configuration is correct or not
     *
     * @param configuration available options and constraints
     * @param currentConfiguration current configuration
     *
     * @returns true if currenConfiguration is correct or false
     */
    this.checkCorrect = function (configuration, currentConfiguration) {
        return this.getSolution(configuration, currentConfiguration) !== undefined;
    };

    function prepare(configuration, currentConfiguration, element) {

        var p = Csp().DiscreteProblem();

        for (var key in configuration.options) {
            if (element && key === element || !currentConfiguration.hasOwnProperty(key)) {
                p.addVariable(key, configuration.options[key]);
            } else {
                var value = currentConfiguration[key];
                if (Array.isArray(value)) {
                    p.addVariable(key, value);
                } else {
                    p.addVariable(key, [value]);
                }
            }
        }

        var constraints = getConstrains(configuration);
        constraints.forEach(function (element) {
            p.addConstraint(element.variables, element.funct);
        });
        return p;

    }


    function isEmpty(value) {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }


    function getConstrains(configuration) {
        var allConstraints = [];
        configuration.constraints.forEach(function (constraint) {


            var variables = constraint.properties.map(function (property, index) {
                return 'x' + index;
            }).join(',');

            var functionStr = "return ";

            var constraintSTR = constraint.relations.map(function (relation) {

                var expression = relation.map(function (val, idx) {

                    if(typeof (val) == 'boolean') {
                        return "x" + idx + "==" + val;
                    }
                    else if (isNaN(val) && val.charAt(0) == '!') {
                        return "x" + idx + "!=='" + val.slice(1) + "'";
                    } else {
                        return "x" + idx + "=='" + val + "'";
                    }
                }).join(' && ');

                return "(" + expression + ")";
            }).join("  || ");
            functionStr += constraintSTR;

            var constraintFunction = new Function(variables, functionStr);
            allConstraints.push({variables: constraint.properties, funct: constraintFunction})

        });

        return allConstraints;
    }

}