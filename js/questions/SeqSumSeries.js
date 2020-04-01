function SeqSumSeries() {
    var self = this;
    this.title = "Sequence";
    this.storage = "SeqSumSeries";
    this.qn = 0;
    this.seqs = {"0:0": true};

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
	    name: "terms",
	    text: "Range for asked for terms",
	    shortcut: "t",
	    type: "string",
	    default: "10:20"
	},
	{
	    name: "length",
	    text: "Number of shown terms",
	    shortcut: "l",
	    type: "integer",
	    default: 4
	},
	{
	    name: "a",
	    text: "Range for first term",
	    shortcut: "a",
	    type: "string",
	    default: "1:10"
	},
	{
	    name: "d",
	    text: "Range for common difference",
	    shortcut: "d",
	    type: "string",
	    default: "1:10"
	},
	{
	    name: "repeat",
	    text: "Repeat Questions",
	    shortcut: "r",
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
	this.explanation = 'For each sequence, write down the sum of the given number of terms.';
	this.shortexp = 'Write down the sum of ';
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0": true};
    }
    
    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = 0,d = 0,n = 0;
	var qdiv,adiv,p,sep,qtex,atex;
	var nqn = 0;

	while (this.seqs[ a + ":" + d]) {
	    a = randomFromRange(this.a,this.prng());
	    d = randomFromRange(this.d,this.prng());
	    n = randomFromRange(this.terms,this.prng());
	    nqn++;
	    if (nqn > 10) {
		this.seqs = {"0:0": true};
		nqn = 0;
	    }
	}
	this.seqs[ a + ":" + d] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = '';
	atex = '';
	
	qtex = texnum(a);
	p = a;
	var qmml = mmlelt('math').attr('display','inline');
	qmml.append(tommlelt(a));

	for (var j = 1; j < this.length; j++) {
	    qmml.append(tommlelt('+'));
	    qtex += ' + ';
	    p = math.add(p,d);
	    qmml.append(tommlelt(p));
	    qtex += texnum(p);
	}
	qmml.append(tommlelt('+'));
	qmml.append(tommlelt('&hellip;'));
	qtex += ' + \\dots';
	qdiv.append(qmml);
	qtex = texwrap(qtex);
	qtex += ' to ' + totex(n) + ' terms.';
	qdiv.append($('<span>').html(" to " + n + " terms."));

	p = math.eval('n*(2*a + (n-1)*d)/2', {a: a, d: d, n: n});
	adiv.append(tomml(p));
	atex = totex(p);
	
	this.qn++;
	return [qdiv, adiv, qtex, atex];
    }
    

    return this;
}

/*
Quadratics
*/

/*
Question Type: Factorise a quadratic expression
*/

