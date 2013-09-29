(function (window, CryptoJS, undefined) {
	var Missword = window.Missword = function (settings) {
		this.master = settings.master;
		this.storage = {};
	}

	Missword.prototype.add = function (password, url) {
		var str = url + password;
		this.storage[url] = CryptoJS.AES.encrypt(str, this.master).toString();
	}

	Missword.prototype.get = function(url) {
		var pass = CryptoJS.AES.decrypt(this.storage[url], this.master)
			.toString(CryptoJS.enc.Utf8)
			.slice(url.length);

		return pass;
	};
})(window, CryptoJS);