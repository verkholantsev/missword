/*jslint nomen: true */
/*global window: false, CryptoJS: false, jQuery: false, _: false, Backbone */
(function (window, CryptoJS, $, _, Backbone) {
    'use strict';

    var missword = {};

    missword.Local = function () {
        this.storage = window.localStorage;
        var keys = this.keys();
        if (keys.length > 0) {
            this.id = Math.max.apply(undefined, keys.map(function (key) {
                return Number(key);
            }));
        } else {
            this.id = 0;
        }
    };

    missword.Local.prototype.add = function (hash) {
        var id = this.getId();
        this.storage.setItem(id, hash);
        return id;
    };

    missword.Local.prototype.remove = function (id) {
        this.storage.removeItem(id);
    };

    missword.Local.prototype.get = function (url) {
        return this.storage.getItem(url);
    };

    missword.Local.prototype.keys = function () {
        return Object.keys(window.localStorage);
    };

    missword.Local.prototype.getId = function () {
        this.id += 1;
        return this.id;
    };

    var local = new missword.Local();

    Backbone.sync = function (method, model, options) {
        var methods = {
                'create': function (model, options) {
                    var value = CryptoJS.AES.encrypt(JSON.stringify(model), options.master).toString();

                    var id = local.add(value);

                    if (options.success) {
                        options.success.apply(this, [{id: id}]);
                    }
                },
                'read': function (model, options) {
                    var entries;

                    try {
                        entries = local.keys().reduce(function (result, key) {
                            var entry = local.get(key);
                            entry =
                                CryptoJS.AES.decrypt(entry, options.master)
                                .toString(CryptoJS.enc.Utf8);
                            entry = JSON.parse(entry);
                            entry.id = entry.id || Number(key);
                            result.push(entry);
                            return result;
                        }, []);
                    } catch (e) {
                        if (options.error) {
                            options.error.apply(this);
                            return;
                        }
                    }

                    if (options.success) {
                        options.success.apply(this, [entries]);
                    }
                },
                'delete': function (model, options) {
                    local.remove(model.get('id'));

                    if (options.success) {
                        options.success.apply(this, []);
                    }
                }
            };

        return methods[method].apply(this, [model, options]);
    };

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

    var Model = Backbone.Model.extend({
        defaults: {
            master: '',
            state: 'master'
        }
    });

    var EntryView = Backbone.View.extend({
        events: {
            'click .delete': 'onDeleteButtonClick',
            'click .arror': 'onArrowClick'
        },

        initialize: function (settings) {
            this.template = settings.template;
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onDeleteButtonClick: function () {
            this.model.destroy();
        },

        onArrowClick: function (e) {
            var target = e.target;
            if ($(target).hasClass('right')) {
                this.$el.addClass('pass-view');
            } else {
                this.$el.removeClass('pass-view');
            }
        }
    });

    missword.View = Backbone.View.extend({
        events: {
            'click .add.button': 'onAddButtonClick',
            'click .ok.button': 'onMasterOk'
        },

        initialize: function (settings) {
            this.entryTemplate = settings.entryTemplate;
            this.template = _.template(settings.template.html());
            this.container = settings.container;

            this.model = new Model();
            this.entries = new Entries({master: settings.master});

            this.listenTo(this.model, 'change:state', this.render);
            this.listenTo(this.model, 'change:master', function () {
                this.entries.master = this.model.get('master');
            });

            this.listenTo(this.entries, 'add', this.onEntryAdded);
            this.listenTo(this.entries, 'error', this.onError);
        },

        render: function () {
            this.$el.html(this.template());

            var state = this.model.get('state');
            if (state === 'master') {
                this.$el.find('.entries-state').hide();
                this.$el.find('.master').show();
            } else if (state === 'entries') {
                this.$el.find('.entries-state').show();
                this.$el.find('.master-state').hide();

                this.entries.fetch();
            }
        },

        onEntryAdded: function (entry) {
            var view = new EntryView({model: entry, template: _.template(this.entryTemplate.html())});
            this.$el.find('.entries').append(view.render().el);
        },

        onError: function () {
            this.model.set({state: 'master'});
            this.$el.find('.master-input input').addClass('wrong');
        },

        onMasterOk: function () {
            this.model.set({master: this.$el.find('.master-input input').val()});
            this.model.set({state: 'entries'});
        },

        onAddButtonClick: function () {
            var inputs = this.$el.find('.new-entry input'),
                data = inputs.serializeArray();

            data = data.reduce(function (result, el) {
                result[el.name] = el.value;
                return result;
            }, {});
            this.entries.create(data);
            inputs.val('');
        }
    });

    missword.Controller = function (settings) {
        this.view = new missword.View(settings.view);
        this.view.render();

        return this.view.entries;
    };

    window.Missword = missword.Controller;

}(window, CryptoJS, jQuery, _, Backbone));

