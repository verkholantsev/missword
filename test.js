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
    };

}(window, Missword, jQuery));
