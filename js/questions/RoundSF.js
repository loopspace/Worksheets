function RoundSF() {
    var self = this;
    this.title = "Rounding to Significant Figures";
    this.storage = "RndSF";
    this.qn = 0;
    this.sums = {":0:0:0": true};

    var seedgen = new Math.seedrandom();

    this.options = [
	{
	    name: "seed",
	    text: "Random seed",
	    shortcut: "s",
	    type: "string",
	    default: ''
	},
	{
	    name: "size",
	    text: "Number of questions",
	    shortcut: "z",
	    type: "integer",
	    default: 10
	},
	{
	    name: "d",
	    text: "Range for number of significant figures",
	    shortcut: "d",
	    type: "string",
	    default: "1:10"
	},
	{
	    name: "p",
	    text: "Range for position of decimal point",
	    shortcut: "p",
	    type: "string",
	    default: "3:5"
	    
	},
	{
	    name: "n",
	    text: "Range for number of digits to drop",
	    shortcut: "n",
	    type: "string",
	    default: "3:5"
	},
	{
	    name: "repeat",
	    text: "Repeat Questions",
	    shortcut: "t",
	    type: "boolean",
	    default: false
	}
    ];

    var optdict = {};
    for (var i = 0; i < this.options.length; i++) {
	optdict[this.options[i].name] = i;
    }

    this.setOptions = function() {
	for (var i = 0; i < this.options.length; i++) {
	    if (this.options[i].type == "integer") {
		this.options[i].value = makeInt(this.options[i].element.val(),this.options[i].default);
	    } else if (this.options[i].type == "boolean") {
		this.options[i].value = this.options[i].element.is(':checked');
	    } else {
		if (this.options[i].element.val() == '') {
		    this.options[i].value = this.options[i].default;
		} else {
		    this.options[i].value = this.options[i].element.val();
		}
	    }
	    this[this.options[i].name] = this.options[i].value;
	    localStorage.setItem(this.storage + ':' + this.options[i].shortcut, this.options[i].value);
	}
	if (this.seed == '') {
	    this.seed = Math.abs(seedgen.int32()).toString();
	    this.options[optdict.seed].value = this.seed;
	    localStorage.removeItem(this.storage + ':' + this.options[optdict.seed].shortcut);
	}
	this.prng = new Math.seedrandom(this.seed);
	this.explanation = 'Round the following numbers to the given number of significant figures.';
	this.shortexp = 'Round ';
    }

    this.reset = function() {
	this.qn = 0;
	this.sums = {":0:0:0": true};
    }

    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = [];
	var qdiv,adiv,qtex,atex;
	var nqn = 0;

	var n = 0,d = 0,p = 0;

	while (this.sums[a.join(':') + ':' + [d,n,p].join(':')]) {
	    n = 0;
	    d = 0;
	    p = 0;
	    while (d < 1) {
		d = randomFromRange(this.d,this.prng());
	    }
	    while (n < 1) {
		n = randomFromRange(this.n,this.prng());
	    }
	    p = randomFromRange(this.p,this.prng());
	    a = [];
	    a.push(randomFromRange("1:9",this.prng()));
	    for (var i = 1; i < n+d-1; i++) {
		a.push(randomFromRange("0:9",this.prng()));
	    }
	    a.push(randomFromRange("1:9",this.prng()));
	    nqn++;
	    if (nqn > 10) {
		this.sums = {":0:0:0": true};
		nqn = 0;
	    }
	}

	this.sums[a.join(':') + ':' + [d,n,p].join(':')] = true;

	var b = a.slice(0,d);
	var lst = a[d];
	var dp = p;
	while (dp < 1) {
	    a.unshift(0);
	    b.unshift(0);
	    dp++;
	}

	var i = b.length - 1;
	var bdp = dp;
	if (lst >= 5) {
	    b[i]++;
	    while (i > 0 && b[i] == 10) {
		b[i] = 0;
		i--;
		b[i]++;
	    }
	    if (i == 0 && b[i] == 10) {
		b[i] = 0;
		b.unshift(1);
		bdp++;
	    }
	}
	
	var qn;
	if (a.length > dp) {
	    qn = a.slice(0,dp).join('') + '.' + a.slice(dp).join('');
	} else {
	    qn = a.join('') + "0".repeat(dp - a.length);
	}
	var ans;
	if (b.length > dp) {
	    ans = b.slice(0,bdp).join('') + '.' + b.slice(bdp).join('');
	} else {
	    ans = b.join('') + "0".repeat(bdp - b.length);
	}

	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	atex = ['\\('];

	var qmml = mmlelt('math').attr('display','inline');
	
	qmml.append(mmlelt('mi').html(qn));
	qtex.push(qn);

	qtex.push('\\)');
	qdiv.append(qmml);
	qdiv.append($('<span>').append(
	    " to "
	).append(
	    tomml(d)
	).append(
	    " significant figure" + (d == 1 ? '' : "s") + "."
	));

	qtex.push(' to \\(' + d + '\\) significant figure' + (d == 1 ? '' : 's') + '.');
	
	var amml = mmlelt('math').attr('display','inline');
	amml.append(mmlelt('mi').html(ans));
	atex.push(ans);
	
	adiv.append(amml);
	atex.push('\\)');
	this.qn++;
	return [qdiv, adiv, qtex.join(''), atex.join('')];
    }

    return this;
}

// Rounding to tens

