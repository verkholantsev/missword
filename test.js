/*jslint */
/*global window: false, Missword: false, jQuery: false, console: false */
(function (window, Missword, $) {
    'use strict';

    window.onload = function () {
        var m = new Missword({
            model: {
                master: 'master-password'
            },
            view: {
                container: $(window.document.body)
            }
        });

        m.model.add('first-password', 'example.com');
        m.model.add('second-password', 'http://example.com');
        m.model.add('third-password', 'http://example.com/somepage');

        console.log(m.model.get('example.com'));
        console.log(m.model.get('http://example.com'));
        console.log(m.model.get('http://example.com/somepage'));
    };

}(window, Missword, jQuery));
