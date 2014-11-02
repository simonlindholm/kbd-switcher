(function() {
var ext = {
	nextChange: 0,

	scripts: {
		'www.funbeat.se': function() {
			ext.changeLayout();
		},
		'www.facebook.com': function() {
			ext.changeLayout();
		},
		'mail.google.com': function(doc) {
			setTimeout(function() {
				var t = doc.title;
				if (t.indexOf('@gmail.com') !== -1 && t.indexOf('simon.lindholm10') === -1)
					ext.changeLayout();
			}, 4000);
		},
	},

	init: function() {
		var appcontent = document.getElementById('appcontent');
		if (appcontent)
			appcontent.addEventListener('DOMContentLoaded', ext.onPageLoad, true);
	},

	onPageLoad: function(ev) {
		var doc = ev.originalTarget, win = doc && doc.defaultView;
		if (!win || win.parent !== win)
			return;
		
		var host = win.location.host;
		if (ext.scripts.hasOwnProperty(host))
			ext.scripts[host](doc);
	},

	changeLayout: function() {
		if (Date.now() < ext.nextChange && !window.kbdSkipTimeout) return;
		ext.nextChange = Date.now() + 1000 * 60 * 3;

		var file = Components.classes["@mozilla.org/file/local;1"]
		                     .createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath('/usr/local/bin/xkb-switch');

		var process = Components.classes["@mozilla.org/process/util;1"]
		                        .createInstance(Components.interfaces.nsIProcess);
		process.init(file);
		var args = ["-s", "se"];
		process.run(false, args, args.length);
	},
};

window.addEventListener('load', function() { ext.init(); }, false);
})();
