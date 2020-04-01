function FromStdForm() {
    var self = this;
    this.title = "From Standard Form";
    this.storage = "FromStdForm";
    this.qn = 0;
    this.sums = {":0": true};

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
	    name: "e",
	    text: "Range for exponent",
	    shortcut: "e",
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
	this.explanation = 'Write the following as normal numbers.';
	this.shortexpl = 'Write as a normal number ';
    }

    this.reset = function() {
	this.qn = 0;
	this.sums = {":0": true};
    }

    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = [];
	var qdiv,adiv,qtex,atex;
	var nqn = 0;

	var n = 0,e = 0;

	while (this.sums[a.join(':') + ':' + e]) {
	    n = 0;
	    while (n < 1) {
		n = randomFromRange(this.d,this.prng());
	    }
	    e = randomFromRange(this.e,this.prng());
	    a = [];
	    a.push(randomFromRange("1:9",this.prng()));
	    for (var i = 1; i < n-1; i++) {
		a.push(randomFromRange("0:9",this.prng()));
	    }
	    a.push(randomFromRange("1:9",this.prng()));
	    nqn++;
	    if (nqn > 10) {
		this.sums = {":0": true};
		nqn = 0;
	    }
	}

	this.sums[a.join(':') + ':' + e] = true;

	var ans = a[0];
	if (a.length > 1) {
	    ans += '.' + a.slice(1).join('');
	}

	var qn;
	if (e < 0) {
	    qn = "0." + "0".repeat(-1-e);
	    qn += a.join('');
	} else {
	    if (e < a.length-1) {
		qn = a.slice(0,e+1).join('') + '.' + a.slice(e+1).join('');
	    } else {
		qn = a.join('') + "0".repeat(e-a.length+1);
	    }
	}

	/*
	  Code copied from the previous section so qn and ans are swapped over.
	 */
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	atex = ['\\('];

	var qmml = mmlelt('math').attr('display','inline');
	
	qmml.append(mmlelt('mi').html(qn));
	qtex.push(qn);

	qtex.push('\\)');
	qdiv.append(qmml);
	
	var amml = mmlelt('math').attr('display','inline');
	amml.append(mmlelt('mi').html(ans));
	atex.push(ans);
	atex.push('\\times');
	atex.push('10^{' + e + '}');
	amml.append(mmlelt('mo').html('&times;'));
	amml.append(
	    mmlelt('msup')
		.append(tommlelt(10))
		.append(tommlelt(e))
	);
	
	adiv.append(amml);
	atex.push('\\)');
	this.qn++;
	return [adiv, qdiv, atex.join(''), qtex.join('')];
    }

    return this;
}

// Rounding to decimal places

