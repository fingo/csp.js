describe('ngCsp module', function() {

    var empty = {};
    var csp = undefined;

    beforeEach(module('ngCsp'));
    beforeEach(inject(['$csp', function($csp) {
       csp = $csp;
    }]));


    it('should return all possible values', function() {
        var empty = {};
        expect(csp.getSolutions(configuration, empty, 'floor')).toEqual([
            {roof: 'chrome', floor: 'white'},
            {roof: 'chrome', floor: 'black'},
            {roof: 'white', floor: 'white'},
            {roof: 'white', floor: 'black'},
            {roof: 'black', floor: 'white'},
            {roof: 'gold', floor: 'black'}
        ]);

    });

    it('should return first possible solution for floor', function() {
        expect(csp.getSolution(configuration, empty, 'floor')).toEqual({roof: 'chrome', floor: 'white'});
    });

    it('should return all possible values for floor', function() {
        expect(csp.getValuesFor(configuration, empty, 'floor')).toEqual(['white', 'black']);
    });

    it('should return first possible value for floor', function() {
        expect(csp.getSingleValueFor(configuration, empty, 'floor')).toEqual('white');
    });

    it('wrong configuration we should get undefined', function() {
        expect(csp.getSingleValueFor(configuration, {roof: 'magenta'}, 'floor')).toEqual(undefined);
    });

    it('wrong configuration we should get empty array', function() {
        expect(csp.getValuesFor(configuration, {roof: 'magenta'}, 'floor')).toEqual([]);
    });

    it('wrong configuration we should get empty array', function() {
        expect(csp.getSolutions(configuration, {roof: 'magenta'}, 'floor')).toEqual([]);
    });

    it('for roof: white should return two solutions for floor', function() {
        expect(csp.getSolutions(configuration, {roof: 'white'}, 'floor')).toEqual([{roof: 'white', floor: 'white'}, {roof: 'white', floor: 'black'}]);
    });

    it('for roof: gold should return one solution for floor', function() {
        expect(csp.getSolutions(configuration, {roof: 'gold'}, 'floor')).toEqual([{roof: 'gold', floor: 'black'}]);
    });

    it('for roof: gold, floor: black checkCorrect should return true', function() {
        expect(csp.checkCorrect(configuration, {roof: 'gold', floor: 'black'})).toEqual(true);
    });

    it('for roof: gold, floor: white checkCorrect should return false', function() {
        expect(csp.checkCorrect(configuration, {roof: 'gold', floor: 'white'})).toEqual(false);
    });

});




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

