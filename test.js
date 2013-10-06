/*jslint */
/*global window: false, missword: false, jQuery: false, console: false */
(function (window, missword, $) {
    'use strict';

    window.onload = function () {
        var m = new missword.Model({
            master: 'master-password',
            container: $(window.document.body)
        });

        m.add('first-password', 'example.com');
        m.add('second-password', 'http://example.com');
        m.add('third-password', 'http://example.com/somepage');

        console.log(m.get('example.com'));
        console.log(m.get('http://example.com'));
        console.log(m.get('http://example.com/somepage'));
    };

}(window, missword, jQuery));