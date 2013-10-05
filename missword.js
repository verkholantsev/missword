(function (window, CryptoJS, undefined) {
	var _Local = function () {
		this.storage = window.localStorage;
	};

	_Local.prototype.add = function (hash, url) {
		this.storage.setItem(url, hash);
	};

	_Local.prototype.get = function (url) {
		return this.storage.getItem(url);
	};

	_Local.prototype.keys = function () {
		return Object.keys(window.localStorage);
	};


	_View = function (settings) {
		this.model = settings.model;
		this.container = settings.container;

		this.render();
	};

	_View.prototype.render = function () {
		if (this.container) {
			var keys = this.model.keys();
			var _this = this;
			keys.forEach(function (key) {
				_this.container.append(
					'<div class="pass">' +
						'<span>' + key + '</span>' +
						'<input value=' + _this.model.get(key) + '>' +
					'</div>'
				);
			});
		}
	};

	var Missword = window.Missword = function (settings) {
		this.master = settings.master;
		this.storage = new _Local();
		this.view = new _View({
			container: settings.container,
			model: this
		});
	};

	Missword.prototype.add = function (password, url) {
		var str = url + password;
		this.storage.add(CryptoJS.AES.encrypt(str, this.master).toString(), url);
	};

	Missword.prototype.get = function (url) {
		var pass = CryptoJS.AES.decrypt(this.storage.get(url), this.master)
			.toString(CryptoJS.enc.Utf8)
			.slice(url.length);

		return pass;
	};

	Missword.prototype.keys = function () {
		return this.storage.keys();
	};
})(window, CryptoJS);

