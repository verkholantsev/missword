/*jslint nomen: true */
/*global window: false, CryptoJS: false, jQuery: false, _: false */
(function (window, CryptoJS, $, _) {
    'use strict';

    var missword = {};

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
        this.container = settings.container;
    };

    missword.View.prototype.setModel = function (model) {
        this.model = model;
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
    };

    missword.Model.prototype.setView = function (view) {
        this.view = view;
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

    missword.Controller = function (settings) {
        this.model = new missword.Model(settings.model);
        this.view = new missword.View(settings.view);
        this.model.setView(this.view);
        this.view.setModel(this.model);

        this.view.render();
    };

    window.Missword = missword.Controller;
}(window, CryptoJS, jQuery, _));

