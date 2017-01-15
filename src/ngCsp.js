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