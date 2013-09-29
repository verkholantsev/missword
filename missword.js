(function (window, CryptoJS, undefined) {
	var _Local = function () {
		this.storage = window.localStorage;
	};

	_Local.prototype.add = function (hash, url) {
		this.storage.setItem(url, hash);
	}

	_Local.prototype.get = function (url) {
		return this.storage.getItem(url);
	}

	var Missword = window.Missword = function (settings) {
		this.master = settings.master;
		this.storage = new _Local();
	};

	Missword.prototype.add = function (password, url) {
		var str = url + password;
		this.storage.add(CryptoJS.AES.encrypt(str, this.master).toString(), url);
	};

	Missword.prototype.get = function(url) {
		var pass = CryptoJS.AES.decrypt(this.storage.get(url), this.master)
			.toString(CryptoJS.enc.Utf8)
			.slice(url.length);

		return pass;
	};
})(window, CryptoJS);