/*jslint nomen: true */
/*global window: false, CryptoJS: false, jQuery: false, _: false */
(function (window, CryptoJS, $, _) {
    'use strict';

    window.missword = window.missword || {};
    var missword = window.missword;

    missword.Local = function () {
        this.storage = window.localStorage;
    };

    missword.Local.prototype.add = function (hash, url) {
        this.storage.setItem(url, hash);
    };

    missword.Local.prototype.get = function (url) {
        return this.storage.getItem(url);
    };

    missword.Local.prototype.keys = function () {
        return Object.keys(window.localStorage);
    };

    missword.View = function (settings) {
        this.model = settings.model;
        this.container = settings.container;

        this.render();
    };

    missword.View.prototype.render = function () {
        if (this.container) {
            var template = _.template($('#url-pass-template').html()),
                keys = this.model.keys(),
                _this = this;

            keys.forEach(function (key) {
                _this.container.append(template({url: key, password: _this.model.get(key)}));
            });
        }
    };

    missword.Model = function (settings) {
        this.master = settings.master;
        this.storage = new missword.Local();
        this.view = new missword.View({
            container: settings.container,
            model: this
        });
    };

    missword.Model.prototype.add = function (password, url) {
        var str = url + password;
        this.storage.add(CryptoJS.AES.encrypt(str, this.master).toString(), url);
    };

    missword.Model.prototype.get = function (url) {
        var pass = CryptoJS.AES.decrypt(this.storage.get(url), this.master)
            .toString(CryptoJS.enc.Utf8)
            .slice(url.length);

        return pass;
    };

    missword.Model.prototype.keys = function () {
        return this.storage.keys();
    };
}(window, CryptoJS, jQuery, _));

