// image-path/url, text-width/w: number of columns, text-height/h: number of rows, text-fill character/l
// background-filling-flag/g
console.art = (url, w = 30, h = 15, l = "\u2592", g = [0.6, 0.9], p = function (p) {
	this.width = p.naturalWidth; this.height = p.naturalHeight;
	let fit = (a, b) => a.slice(...b.map(v => Math.round(v * a.length))),
		avg = a => a.reduce((s, v) => v.map((e, i) => s[i] + e), a[0].map(v => 0))
		.map(v => v/a.length).map(Math.round),
		cut = (a, n = 4, c = 1) => { let r = [];
			for (let i = 0; i < a.length; i+= n) r.push([...a.slice(i, i + n - c)]);
			return r;
		}, // recursive iterator
		ij = (f, i = [], d) => function () { ((a, d = a, r = a.length ? () => {
				for (let j = 0; j < a[0]; j++) ij(f, [...i, j], d)(...a.slice(1));
			} : f) => r(i, d))([...arguments], d);
		}; // 2D-context image processing
	(c => { c.drawImage(p, 0, 0);
		let s = [this.width/w, this.height/h].map(Math.floor),
			r = [];
		ij(p => r.push(cut(c.getImageData(...p.reverse().map((v, i) => v * s[i]), ...s).data)))(h, w);
		(function (f) { // output of colored text into console
			r = (v => r.map(e => v(e).map(avg)))(g ? v => [fit(v, g), v] : v => [v]);
			console.log(this.map((v, i) => ((i + 1) % w) ? v : v + "\n").join(""), ...r.map(f));
		}).call(Array(r.length).fill("%c" + l),
			(v => a => a.reduce((s, e, i) => s.replace("$" + i, e.join(",")), v))
			("color:rgb($0)" + (g ? ";background-color:rgb($1)" : "")));
	})
	(this.getContext("2d", { willReadFrequently: true }));
}) => { // %-sign exception for l-argument
	l = l == "%" ? "\ufe6a" : l;
	g = g?.sort();
	url = (v => { v.src = url; return v; })(new Image());
	url.onload = p.bind(document.createElement("canvas"), url);
};
