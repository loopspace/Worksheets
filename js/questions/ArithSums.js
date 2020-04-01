function ArithSums() {
    var self = this;
    this.title = "Arithmetic";
    this.storage = "ArithSums";
    this.qn = 0;
    this.sums = {"": true};

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
	    name: "a",
	    text: "Range for terms (zero is automatically excluded)",
	    shortcut: "a",
	    type: "string",
	    default: "-10:10"
	},
	{
	    name: "n",
	    text: "Range for number of terms",
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
	this.explanation = 'Calculate the following expressions.';
	this.shortexp = 'Calculate ';
    }

    this.reset = function() {
	this.qn = 0;
	this.sums = {"": true};
    }

    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = [];
	var qdiv,adiv,qtex,atex;
	var nqn = 0;

	var n = randomFromRange(this.n,this.prng());

	while (this.sums[a.slice().sort().join(':')]) {
	    a = [];
	    for (var i = 0; i < n; i++) {
		var b;
		do {
		    b = randomFromRange(this.a,this.prng());
		} while (b == 0);
		a.push(b);
	    }
	    nqn++;
	    if (nqn > 10) {
		this.sums = {"": true};
		nqn = 0;
	    }
	}

	this.sums[a.slice().sort().join(':')] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	atex = ['\\('];

	var qmml = mmlelt('math').attr('display','inline');
	
	addNumber(a[0],qtex,qmml);
	for (var i = 1; i < a.length; i++) {
	    addSignedNumber(a[i],qtex,qmml);
	}

	qtex.push('\\)');
	var s = 0;
	for (var i = 0; i < a.length; i++) {
	    s += a[i];
	}

	qdiv.append(qmml);
	
	var amml = mmlelt('math').attr('display','inline');
	addNumber(s,atex,amml);
	adiv.append(amml);
	atex.push('\\)');
	this.qn++;
	return [qdiv, adiv, qtex.join(''), atex.join('')];
    }

    return this;
}
/*
  Question Type: Multiple multiply and divides
*/

