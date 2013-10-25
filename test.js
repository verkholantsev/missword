/*jslint */
/*global window: false, Missword: false, jQuery: false, console: false */
(function (window, Missword, $) {
    'use strict';

    window.onload = function () {
        var m = new Missword({
            view: {
                master: 'master-password',
                el: '#missword-container',
                template: $('#missword-template'),
                entryTemplate: $('#url-pass-template')
            }
        });

        m.create({pass: 'first-password', url: 'example.com'});
        m.create({pass: 'second-password', url: 'http://example.com'});
        m.create({pass: 'third-password', url: 'http://example.com/somepage'});
    };

}(window, Missword, jQuery));
