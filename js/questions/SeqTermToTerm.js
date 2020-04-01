/*
Question Type: Sequences
Question Type: Sequences Term to Term
Given first term and rule in a simple sequence, write down the next k terms.
*/

function SeqTermToTerm() {
    this.title = "Sequence";
    this.storage = "SeqTermToTerm";
    this.qnsReset = {"0:0:Add ": true};

    var mkop = function(n) {
	if (n) {
	    return {op: function(u,v) { return math.add(u,v) }, type: "Add "};
	} else {
	    n = Math.floor(3*this.prng());
	    if (n == 0) {
		return {op: function(u,v) { return math.add(u,v) }, type: "Add "};
	    } else if (n == 1) {
		return {op: function(u,v) { return math.multiply(u,v) }, type: "Multiply by "};
	    } else {
		return {op: function(u,v) { return math.fraction(math.divide(u,v)) }, type: "Divide by " };
	    }
	}
    };

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
	    text: "Number of asked for terms",
	    shortcut: "t",
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
	    text: "Range for term-to-term",
	    shortcut: "d",
	    type: "string",
	    default: "1:10"
	},
	{
	    name: "linear",
	    text: "Only linear sequences",
	    shortcut: "l",
	    type: "boolean",
	    default: true
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
	this.explanation = 'For each sequence, write down the first ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + '.';
	this.shortexp = 'Write down the first ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + ' of ';
	
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0:Add ": true};
    }
    
    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = 0,d = 0,op = mkop(true);
	var qdiv,adiv,p,sep,qtex,atex;
	var nqn = 0;

	while (this.seqs[ a + ":" + d + ":" + op.type]) {
	    a = randomFromRange(this.a,this.prng());
	    d = randomFromRange(this.d,this.prng());
	    op = mkop(this.linear);
	    nqn++;
	    if (nqn > 10) {
		this.seqs = {"0:0:Add ": true};
		nqn = 0;
	    }
	}
	this.seqs[ a + ":" + d + ":" + op.type] = true;
	
	qdiv = $('<div>').addClass('question');

	qdiv.append( $('<span>').append("First term: ").append(tomml(a)).append(", "));
	qtex = "First term: " + totex(a) + ", ";
	if (op.type == "Add ") {
	    if (d > 0) {
		qdiv.append( $('<span>').append("rule: Add ").append(tomml(d)).append("."));
		qtex += 'rule: Add ' + totex(d) + ".";
	    } else {
		qdiv.append( $('<span>').append("rule: Subtract ").append(tomml(-d)).append("."));
		qtex += 'rule: Subtract ' + totex(-d) + ".";
	    }
	} else {
	    qdiv.append( $('<span>').append("rule: " + op.type).append(tomml(d)).append("."));
	    qtex += 'rule: ' + op.type + totex(d) + '.';
	}
	
	adiv = $('<div>').addClass('answer');
	adiv.append(tomml(a));
	p = a;
	atex = totex(a);

	for (var j = 1; j < this.terms; j++) {
	    adiv.append($('<span>').addClass("separator").html(", "));
	    adiv.append($('<span>').addClass("linebreak").html(""));
	    p = op.op(p,d);
	    adiv.append(tomml(p));
	    atex += ', ' + totex(p);
	}
	adiv.append($('<span>').addClass("dots").html("."));
	atex += '.';

	this.qn++;
	return [qdiv, adiv, qtex, atex];
    }
    

    return this;
}

/*
Question Type: Sequences nth Term Rule
*/

/*
Given nth term rule, write down the first k terms.
*/

