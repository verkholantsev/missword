/*jslint nomen: true */
(function (window, CryptoJS, $, _, Backbone) {
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

    var local = new missword.Local();

    Backbone.sync = function (method, model, options) {
        var methods = {
            'create': function (model, options) {
                var key = CryptoJS.AES.encrypt(model.get('url'), options.master).toString(),
                    value = CryptoJS.AES.encrypt(JSON.stringify(model), options.master).toString();

                local.add(value, key);

                if (options.success) {
                    options.success.apply(this);
                }
            },
            'read': function (model, options) {
                var entries = local.keys().reduce(function (result, key) {
                    var entry = local.get(key);
                    entry = 
                        CryptoJS.AES.decrypt(entry, options.master)
                        .toString(CryptoJS.enc.Utf8);

                    result.push(JSON.parse(entry));
                    return result;
                }, []);

                if (options.success) {
                    options.success.apply(this, [entries]);
                }
            }
        }

        return methods[method].apply(this, [model, options]);
    };

    var EntryView = Backbone.View.extend({
        initialize: function (settings) {
            this.template = settings.template;
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var Entry = Backbone.Model.extend({
        defaults: {
            url: '',
            pass: ''
        }
    });

    var Entries = Backbone.Collection.extend({
        model: Entry,

        initialize: function (settings) {
            this.master = settings.master;
        },

        create: function (model, options) {
            options = _.defaults(options || {}, {master: this.master});
            return Backbone.Collection.prototype.create.apply(this, [model, options]);
        },

        fetch: function (options) {
            options = _.defaults(options || {}, {master: this.master});
            return Backbone.Collection.prototype.fetch.apply(this, [options]);
        }
    });

    missword.View = Backbone.View.extend({
        initialize: function (settings) {
            this.entryTemplate = settings.entryTemplate;
            this.container = settings.container;

            this.entries = new Entries({master: settings.master});
            this.listenTo(this.entries, 'add', this.onEntryAdded);
            this.entries.fetch();
        },

        render: function () {
            $(this.container).html(this.el);
        },

        onEntryAdded: function (entry) {
            var view = new EntryView({model: entry, template: _.template(this.entryTemplate.html())});
            this.$el.append(view.render().el);
        }
    });

    missword.Controller = function (settings) {
        this.view = new missword.View(settings.view);
        this.view.render();

        return this.view.entries;
    };

    window.Missword = missword.Controller;

}(window, CryptoJS, jQuery, _, Backbone));

