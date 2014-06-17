/* jshint strict:false, globalstrict:false */
/* global describe, it, beforeEach, inject, module */
describe('GeeksCtrl', function() {
    var geeksCtrl,
        scope;

    beforeEach(module('geekprofile'));

    beforeEach(inject(function($injector) {
        scope = $injector.get('$rootScope');

        geeksCtrl = function() {
            return $injector.get('$controller')('GeeksCtrl', {
                '$scope': scope
            });
        };
    }));

    it('should add new geeks on add()', function() {
        // TODO
    });
});
