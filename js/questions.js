/*
TODO: need suitable defaults and option type checking
*/


/*
Question Type: Sequences
*/

/*
Question Type: Sequences Next Terms
*/

/*
Given first k terms in a simple sequence, write down the term-to-term rule and the next l terms.
*/

function SeqNextTerms() {
    var self = this;
    this.title = "Sequence";
    this.storage = "SeqNextTerms";
    this.qn = 0;
    this.seqs = {"0:0:Add ": true};

    var mkop = function(n) {
	if (n) {
	    return {op: function(u,v) { return math.add(u,v) }, type: "Add "};
	} else {
	    n = Math.floor(3*self.prng());
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
	    name: "length",
	    text: "Number of given terms",
	    shortcut: "n",
	    type: "integer",
	    default: 4
	},
	{
	    name: "terms",
	    text: "Number of asked for terms",
	    shortcut: "t",
	    type: "integer",
	    default: 2
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
	this.explanation = 'For each sequence, write down the rule and the next ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + '.';
	this.shortexp =  'Write down the rule and the next ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + ' for ';
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

	qtex = '';
	qdiv = $('<div>').addClass('question');

	qdiv.append(tomml(a));
	qtex += totex(a);
	qdiv.append($('<span>').addClass("separator").html(", "));
	qtex += ', ';
	qdiv.append($('<span>').addClass("linebreak").html(""));
	p = a;
	    
	for (var j = 1; j < this.length; j++) {
	    p = op.op(p,d);
	    qdiv.append(tomml(p));
	    qtex += totex(p);
	    qdiv.append($('<span>').addClass("separator").html(", "));
	    qtex += ', ';
	    qdiv.append($('<span>').addClass("linebreak").html(""));
	}
	qdiv.append($('<span>').addClass("dots").html("..."));
	qtex += totex('\\dots');

	atex = '';
	adiv = $('<div>').addClass('answer');
	sep = ",";
	if (op.type == "Add ") {
	    if (d > 0) {
		atex = 'Add ' + totex(d);
		adiv.append( $('<span>').html("Add " + d + ":").addClass('rule'));
	    } else {
		atex = 'Subtract ' + totex(-d);
		adiv.append( $('<span>').html("Subtract " + (-d) + ":").addClass('rule'));
	    }
	} else {
	    atex = op.type + totex(d);
	    adiv.append( $('<span>').html(op.type + d + ":").addClass('rule'));
	}
	adiv.append($('<span>').addClass("linebreak").html("&nbsp;"));
	atex += ': ';
	for (var j = 0; j < this.terms; j++) {
	    adiv.append(tomml(op.op(p,d)));
	    p = op.op(p,d);
	    atex += totex(p);
	    
	    if (j == this.terms - 1) sep = ".";
	    adiv.append($('<span>').addClass("separator").html(sep));
	    adiv.append($('<span>').addClass("linebreak").html("&nbsp;"));
	    atex += sep + ' ';
	}
	
	this.qn++;
	return [qdiv, adiv, qtex, atex];
    }
    

    return this;
}

/*
Question Type: Sequences Term to Term
*/

/*
Given first term and rule in a simple sequence, write down the next k terms.
*/

function SeqTermToTerm() {
    var self = this;
    this.title = "Sequence";
    this.storage = "SeqTermToTerm";
    this.qn = 0;
    this.seqs = {"0:0:Add ": true};

    var mkop = function(n) {
	if (n) {
	    return {op: function(u,v) { return math.add(u,v) }, type: "Add "};
	} else {
	    n = Math.floor(3*self.prng());
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

function SeqnthTerm() {
    var self = this;
    this.title = "Sequence";
    this.storage = "SeqnthTerm";
    this.qn = 0;
    this.seqs = {"0:0:0": true};

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
	    text: "Range for quadratic term",
	    shortcut: "a",
	    type: "string",
	    default: "0:2"
	},
	{
	    name: "b",
	    text: "Range for linear term",
	    shortcut: "b",
	    type: "string",
	    default: "0:6"
	},
	{
	    name: "c",
	    text: "Range for constant term",
	    shortcut: "c",
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
	this.explanation = 'For each sequence, write down the first ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + '.';
	this.shortexp = 'Write down the first ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + ' of ';
	
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0:0": true};
    }
    
    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = 0,b = 0,c = 0;
	var qdiv,adiv,p,sep,atex,qtex;
	var nqn = 0;

	while (this.seqs[ a + ":" + b + ":" + c ]) {
	    a = randomFromRange(this.a,this.prng());
	    b = randomFromRange(this.b,this.prng());
	    c = randomFromRange(this.c,this.prng());
	    nqn++;
	    if (nqn > 10) {
		this.seqs = {"0:0:0": true};
		nqn = 0;
	    }
	}
	this.seqs[ a + ":" + b + ":" + c ] = true;
	
	qdiv = $('<div>').addClass('question');
	qtex = '';

	var quad = mmlelt('math').attr('display','inline');
	var quadtex = '';
	if (a != 0) {
	    if (a != 1) {
		if (a == -1) {
		    quad.append(tommlelt('-').attr('lspace',"verythinmathspace").attr('rspace',"0em"));
		    quadtex += '-';
		} else {
		    quad.append(tommlelt(a));
		    quadtex += a;
		}
	    }
	    quad.append(
		mmlelt('msup').append(
		    tommlelt('n')
		).append(
		    tommlelt('2')
		)
	    );
	    quadtex += 'n^2';
	}
	if (b != 0) {
	    if (a != 0) {
		if (b > 0) {
		    quad.append(tommlelt('+'));
		    quadtex += '+';
		} else {
		    quad.append(tommlelt('-'));
		    quadtex += '-';
		}
	    } else if (b < 0) {
		quad.append(tommlelt('-').attr('lspace',"verythinmathspace").attr('rspace',"0em"));
		quadtex += '-';
	    }
	    if (b != 1 && b != -1) {
		quad.append(tommlelt(math.abs(b)));
		quadtex += b;
	    }
	    quad.append(tommlelt('n'));
	    quadtex += 'n';
	}
	if (c != 0) {
	    if (a != 0 || b != 0) {
		if (c > 0) {
		    quad.append(tommlelt('+'));
		    quadtex += '+';
		} else {
		    quad.append(tommlelt('-'));
		    quadtex += '-';
		}		    
	    } else if (c < 0) {
		quad.append(tommlelt('-').attr('lspace',"verythinmathspace").attr('rspace',"0em"));
		quadtex += '-';
	    }
	    quad.append(tommlelt(math.abs(c)));
	    quadtex += c;
	}
	
	qdiv.append( $('<span>').append(tomml('n')).append("th term is: ").append(quad) );
	qtex += totex('n') + 'th term is: ' + texwrap(quadtex);
	
	adiv = $('<div>').addClass('answer');
	atex = '';

	for (var j = 0; j < this.terms; j++) {
	    p = math.eval('a*(n+1)^2 + b*(n+1) + c',{a: a, b: b, c: c, n: j});
	    adiv.append(tomml(p));
	    atex += totex(p);
	    if (j != this.terms - 1) {
		adiv.append($('<span>').addClass("separator").html(", "));
		adiv.append($('<span>').addClass("linebreak").html(""));
		atex += ', ';
	    }
	}
	adiv.append($('<span>').addClass("dots").html("."));
	atex += '.';

	this.qn++;
	return [qdiv, adiv, qtex, atex];
    }
    

    return this;
}

/*
Question Type: Sequences First Term and Common Difference
*/

/*
Given linear sequence, write down first term and common difference.
*/

function SeqArithSeq() {
    var self = this;
    this.title = "Sequence";
    this.storage = "SeqArithSeq";
    this.qn = 0;
    this.seqs = {"0:0": true};
    this.explanation = 'For each sequence, write down the first term (' + tomml('a')[0].outerHTML +  ') and the common difference (' + tomml('d')[0].outerHTML + ').';
    this.shortexp = 'Write down the first term (' + tomml('a')[0].outerHTML +  ') and the common difference (' + tomml('d')[0].outerHTML + ') of ';

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
	    text: "Number of given terms",
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
	
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0": true};
    }
    
    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = 0,d = 0;
	var qdiv,adiv,p,sep,qtex,atex;
	var nqn = 0;

	while (this.seqs[ a + ":" + d]) {
	    a = randomFromRange(this.a,this.prng());
	    d = randomFromRange(this.d,this.prng());
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

	adiv.append(
	    $('<span>').append(
		mmlelt('math').attr('display','inline').append(
		    tommlelt('a')
		).append(
		    tommlelt('=')
		).append(
		    tommlelt(a)
		)
	    ).append(", ")
	);

	adiv.append(
	    $('<span>').append(
		mmlelt('math').attr('display','inline').append(
		    tommlelt('d')
		).append(
		    tommlelt('=')
		).append(
		    tommlelt(d)
		)
	    ).append(". ")
	);
	atex = texwrap('a = ' + texnum(a)) + ', ' + texwrap('d = ' + texnum(d)) + '.';

	p = a;
	qtex = '';
	for (var j = 0; j < this.terms; j++) {
	    qdiv.append(tomml(p));
	    qtex += totex(p) + ", ";
	    p = math.add(p,d);
	    qdiv.append($('<span>').addClass("separator").html(", "));
	    qdiv.append($('<span>').addClass("linebreak").html(""));
	}
	qtex += totex('\\dotsc');
	qdiv.append($('<span>').addClass("dots").html("..."));

	this.qn++;
	return [qdiv, adiv, qtex, atex];
    }
    

    return this;
}

/*
Question Type: Sequences nth Term of Arithmetic Sequence
*/

/*
Given linear sequence, write down nth term and a particular term
*/

function SeqArithTerm() {
    var self = this;
    this.title = "Sequence";
    this.storage = "SeqArithTerm";
    this.qn = 0;
    this.seqs = {"0:0": true};
    this.explanation = 'For each sequence, write down the formula for the nth term and the given term.';
    this.shortexp = 'Write down the formula for the nth term and the given term of ';

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
	    text: "Number of given terms",
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
	    text: "Range for common difference",
	    shortcut: "d",
	    type: "string",
	    default: "1:10"
	},
	{
	    name: "k",
	    text: "Range for requested kth term",
	    shortcut: "k",
	    type: "string",
	    default: "20:40"
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
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0": true};
    }
    
    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = 0,d = 0,k = 0;
	var qdiv,adiv,p,sep,qtex,atex;
	var nqn = 0;

	while (this.seqs[ a + ":" + d ]) {
	    a = randomFromRange(this.a,this.prng());
	    d = randomFromRange(this.d,this.prng());
	    k = randomFromRange(this.k,this.prng());
	    nqn++;
	    if (nqn > 10) {
		this.seqs = {"0:0": true};
		nqn = 0;
	    }
	}
	this.seqs[ a + ":" + d ] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = '';
	atex = '';

	var op,dif,term;
	if (a - d > 0) {
	    op = tommlelt('+');
	    dif = tommlelt(a - d);
	} else if (a - d < 0) {
	    op = tommlelt('-');
	    dif = tommlelt(d - a);
	}
	term = a + d*(k-1);

	var nthterm = mmlelt('math').attr('display','inline');
	atex = '';

	if (d == -1) {
	    nthterm.append(tommlelt("-"));
	    atex += '-';
	} else if (d != 1) {
	    nthterm.append(tommlelt(d));
	    atex += d;
	}

	nthterm.append(tommlelt("n"));
	atex += 'n';

	if (a - d > 0) {
	    nthterm.append(tommlelt("+"));
	    nthterm.append(tommlelt(a - d));
	    atex += '+';
	    atex += a - d;
	} else if (a - d < 0) {
	    nthterm.append(tommlelt("-"));
	    nthterm.append(tommlelt(d - a));
	    atex += '-';
	    atex += d - a;
	}
	
	
	adiv.append(
	    $('<span>').append(nthterm).append("; ")
	);

	adiv.append(
	    $('<span>').append(
		mmlelt('math').attr('display','inline').append(
		    tommlelt(term)
		)
	    ).append(". ")
	);
	atex = texwrap(atex) + '; ' + texwrap(term) + '.';

	p = a;
	qtex = '';
	for (var j = 0; j < this.terms; j++) {
	    qdiv.append(tomml(p));
	    qtex += totex(p) + ", ";
	    p = math.add(p,d);
	    qdiv.append($('<span>').addClass("separator").html(", "));
	    qdiv.append($('<span>').addClass("linebreak").html(""));
	}
	qtex += totex('\\dotsc');
	qdiv.append($('<span>').addClass("dots").html("..."));
	qdiv.append($('<span>').append(
	    ";&nbsp;"
	).append(
	    tomml(k)
	).append(
	    ordinal_suffix_of(k) + " term"
	));
	qtex += '; ' + totex(k) +  ordinal_suffix_of(k) + ' term.';

	this.qn++;
	return [qdiv, adiv, qtex, atex];
    }

    return this;
}

/*
Question Type: Sequences Sum of Arithmetic Series
*/

/*
Given a linear sequence, sum the first n terms 
*/

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

function QuadFact() {
    var self = this;
    this.title = "Quadratics";
    this.storage = "QuadFact";
    this.qn = 0;
    this.quads = {"0:0:0:0": true};

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
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "a",
	    type: "string",
	    default: "1"
	},
	{
	    name: "b",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "b",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "c",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "c",
	    type: "string",
	    default: "1"
	},
	{
	    name: "d",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>d</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "d",
	    type: "string",
	    default: "-5:5"
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
	this.explanation = 'Factorise each quadratic expression';
	this.shortexp = 'Factorise ';
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var a = 0,b = 0, c = 0,d = 0;
	 var qdiv,adiv,p,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while (math.gcd(a,b,c,d) != 1 || a * c == 0 || b**2 + d**2 == 0 || this.quads[ a + ":" + b + ":" + c + ":" + d]) {
	     a = randomFromRange(this.a,this.prng());
	     b = randomFromRange(this.b,this.prng());
	     c = randomFromRange(this.c,this.prng());
	     d = randomFromRange(this.d,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.quads = {"0:0:0:0": true};
		 nqn = 0;
	     }
	}
	this.quads[ a + ":" + b + ":" + c + ":" + d] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];
	 coeffn = addCoefficient;
	 numbfn = addNumber;

	 var qmml = mmlelt('math').attr('display','inline');

	 if (coeffn(a * c,qtex,qmml)) {
	     qmml.append(
		 mmlelt('msup').append(
		     tommlelt('x')
		 ).append(
		     tommlelt('2')
		 )
	     );
	     qtex.push('x^2');
	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 if (coeffn(a * d + c * b,qtex,qmml)) {
	     qtex.push(' x ');
	     qmml.append(tommlelt('x'));
	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 numbfn(b * d,qtex,qmml);
	 qdiv.append(qmml);
	 qtex.push('\\)');
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex.push('\\(');

	 coeffn = addCoefficient;
	 numbfn = addNumber;

	 if (b != 0) {
	     atex.push("(");
	     amml.append(tommlelt('('));
	 }
	 
	 if (coeffn(a,atex,amml)) {
	     atex.push(" x ");
	     amml.append(tommlelt('x'));
	     numbfn = addSignedNumber;
	 }

	 if (numbfn(b,atex,amml)) {
	     atex.push(")");
	     amml.append(tommlelt(')'));
	 }

	 numbfn = addNumber;

	 if (d != 0) {
	     atex.push("(");
	     amml.append(tommlelt('('));
	 }
	 
	 if (coeffn(c,atex,amml)) {
	     atex.push(" x ");
	     amml.append(tommlelt('x'));
	     numbfn = addSignedNumber;
	 }

	 if (numbfn(d,atex,amml)) {
	     atex.push(")");
	     amml.append(tommlelt(')'));
	 }
	 
	 adiv.append(amml);
	 atex.push('\\)');
	
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
   
    
    return this;
}

/*
Question type: Solve a quadratic using factorisation
*/

function QuadSolveFact() {
    var self = this;
    this.title = "Quadratics";
    this.storage = "QuadSolveFact";
    this.qn = 0;
    this.quads = {"0:0:0:0": true};

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
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "a",
	    type: "string",
	    default: "1"
	},
	{
	    name: "b",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "b",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "c",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "c",
	    type: "string",
	    default: "1"
	},
	{
	    name: "d",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>d</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "d",
	    type: "string",
	    default: "-5:5"
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
	this.explanation = 'Solve each quadratic function using factorisation.';
	this.shortexp = 'Solve by factorising ';
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var a = 0,b = 0, c = 0,d = 0;
	 var qdiv,adiv,p,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while (math.gcd(a,b,c,d) != 1 || a == 0 || c == 0 || b*d == 0 || this.quads[ a + ":" + b + ":" + c + ":" + d]) {
	     a = randomFromRange(this.a,this.prng());
	     b = randomFromRange(this.b,this.prng());
	     c = randomFromRange(this.c,this.prng());
	     d = randomFromRange(this.d,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.quads = {"0:0:0:0": true};
		 nqn = 0;
	     }
	}
	this.quads[ a + ":" + b + ":" + c + ":" + d] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	atex = [];

	 var qmml = mmlelt('math').attr('display','inline');

	 coeffn = addCoefficient;
	 numbfn = addNumber;

	 if (coeffn(a * c, qtex, qmml)) {
	     qmml.append(
		 mmlelt('msup').append(
		     tommlelt('x')
		 ).append(
		     tommlelt('2')
		 )
	     );
	     qtex.push( 'x^2');
	     
	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 if (coeffn(a * d + c * b,qtex,qmml)) {
	     qtex.push(' x ');
	     qmml.append(tommlelt('x'));

	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }
	 numbfn(b * d,qtex,qmml);

	 qmml.append(tommlelt('='));
	 qmml.append(tommlelt(0));
	 
	 qdiv.append(qmml);
	 qtex.push(' = 0\\)');
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex = ['\\('];

	 p = math.fraction(math.divide(-b,a));

	 atex.push('x = ');
	 atex.push(texnum(p));
	 atex.push('\\), ');

	 amml.append(tommlelt('x'));
	 amml.append(tommlelt('='));
	 amml.append(tommlelt(p));
	 adiv.append(amml);
	 adiv.append($('<span>').addClass("separator").html(", "));
	 
	 amml = mmlelt('math').attr('display','inline');
	 atex.push('\\(');

	 p = math.fraction(math.divide(-d,c));

	 atex.push('x = ');
	 atex.push(texnum(p));
	 atex.push('\\)');
	
	 amml.append(tommlelt('x'));
	 amml.append(tommlelt('='));
	 amml.append(tommlelt(p));
	 adiv.append(amml);

	 this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
    
    return this;
}

/*
Question type: Complete the square
*/

function QuadCplt() {
    var self = this;
    this.title = "Quadratics";
    this.storage = "QuadCplt";
    this.qn = 0;
    this.quads = {"0:0:0": true};

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
	    name: "p",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>",
	    shortcut: "p",
	    type: "string",
	    default: "1"
	},
	{
	    name: "q",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>q</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>",
	    shortcut: "q",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "r",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>r</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>",
	    shortcut: "r",
	    type: "string",
	    default: "-5:5"
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
	this.explanation = 'Complete the square for each quadratic expression';
	this.shortexp = 'Complete the square for ';
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var p = 0,q = 0, r = 0;
	 var qdiv,adiv,a,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while (p == 0 || this.quads[ p + ":" + q + ":" + r]) {
	     p = randomFromRange(this.p,this.prng());
	     q = randomFromRange(this.q,this.prng());
	     r = randomFromRange(this.r,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.quads = {"0:0:0": true};
		 nqn = 0;
	     }
	}
	this.quads[ p + ":" + q + ":" + r] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];
	 coeffn = addCoefficient;
	 numbfn = addNumber;

	 var qmml = mmlelt('math').attr('display','inline');
	 if (coeffn(p,qtex,qmml)) {
	     qmml.append(
		 mmlelt('msup').append(
		     tommlelt('x')
		 ).append(
		     tommlelt('2')
		 )
	     );
	     qtex.push('x^2');

	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 if (coeffn(2 * p * q,qtex,qmml)) {
	     qtex.push(' x ');
	     qmml.append(tommlelt('x'));

	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 numbfn(p * q**2 + r,qtex,qmml);
	 qdiv.append(qmml);
	 qtex.push('\\)');
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex.push('\\(');

	 addCoefficient(p,atex,amml);

	 var bmml = mmlelt('msup');
	 var gmml = mmlelt('mrow');

	 
	 if (q != 0) {
	     atex.push('(');
	     gmml.append(tommlelt('('));
	 }

	 atex.push('x');
	 gmml.append(tommlelt('x'));

	 if (addSignedNumber(q,atex,gmml)) {
	     atex.push(')');
	     gmml.append(tommlelt(')'));
	 }

	 atex.push('^2');
	 bmml.append(
	     gmml
	 ).append(
	     tommlelt('2')
	 )
	 amml.append(bmml);

	 addSignedNumber(r,atex,amml);
	 
	 adiv.append(amml);
	 atex.push('\\)');
	
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
   
    
    return this;
}

/*
Question type: Solve a quadratic by completing the square
*/

function QuadSolveCplt() {
    var self = this;
    this.title = "Quadratics";
    this.storage = "QuadSolveCplt";
    this.qn = 0;
    this.quads = {"0:0:0": true};

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
	    name: "p",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>",
	    shortcut: "p",
	    type: "string",
	    default: "1"
	},
	{
	    name: "q",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>q</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>",
	    shortcut: "q",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "r",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>r</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>",
	    shortcut: "r",
	    type: "string",
	    default: "-5:5"
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
	this.explanation = 'Solve the following quadratic equations by completing the square.';
	this.shortexp = 'Solve by completing the square ';
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var p = 0,q = 0, r = 0;
	 var qdiv,adiv,a,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while (p == 0 || this.quads[ p + ":" + q + ":" + r]) {
	     p = randomFromRange(this.p,this.prng());
	     q = randomFromRange(this.q,this.prng());
	     r = randomFromRange(this.r,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.quads = {"0:0:0": true};
		 nqn = 0;
	     }
	}
	this.quads[ p + ":" + q + ":" + r] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];
	 coeffn = addCoefficient;
	 numbfn = addNumber;

	 var qmml = mmlelt('math').attr('display','inline');
	 if (coeffn(p,qtex,qmml)) {
	     qmml.append(
		 mmlelt('msup').append(
		     tommlelt('x')
		 ).append(
		     tommlelt('2')
		 )
	     );
	     qtex.push('x^2');

	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }
	 if (coeffn(2*p*q,qtex,qmml)) {
	     qtex.push(' x ');
	     qmml.append(tommlelt('x'));

	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 numbfn(p * q**2 + r,qtex,qmml);
	 qmml.append(tommlelt('='));
	 qmml.append(tommlelt(0));

	 qdiv.append(qmml);
	 qtex.push(' = 0\\)');

	 var amml;
	 
	 if (p < 0) {
	     p = - p;
	     r = - r;
	 }
	 
	 if (r > 0) {
	     adiv.append($('<span>').html("No solution."));
	     atex = ['No solution.'];
	 } else {
	     r = - r;
	     q = - q;
	     amml = mmlelt('math').attr('display','inline');
	     amml.append(tommlelt('x'));
	     amml.append(tommlelt('='));
	     atex = ['\\( x = '];

	     var a = math.fraction(math.divide(r,p));
	     if (hasSquareRoot(a)) {
		 var b = math.fraction(math.add(q,a));
		 amml.append(tommlelt(b));
		 atex.push(texnum(b));

		 atex.push('\\)');

		 adiv.append(amml);
		 if (a == 0) {
		     adiv.append(amml);
		     adiv.append($('<span>').html(" repeated."));
		     atex.push(' repeated.');
		 } else {
		     adiv.append($('<span>').addClass("separator").html(", "));
		 
		     amml = mmlelt('math').attr('display','inline');
		     amml.append(tommlelt('x'));
		     amml.append(tommlelt('='));
		 
		     var b = math.fraction(math.subtract(q,a));
		     amml.append(tommlelt(b));
		     atex.push(', \\(x = ');
		     atex.push(texnum(b));
		     atex.push('\\)');
		     adiv.append(amml);
		 }

	     } else {
		 
		 if (q != 0) {
		     amml.append(tommlelt(q));
		     atex.push(q);
		 }

		 
		 if (r != 0) {
		     var b = math.fraction(math.divide(r,p));
		     amml.append(tommlelt('&plusmn;'));
		     amml.append(
			 mmlelt('msqrt').append(tommlelt(b))
		     );
		     atex.push('\\pm \\sqrt{' + texnum(b) + '}');
		 }
		 atex.push('\\)');
		 adiv.append(amml);
	     }
	 }
	 
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
    
    return this;
}


/*
Question type: Solve a quadratic using the formula
*/

function QuadFormula() {
    var self = this;
    this.title = "Quadratics";
    this.storage = "QuadFormula";
    this.qn = 0;
    this.quads = {"0:0:0": true};

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
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "a",
	    type: "string",
	    default: "1"
	},
	{
	    name: "b",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "b",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "c",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "c",
	    type: "string",
	    default: "-5:5"
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
	this.explanation = 'Solve the following quadratic equations.';
	this.shortexp = 'Solve ';
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var a = 0,b = 0, c = 0;
	 var qdiv,adiv,p,q,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while (a == 0 || this.quads[ a + ":" + b + ":" + c]) {
	     a = randomFromRange(this.a,this.prng());
	     b = randomFromRange(this.b,this.prng());
	     c = randomFromRange(this.c,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.quads = {"0:0:0": true};
		 nqn = 0;
	     }
	}
	this.quads[ a + ":" + b + ":" + c] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];

	 coeffn = addCoefficient;
	 numbfn = addNumber;

	 var qmml = mmlelt('math').attr('display','inline');
	 if (coeffn(a,qtex,qmml)) {
	     qmml.append(
		 mmlelt('msup').append(
		     tommlelt('x')
		 ).append(
		     tommlelt('2')
		 )
	     );
	     qtex.push('x^2');

	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 if (coeffn(b,qtex,qmml)) {
	     qtex.push(' x ');
	     qmml.append(tommlelt('x'));

	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 numbfn(c,qtex,qmml);

	 qmml.append(tommlelt('='));
	 qmml.append(tommlelt('0'));
	 
	 qdiv.append(qmml);
	 qtex.push('= 0 \\)');

	 var amml;
	 numbfn = addNumber;
	 coeffn = addCoefficient;

	 p = b**2 - 4*a*c;

	 if (p < 0) {
	     adiv.append($('<span>').html("No solution: "));
	     amml = mmlelt('math').attr('display','inline');
	     amml.append(
		 mmlelt('msup').append(
		     tommlelt('b')
		 ).append(
		     tommlelt('2')
		 )
	     );
	     amml.append(tommlelt('-'));
	     amml.append(tommlelt(4));
	     amml.append(tommlelt('a'));
	     amml.append(tommlelt('c'));
	     amml.append(tommlelt('='));
	     amml.append(tommlelt(p));
	     adiv.append(amml);

	     atex.push('No solution: \\(b^2 - 4 a c = ' + texnum(p) + '\\).');
	 } else {
	     amml = mmlelt('math').attr('display','inline');
	     amml.append(tommlelt('x'));
	     amml.append(tommlelt('='));
	     atex.push('\\( x = ');

	     if (p != 0) {

		 var pd = primeDecomposition(p);
		 var nsq = 1;
		 var sq = 1;

		 var l;
		 for (var i = 0; i < pd.length; i++) {
		     l = pd[i][1];
		     if (l%2 == 1) {
			 sq *= pd[i][0];
			 l--;
		     }
		     l /= 2;
		     for (var j = 0; j < l; j++) {
			 nsq *= pd[i][0];
		     }
		 }

		 if (sq == 1) {
		     q = math.fraction(math.divide(-b + nsq,2*a));
		     amml.append(tommlelt(q));
		     atex.push(texnum(q));


		     atex.push('\\), \\(x = ');
		     adiv.append(amml);
		     adiv.append($('<span>').addClass("separator").html(", "));
		 
		     amml = mmlelt('math').attr('display','inline');
		     amml.append(tommlelt('x'));
		     amml.append(tommlelt('='));
		     
		     q = math.fraction(math.divide(-b - nsq,2*a));
		     amml.append(tommlelt(q));
		     atex.push(texnum(q));
		 } else {
		     q = math.fraction(math.divide(-b,2*a));
		     numbfn(q,atex,amml);
		     
		     amml.append(tommlelt('&plusmn;'));
		     atex.push(' \\pm ');

		     q = math.fraction(math.divide(nsq,math.abs(2*a)));
		     coeffn(q,atex,amml);
		 
		     amml.append(
			 mmlelt('msqrt')
			     .append(mmlelt('mrow')
				     .append(tommlelt(sq))
				    )
		     );

		     atex.push('\\sqrt{');
		     atex.push(sq);
		     atex.push('}');
		 }
		 atex.push('\\)');
		 adiv.append(amml);
	     } else {
		 q = math.fraction(math.divide(-b,2*a));
		 amml.append(tommlelt(q));
		 atex.push(texnum(q));

		 adiv.append(amml);
		 adiv.append($('<span>').html(" repeated."));
		 atex.push('\\)');
		 atex.push(' repeated.');
		 
	     }
	 }
	 
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
    
    return this;
}

/*
  Arithmetic
*/

/*
  Question Type: Multiple add and subtracts
*/

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

function ArithProds() {
    var self = this;
    this.title = "Arithmetic";
    this.storage = "ArithProds";
    this.qn = 0;
    this.prods = {";": true};

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
	    text: "Range for terms (zero and one are automatically excluded)",
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
	this.prods = {";": true};
    }

    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = [];
	var m = [];
	var qdiv,adiv,qtex,atex;
	var nqn = 0;

	var n = randomFromRange(this.n,this.prng());

	while (this.prods[a.join(':') + ";" + m.join(':')]) {
	    a = [];
	    for (var i = 0; i < n; i++) {
		var b;
		do {
		    b = randomFromRange(this.a,this.prng());
		} while (b == 0 || b == 1);
		a.push(b);
	    }
		m = [];
		for (var i = 0; i < n-1; i++) {
			m.push(Math.round10(this.prng(),0));
		}
	    nqn++;
	    if (nqn > 10) {
		this.prods = {"": true};
		nqn = 0;
	    }
	}

	this.prods[a.join(':') + ";" + m.join(':')] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	atex = ['\\('];

	var qmml = mmlelt('math').attr('display','inline');

	addNumber(a[0],qtex,qmml);
	var s = a[0];
	for (var i = 1; i < a.length; i++) {
		if (m[i-1] == 1) {
			qtex.push('\\times');
			qmml.append(mmlelt('mo').html('&times;'));
			s = math.multiply(s,a[i]);
		} else {
			qtex.push('\\div');
			qmml.append(mmlelt('mo').html('&div;'));
			s = math.fraction(math.divide(s,a[i]));
		}
	    addNumber(a[i],qtex,qmml);
	}

	qtex.push('\\)');
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
  Question Type: Multiple add and subtracts of fractions
*/

function ArithSumFracts() {
    var self = this;
    this.title = "Arithmetic";
    this.storage = "ArithSumFracts";
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
	    text: "Range for numerators (zero is automatically excluded)",
	    shortcut: "a",
	    type: "string",
	    default: "-10:10"
	},
	{
	    name: "d",
	    text: "Range for denominators (zero is automatically excluded)",
	    shortcut: "d",
	    type: "string",
	    default: "-10:10"
	},
/*	{
	    name: "simple",
	    text: "Fractions in simplest terms only",
	    shortcut: "q",
	    type: "boolean",
	    default: false
	},
*/
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
		var b,d;
		do {
		    b = randomFromRange(this.a,this.prng());
		    d = randomFromRange(this.d,this.prng());
		} while (b == 0 || d == 0);
		a.push(math.fraction(math.divide(b,d)));
	    }
	    nqn++;
	    if (nqn > 10) {
		this.sums = {"": true};
		nqn = 0;
	    }
	}
	console.log(a);
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
	    s = math.add(s,a[i]);
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

function ArithProdFracts() {
    var self = this;
    this.title = "Arithmetic";
    this.storage = "ArithProdFracts";
    this.qn = 0;
    this.prods = {";": true};

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
	    text: "Range for numerators (zero is automatically excluded)",
	    shortcut: "a",
	    type: "string",
	    default: "-10:10"
	},
	{
	    name: "d",
	    text: "Range for denominators (zero is automatically excluded)",
	    shortcut: "d",
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
	this.prods = {";": true};
    }

    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = [];
	var m = [];
	var qdiv,adiv,qtex,atex;
	var nqn = 0;

	var n = randomFromRange(this.n,this.prng());

	while (this.prods[a.join(':') + ";" + m.join(':')]) {
	    a = [];
	    for (var i = 0; i < n; i++) {
		var b,d;
		do {
		    b = randomFromRange(this.a,this.prng());
		    d = randomFromRange(this.d,this.prng());
		} while (b == 0 || d == 0 || b == d);
		a.push(math.fraction(math.divide(b,d)));
	    }
		m = [];
		for (var i = 0; i < n-1; i++) {
			m.push(Math.round10(this.prng(),0));
		}
	    nqn++;
	    if (nqn > 10) {
		this.prods = {"": true};
		nqn = 0;
	    }
	}

	this.prods[a.join(':') + ";" + m.join(':')] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	atex = ['\\('];

	var qmml = mmlelt('math').attr('display','inline');

	addNumber(a[0],qtex,qmml);
	var s = a[0];
	for (var i = 1; i < a.length; i++) {
		if (m[i-1] == 1) {
			qtex.push('\\times');
			qmml.append(mmlelt('mo').html('&times;'));
			s = math.multiply(s,a[i]);
		} else {
			qtex.push('\\div');
			qmml.append(mmlelt('mo').html('&div;'));
			s = math.fraction(math.divide(s,a[i]));
		}
	    addNumber(a[i],qtex,qmml);
	}

	qtex.push('\\)');
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
Rounding and Standard Form
*/

// To standard form

function ToStdForm() {
    var self = this;
    this.title = "To Standard Form";
    this.storage = "ToStdForm";
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
	this.explanation = 'Write the following in standard form.';
	this.shortexp = 'Write in standard form ';
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
	return [qdiv, adiv, qtex.join(''), atex.join('')];
    }

    return this;
}

// From standard form

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

function RoundDP() {
    var self = this;
    this.title = "Rounding to Decimal Places";
    this.storage = "RndDP";
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
	    text: "Range for number of decimal places",
	    shortcut: "d",
	    type: "string",
	    default: "1:10"
	},
	{
	    name: "n",
	    text: "Range for number of digits to drop",
	    shortcut: "n",
	    type: "string",
	    default: "3:5"
	},
	{
	    name: "m",
	    text: "Range for number of digits to keep",
	    shortcut: "m",
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
	this.explanation = 'Round the following numbers to the given number of decimal places.';
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

	var n = 0,d = 0,m = 0;

	while (this.sums[a.join(':') + ':' + d + ':' + n + ':' + m]) {
	    n = 0;
	    m = 0;
	    d = 0;
	    while (d < 1) {
		d = randomFromRange(this.d,this.prng());
	    }
	    while (n < 1) {
		n = randomFromRange(this.n,this.prng());
	    }
	    while (m < 1) {
		m = randomFromRange(this.m,this.prng());
	    }
	    a = [];
	    a.push(randomFromRange("1:9",this.prng()));
	    for (var i = 1; i < n+m-1; i++) {
		a.push(randomFromRange("0:9",this.prng()));
	    }
	    a.push(randomFromRange("1:9",this.prng()));
	    nqn++;
	    if (nqn > 10) {
		this.sums = {":0:0:0": true};
		nqn = 0;
	    }
	}

	this.sums[a.join(':') + ':' + d + ':' + n + ':' + m] = true;

	var b = a.slice(0,m);
	var lst = a[m];
	var dp = m - d;
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
	
	var qn = a.slice(0,dp).join('') + '.' + a.slice(dp).join('');
	var ans = b.slice(0,bdp).join('') + '.' + b.slice(bdp).join('');

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
	    " decimal places."
	));

	qtex.push(' to \\(' + d + '\\) decimal places.');
	
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

// Rounding to significant figures

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

/*
  Trigonometry Questions
*/

function SineRule() {
    var self = this;
    this.title = "Using the Sine Rule";
    this.storage = "SineR";
    this.qn = 0;
    this.triangles = {"": true};

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
	    text: "Accuracy of numbers",
	    shortcut: "d",
	    type: "string",
	    default: "3"
	},
	{
	    name: "m",
	    text: "Multiplier for side length",
	    shortcut: "m",
	    type: "range",
	    default: "3:10"
	},
	{
	    name: "obtuse",
	    text: "Allow obtuse angles",
	    shortcut: "b",
	    type: "boolean",
	    default: false
	},
	{
	    name: "ambiguous",
	    text: "Allow ambiguous triangles",
	    shortcut: "g",
	    type: "boolean",
	    default: false
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
	this.explanation = 'Find the stated angle or length in each of the following triangles.';
	this.shortexp = 'Let ' + tomml('ABC')[0].outerHTML + ' be a triangle. ';
    }

    this.reset = function() {
	this.qn = 0;
	this.triangles = {"": true};
    }

    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = [];
	var qdiv,adiv,qtex,atex;
	var nqn = 0;

	var A,B,C,p,r,s,m,omit,find;
	p = Math.pow(10,this.d);
	r = '1:' + (p-1);
	s = 0;

	while (this.triangles[a.join(':')]) {

	    A = 0;
	    B = 0;

	    while (A == B) {
		A = randomFromRange(r,this.prng());
		B = randomFromRange(r,this.prng());
	    }

	    a = [A,B];
	    a.sort(function(a, b) {return a - b;});

	    a[2] = p - a[1];
	    a[1] -= a[0];

	    a.sort(function(a, b) {return a - b;});

	    if (!this.obtuse && a[2] > p/2) {
		a = [];
		continue;
	    }
	    
	    omit = randomFromRange('0:2',this.prng());
	    find = randomFromRange('0:3',this.prng());
	    if (!this.ambiguous && find < 2) {
		// Finding an angle,
		var b = a.slice(0,3);
		b.splice(omit,1);
		// Check for ambiguous case:
		// 180 - A + B < 180
		// => -A + B < 0
		// => B < A
		if (b[find] > b[1 - find]) {
		    a = [];
		    continue;
		}
	    }

	    a.push(randomFromRange(r,this.prng()));

	    nqn++;
	    if (nqn > 10) {
		this.triangles = {"": true};
		nqn = 0;
		break;
	    }
	}

	this.triangles[a.join(':')] = true;
	
	m = randomFromRange(this.m,this.prng());
	
	a[0] *= 180/p;
	a[1] *= 180/p;
	a[2] *= 180/p;

	a.push(a[3] * Math.sin(a[1]*Math.PI/180)/Math.sin(a[0]*Math.PI/180));
	a.push(a[3] * Math.sin(a[2]*Math.PI/180)/Math.sin(a[0]*Math.PI/180));

	a[3] *= m/p;
	a[4] *= m/p;
	a[5] *= m/p;

	for (var i = 0; i < 6; i++) {
	    a[i] = Math.roundsf(a[i],this.d);
	}
	
	a.splice(omit+3,1);
	a.splice(omit,1);

	omit = randomFromRange('0:2',this.prng());
	var labels = ["C","B","A"];
	labels.splice(omit,1);
	if (this.prng() > .5) {
	    labels.sort();
	}
	labels.push(labels[0].toLowerCase());
	labels.push(labels[1].toLowerCase());

	var ans;
	if (find == 0) {
	    // A = sin^{-1}(a * sin(B)/b)
	    ans = Math.asin( a[2] * Math.sin(a[1] * Math.PI/180 )/a[3] ) * 180/Math.PI;
	} else if (find == 1) {
	    ans = Math.asin( a[3] * Math.sin(a[0] * Math.PI/180 )/a[2] ) * 180/Math.PI;
	} else if (find == 2) {
	    // a = b * sin(A)/sin(B)
	    ans = a[3] * Math.sin(a[0] * Math.PI/180)/Math.sin(a[1] * Math.PI/180);
	} else {
	    ans = a[2] * Math.sin(a[1] * Math.PI/180)/Math.sin(a[0] * Math.PI/180);
	}

	//	ans = Math.floor(ans * p + .5)/p;
	ans = Math.roundsf(ans,this.d);

	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['Find ','\\(',labels[find], '\\), ', 'where '];
	atex = [];

	qdiv.append(
	    $('<span>').append('Find ')
	).append(
	    tomml(labels[find])
	).append(
	    $('<span>').append(', where ')
	);
	
	var qmml,amml;

	var seps = [', ', ', ', '.'];
	var sep;
	
	for (var i = 0; i < 4; i++) {
	    if (i != find) {
		sep = seps.shift();
		qmml = mmlelt('math').attr('display','inline');
		qmml.append(tommlelt(labels[i]))
		    .append(tommlelt("="));
		if (i < 2) {
		    qmml.append(
			mmlelt('msup').append(
			    tommlelt(a[i])
			).append(
			    tommlelt('&#xb0;')
			)
		    )
		} else {
		    qmml.append(tommlelt(a[i]));
		}
		

		qdiv.append(qmml)
		    .append($('<span>').append(sep).addClass('separator'));

		qtex.push('\\(');
		qtex.push(labels[i]);
		qtex.push("=");
		if (i < 2)
		    qtex.push("\\ang{");
		qtex.push(a[i]);
		if (i < 2)
		    qtex.push("}");
		qtex.push('\\)');
		qtex.push(sep);

	    } else {
		amml = mmlelt('math').attr('display','inline');
		amml.append(tommlelt(labels[i]))
		    .append(tommlelt("="))
		if (i < 2) {
		    	amml.append(
			    mmlelt('msup').append(
				tommlelt(ans)
			    ).append(
				tommlelt('&#xb0;')
			    )
			)
		} else {
		    amml.append(tommlelt(ans));
		}
		adiv.append(amml);

		atex.push('\\(');
		atex.push(labels[i]);
		atex.push("=");
		if (i < 2)
		    atex.push("\\ang{");
		atex.push(ans);
		if (i < 2)
		    atex.push("}");
		atex.push('\\)');

		if (i < 2 && ans > a[1 - i]) {

		    adiv.append($('<span>').append(' or '));
		    
		    amml = mmlelt('math').attr('display','inline');
		    amml.append(tommlelt(labels[i]))
			.append(tommlelt("="))
			.append(
			    mmlelt('msup').append(
				tommlelt(180 - ans)
			    ).append(
				tommlelt('&#xb0;')
			    )
			);
		    adiv.append(amml);

		    atex.push(' or ');
		    atex.push('\\(');
		    atex.push(labels[i]);
		    atex.push("=");
		    atex.push("\\ang{");
		    atex.push(180 - ans);
		    atex.push("}");
		    atex.push('\\)');
		}
	    }
	}
	
	

	this.qn++;
	return [qdiv, adiv, qtex.join(''), atex.join('')];
    }

    return this;
}

function CosineRule() {
    var self = this;
    this.title = "Using the Cosine Rule";
    this.storage = "CosineR";
    this.qn = 0;
    this.triangles = {"": true};

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
	    text: "Accuracy of numbers",
	    shortcut: "d",
	    type: "string",
	    default: "3"
	},
	{
	    name: "m",
	    text: "Multiplier for side length",
	    shortcut: "m",
	    type: "range",
	    default: "3:10"
	},
	{
	    name: "obtuse",
	    text: "Allow obtuse angles",
	    shortcut: "b",
	    type: "boolean",
	    default: false
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
	this.explanation = 'Find the stated angle or length in each of the following triangles.';
	this.shortexp = 'Let ' + tomml('ABC')[0].outerHTML + ' be a triangle. ';
    }

    this.reset = function() {
	this.qn = 0;
	this.triangles = {"": true};
    }

    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = [];
	var qdiv,adiv,qtex,atex;
	var nqn = 0;

	var A,B,C,p,r,s,m,omit,find;
	p = Math.pow(10,this.d);
	r = '1:' + (p-1);

	while (this.triangles[a.join(':')]) {

	    A = 0;
	    B = 0;

	    while (A == B) {
		A = randomFromRange(r,this.prng());
		B = randomFromRange(r,this.prng());
	    }

	    a = [A,B];
	    a.sort(function(a, b) {return a - b;});

	    a[2] = p - a[1];
	    a[1] -= a[0];

	    a.sort(function(a, b) {return a - b;});

	    if (!this.obtuse && a[2] > p/2) {
		a = [];
		continue;
	    }

	    a.push(randomFromRange(r,this.prng()));

	    nqn++;
	    if (nqn > 10) {
		this.triangles = {"": true};
		nqn = 0;
		break;
	    }
	}

	this.triangles[a.join(':')] = true;
	
	m = randomFromRange(this.m,this.prng());
	
	a[0] *= 180/p;
	a[1] *= 180/p;
	a[2] *= 180/p;

	a.push(a[3] * Math.sin(a[1]*Math.PI/180)/Math.sin(a[0]*Math.PI/180));
	a.push(a[3] * Math.sin(a[2]*Math.PI/180)/Math.sin(a[0]*Math.PI/180));

	a[3] *= m/p;
	a[4] *= m/p;
	a[5] *= m/p;

	for (var i = 0; i < 6; i++) {
	    a[i] = Math.roundsf(a[i],this.d);
	}
	
	find = randomFromRange('0:5',this.prng());
	
	var labels = ["A","B","C","a","b","c"];

	var ans;
	var qninf;

	if (find < 3) {
	    // A = cos^{-1}( (b^2 + c^2 - a^2)/(2 b c))
	    var b,c;
	    b = (find + 1)%3 + 3;
	    c = (find + 2)%3 + 3;
	    ans = Math.acos( (a[b] * a[b] + a[c] * a[c] - a[find+3] * a[find+3]) / (2 * a[b] * a[c])) * 180/Math.PI;
	    qninf = [3,4,5];
	} else {
	    var b,c;
	    b = (find + 1)%3 + 3;
	    c = (find + 2)%3 + 3;
	    ans = a[b] * a[b] + a[c] * a[c] - 2 * a[b] * a[c] * Math.cos( a[find-3] * Math.PI/180);
	    qninf = [find-3,b,c];
	    qninf.sort(function(a, b) {return a - b;});
	}

	ans = Math.roundsf(ans,this.d);

	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['Find ','\\(',labels[find], '\\), ', 'where '];
	atex = [];

	qdiv.append(
	    $('<span>').append('Find ')
	).append(
	    tomml(labels[find])
	).append(
	    $('<span>').append(', where ')
	);
	
	var qmml,amml;

	var seps = [', ', ', ', '.'];
	var sep;

	
	for (var i = 0; i < qninf.length; i++) {
	    sep = seps.shift();
	    qmml = mmlelt('math').attr('display','inline');
	    qmml.append(tommlelt(labels[qninf[i]]))
		.append(tommlelt("="));
	    if (qninf[i] < 2) {
		qmml.append(
		    mmlelt('msup').append(
			tommlelt(a[qninf[i]])
		    ).append(
			tommlelt('&#xb0;')
		    )
		)
	    } else {
		qmml.append(tommlelt(a[qninf[i]]));
	    }
		

	    qdiv.append(qmml)
		.append($('<span>').append(sep).addClass('separator'));
	    
	    qtex.push('\\(');
	    qtex.push(labels[qninf[i]]);
	    qtex.push("=");
	    if (qninf[i] < 2)
		qtex.push("\\ang{");
	    qtex.push(a[qninf[i]]);
	    if (qninf[i] < 2)
		qtex.push("}");
	    qtex.push('\\)');
	    qtex.push(sep);

	}

	amml = mmlelt('math').attr('display','inline');
	amml.append(tommlelt(labels[find]))
	    .append(tommlelt("="))
	if (find < 2) {
	    amml.append(
		mmlelt('msup').append(
		    tommlelt(ans)
		).append(
		    tommlelt('&#xb0;')
		)
	    )
	} else {
	    amml.append(tommlelt(ans));
	}
	adiv.append(amml);

	atex.push('\\(');
	atex.push(labels[i]);
	atex.push("=");
	if (find < 2)
	    atex.push("\\ang{");
	atex.push(ans);
	if (find < 2)
	    atex.push("}");
	atex.push('\\)');
	
	this.qn++;
	return [qdiv, adiv, qtex.join(''), atex.join('')];
    }

    return this;
}

/*
Question Type: Solve an Equation
*/

// One-sided equations

function OneEqSolve() {
    var self = this;
    this.title = "One-sided Equations";
    this.storage = "OneEqSolve";
    this.qn = 0;
    this.eqns = {"0:0:0": true};

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
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi></math>",
	    shortcut: "a",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "b",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi></math>",
	    shortcut: "b",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "x",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi></math>",
	    shortcut: "x",
	    type: "string",
	    default: "-5:5"
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
	this.explanation = 'Solve each equation';
	this.shortexp = 'Solve ';
    }

    this.reset = function() {
	this.qn = 0;
	this.eqns = {"0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var a = 0, b = 0, x = 0;
	 var qdiv,adiv,p,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while ( a == 0 || this.eqns[ a + ":" + b + ":" + x ]) {
	     a = randomFromRange(this.a,this.prng());
	     b = randomFromRange(this.b,this.prng());
	     x = randomFromRange(this.x,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.eqns = {"0:0:0": true};
		 nqn = 0;
	     }
	}
	this.eqns[ a + ":" + b + ":" + x ] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];

	 var qmml = mmlelt('math').attr('display','inline');

	 addCoefficient(a, qtex, qmml);
	 qmml.append(tommlelt('x'));
	 qtex.push('x');
	 addSignedNumber(b, qtex, qmml);
	 
	 qmml.append(tommlelt('='));
	 qtex.push('=');
	 
	 qmml.append(tommlelt(a*x+b));
	 qtex.push(a*x+b);
	 
	 qdiv.append(qmml);
	 qtex.push('\\)');
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex.push('\\(');

	 amml.append(tommlelt('x'));
	 atex.push('x');
	 
	 amml.append(tommlelt('='));
	 atex.push('=');
	 
	 amml.append(tommlelt(x));
	 atex.push(x);
	 
	 adiv.append(amml);
	 atex.push('\\)');
	
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
   
    
    return this;
}

// Two-sided equations

function TwoEqSolve() {
    var self = this;
    this.title = "Two-sided Equations";
    this.storage = "TwoEqSolve";
    this.qn = 0;
    this.eqns = {"0:0:0:0": true};

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
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi></math>",
	    shortcut: "a",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "c",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi></math>",
	    shortcut: "c",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "b",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi><mo>+</mo><mi>d</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo>=</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi></math>",
	    shortcut: "b",
	    type: "string",
	    default: "1"
	},
	{
	    name: "x",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math>",
	    shortcut: "x",
	    type: "string",
	    default: "-5:5"
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
	this.explanation = 'Solve each equation';
	this.shortexp = 'Solve ';
    }

    this.reset = function() {
	this.qn = 0;
	this.eqns = {"0:0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var a = 0, b = 0, c = 0, d = 0, x = 0;
	 var qdiv,adiv,p,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while ( a*c == 0 || a == c || this.eqns[ a + ":" + c + ":" + b + ":" + x ]) {
	     a = randomFromRange(this.a,this.prng());
	     c = randomFromRange(this.c,this.prng());
	     b = randomFromRange(this.b,this.prng());
	     x = randomFromRange(this.x,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.eqns = {"0:0:0:0": true};
		 nqn = 0;
	     }
	}
	this.eqns[ a + ":" + c + ":" + b + ":" + x ] = true;
	
	d = a*x - c*x + b;
	d = math.sign(d)*math.floor(math.abs(d)/2);
	b = c*x + d - a*x;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];

	 var qmml = mmlelt('math').attr('display','inline');

	 addCoefficient(a, qtex, qmml);
	 qmml.append(tommlelt('x'));
	 qtex.push('x');
	 addSignedNumber(b, qtex, qmml);
	 
	 qmml.append(tommlelt('='));
	 qtex.push('=');
	 
	 addCoefficient(c, qtex, qmml);
	 qmml.append(tommlelt('x'));
	 qtex.push('x');
	 addSignedNumber(d, qtex, qmml);
	 
	 qdiv.append(qmml);
	 qtex.push('\\)');
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex.push('\\(');

	 amml.append(tommlelt('x'));
	 atex.push('x');
	 
	 amml.append(tommlelt('='));
	 atex.push('=');
	 
	 amml.append(tommlelt(x));
	 atex.push(x);
	 
	 adiv.append(amml);
	 atex.push('\\)');
	
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
   
    
    return this;
}

// Simultaneous equations

function SimEqSolve () {
    var self = this;
    this.title = "Simultaneous Equations";
    this.storage = "SimEqSolve";
    this.qn = 0;
    this.eqns = {"0:0:0:0:0:0": true};

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
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mi>y</mi><mo>=</mo><mi>c</mi></math>",
	    shortcut: "a",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "b",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mi>y</mi><mo>=</mo><mi>c</mi></math>",
	    shortcut: "b",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "x",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> and <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mi>y</mi><mo>=</mo><mi>c</mi></math>",
	    shortcut: "x",
	    type: "string",
	    default: "-5:5"
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
	this.explanation = 'Solve each pair of equations';
	this.shortexp = 'Solve ';
    }

    this.reset = function() {
	this.qn = 0;
	this.eqns = {"0:0:0:0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var a = 0, b = 0, c = 0, d = 0, x = 0, y = 0;
	 var e, f;
	 var qdiv,adiv,p,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while ( a*b*c*d == 0 || a*d - b*c == 0 || this.eqns[ a + ":" + b + ":" + c + ":" + d + ":" + x + ":" + y ]) {
	     a = randomFromRange(this.a,this.prng());
	     b = randomFromRange(this.b,this.prng());
	     c = randomFromRange(this.a,this.prng());
	     d = randomFromRange(this.b,this.prng());
	     x = randomFromRange(this.x,this.prng());
	     y = randomFromRange(this.x,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.eqns = {"0:0:0:0:0:0": true};
		 nqn = 0;
	     }
	}
	this.eqns[ a + ":" + b + ":" + c + ":" + d + ":" + x + ":" + y ] = true;

	 e = a * x + b * y;
	 f = c * x + d * y;
	
	 qdiv = $('<div>').addClass('question');
	 adiv = $('<div>').addClass('answer');
	 qtex = ['\\begin{align*}'];
	 atex = [];

	 var qmml = mmlelt('math').attr('display','inline');
	 var mtable = mmlelt('mtable').attr('displaystyle','true')
		 .attr('columnalign','right left right left right left')
		 .attr('columnspacing','verythinmathspace')
	 qmml.append(mtable);

	 var mtd, mrow;

	 mrow = mmlelt('mtr');
	 mtable.append(mrow);
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);

	 addCoefficient(a, qtex, mtd);
	 mtd.append(tommlelt('x'));
	 qtex.push('x');
	 
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 qtex.push('&');
	 addSignofCoefficient(b, qtex, mtd);

	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 qtex.push('&');
	 addUnsignedCoefficient(b, qtex, mtd);
	 mtd.append(tommlelt('y'));
	 qtex.push('y');
	 
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 mtd.append(tommlelt('='));
	 mtd.append(tommlelt(e));
	 qtex.push('&=');
	 qtex.push(texnum(e));
	 qtex.push('\\\\');

	 mrow = mmlelt('mtr');
	 mtable.append(mrow);
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);

	 addCoefficient(c, qtex, mtd);
	 mtd.append(tommlelt('x'));
	 qtex.push('x');
	 
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 qtex.push('&');
	 addSignofCoefficient(d, qtex, mtd);

	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 qtex.push('&');
	 addUnsignedCoefficient(d, qtex, mtd);
	 mtd.append(tommlelt('y'));
	 qtex.push('y');
	 
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 mtd.append(tommlelt('='));
	 mtd.append(tommlelt(f));
	 qtex.push('&=');
	 qtex.push(texnum(f));
	 
	 qdiv.append(qmml);
	 qtex.push('\\end{align*}');
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex.push('\\(');

	 amml.append(tommlelt('x'));
	 atex.push('x');
	 
	 amml.append(tommlelt('='));
	 atex.push('=');
	 
	 amml.append(tommlelt(x));
	 atex.push(x);
	 
	 adiv.append(amml);
	 adiv.append($('<span>').addClass("separator").html(','));
	 atex.push('\\), ');

	 amml = mmlelt('math').attr('display','inline');
	 atex.push('\\(');

	 amml.append(tommlelt('y'));
	 atex.push('y');
	 
	 amml.append(tommlelt('='));
	 atex.push('=');
	 
	 amml.append(tommlelt(y));
	 atex.push(y);
	 
	 adiv.append(amml);
	 atex.push('\\)');
	
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
   
    
    return this;
}

// Straight line graphs

function DrawSLGraph() {
    var self = this;
    this.title = "Straight Line Graphs";
    this.storage = "DrawSLGraph";
    this.qn = 0;
    this.graphs = {"0:0": true};

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
	    name: "m",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "m",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "c",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "c",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "minx",
	    text: "Range for lower end of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> axis",
	    shortcut: "mx",
	    type: "string",
	    default: "-5"
	},
	{
	    name: "lenx",
	    text: "Range for width of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> axis",
	    shortcut: "lx",
	    type: "string",
	    default: "10"
	},
	{
	    name: "miny",
	    text: "Range for lower end of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> axis",
	    shortcut: "my",
	    type: "string",
	    default: "-5"
	},
	{
	    name: "leny",
	    text: "Range for width of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> axis",
	    shortcut: "ly",
	    type: "string",
	    default: "10"
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
	this.explanation = 'Draw each graph with the given range on the <math xmlns=\'http://www.w3.org/1998/Math/MathML\' display=\'inline\'><mi>x</mi></math>-axis';
	this.shortexp = 'Draw ';
    }

    this.reset = function() {
	this.qn = 0;
	this.graphs = {"0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var m = 0, c = 0, minx, miny, maxx, maxy, lenx, leny;
	 var qdiv,adiv,p,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while ( m == 0 || this.graphs[ m + ":" + c ]) {
	     m = randomFromRange(this.m,this.prng());
	     c = randomFromRange(this.c,this.prng());
	     minx = randomFromRange(this.minx,this.prng());
	     lenx = randomFromRange(this.lenx,this.prng());
	     miny = randomFromRange(this.miny,this.prng());
	     leny = randomFromRange(this.leny,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.graphs = {"0:0": true};
		 nqn = 0;
	     }
	}
	this.graphs[ m + ":" + c ] = true;
	 // axis limits
	 maxx = minx + lenx;
	 maxy = miny + leny;	
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];

	 var qmml = mmlelt('math').attr('display','inline');

	 qmml.append(tommlelt('y'));
	 qtex.push('y');
	 qmml.append(tommlelt('='));
	 qtex.push('=');

	 addCoefficient(m, qtex, qmml);
	 qmml.append(tommlelt('x'));
	 qtex.push('x');
	 addSignedNumber(c, qtex, qmml);
	 	 
	 qdiv.append(qmml);
	 qdiv.append($('<span>').append(' with '));
	 qmml = mmlelt('math').attr('display', 'inline');
	 qmml.append(tommlelt(minx));
	 qmml.append(tommlelt('&le;'));
	 qmml.append(tommlelt('x'));
	 qmml.append(tommlelt('&le;'));
	 qmml.append(tommlelt(maxx));
	 qdiv.append(qmml);
	 qdiv.append($('<span>').append(', '));
	 qmml = mmlelt('math').attr('display', 'inline');
	 qmml.append(tommlelt(miny));
	 qmml.append(tommlelt('&le;'));
	 qmml.append(tommlelt('y'));
	 qmml.append(tommlelt('&le;'));
	 qmml.append(tommlelt(maxy));
	 qdiv.append(qmml);
	 
	 qtex.push('\\)');
	 qtex.push(' with ');
	 qtex.push('\\(');
	 qtex.push(minx);
	 qtex.push(' \\le x \\le ');
	 qtex.push(maxx);
	 qtex.push('\\)');
	 qtex.push(', ');
	 qtex.push('\\(');
	 qtex.push(miny);
	 qtex.push(' \\le y \\le ');
	 qtex.push(maxy);
	 qtex.push('\\)');

	 
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex.push('\\begin{tikzpicture}[baseline=0pt]');
	 atex.push('\\draw[help lines] (' + minx + ',' + miny + ') grid (' + maxx + ',' + maxy + ');');
	 atex.push('\\draw[->,axis/.try] (' + (minx - .5) + ',0) -- (' + (maxx + .5) + ',0);');
	 atex.push('\\draw[->,axis/.try] (0,' + (miny - .5) + ') -- (0,' + (maxy + .5) + ');');
	 atex.push('\\foreach \\k in {' + minx + ',...,' + maxx + '} { \\draw (\\k,0) -- ++(0,-.2) node[below] {\\(\\k\\)};}');
	 atex.push('\\foreach \\k in {' + miny + ',...,' + maxy + '} { \\draw (0,\\k) -- ++(-.2,0) node[anchor=base east] {\\(\\k\\)};}');
	 atex.push('\\clip (' + minx + ',' + miny + ') rectangle (' + maxx + ',' + maxy + ');');
 	 atex.push('\\draw[graph line/.try] (' + minx + ',' + (m*minx + c) + ') -- (' + maxx + ',' + (m*maxx + c) + ');');
	 atex.push('\\end{tikzpicture}');

	 var w = $('#qns').width()/2 - 100;
	 
	 var graph =  createAxesSvg (
	     w, //width,
	     w, //height,
	     10, //border,
	     minx,
	     maxx,
	     1, //xmark,
	     1, //xlabel,
	     "_x_", //xaxlabel,
	     miny,
	     maxy,
	     1, //ymark,
	     1, //ylabel,
	     "_y_", //yaxlabel,
	     true, //aspect,
	     16, //fontsize,
	     1, //linewidth,
	     true, //gridbl,
	     1, //markwidth,
	     1, //marklength
	 );

	 var ax, ay, bx, by;
	 
	 if (m * minx + c < miny) {
	     ax = (miny - c) / m;
	     ay = miny;
	 } else if (m * minx + c > maxy) {
	     ax = (maxy - c) / m;
	     ay = maxy
	 } else {
	     ax = minx;
	     ay = m * minx + c;
	 }

	 if (m * maxx + c > maxy) {
	     bx = (maxy - c)/m;
	     by = maxy;
	 } else if (m * maxx + c < miny) {
	     bx = (minx - c)/m;
	     by = miny;
	 } else {
	     bx = maxx;
	     by = m * maxx + c;
	 }
	 
	 var sline = document.createElementNS("http://www.w3.org/2000/svg",'path');
	 sline.setAttribute('d','M ' + graph.transformX(ax) + ' ' + graph.transformY(ay) + ' L ' + graph.transformX(bx) + ' ' + graph.transformY(by));
	 sline.setAttribute('stroke','black');
	 sline.setAttribute('stroke-width',1);
	 graph.svg.appendChild(sline);

	 
	 adiv.append(graph.svg);


	 
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
   
    
    return this;
}


function EquationSLGraph() {
    var self = this;
    this.title = "Straight Line Graphs";
    this.storage = "EquationSLGraph";
    this.qn = 0;
    this.graphs = {"0:0": true};

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
	    name: "m",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "m",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "c",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "c",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "minx",
	    text: "Range for lower end of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> axis",
	    shortcut: "mx",
	    type: "string",
	    default: "-5"
	},
	{
	    name: "lenx",
	    text: "Range for width of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> axis",
	    shortcut: "lx",
	    type: "string",
	    default: "10"
	},
	{
	    name: "miny",
	    text: "Range for lower end of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> axis",
	    shortcut: "my",
	    type: "string",
	    default: "-5"
	},
	{
	    name: "leny",
	    text: "Range for width of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> axis",
	    shortcut: "ly",
	    type: "string",
	    default: "10"
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
	this.explanation = 'Find the equation of each graph';
	this.shortexp = 'Find the equation of ';
    }

    this.reset = function() {
	this.qn = 0;
	this.graphs = {"0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var m = 0, c = 0, minx, miny, maxx, maxy, lenx, leny;
	 var qdiv,adiv,p,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while ( m == 0 || this.graphs[ m + ":" + c ]) {
	     m = randomFromRange(this.m,this.prng());
	     c = randomFromRange(this.c,this.prng());
	     minx = randomFromRange(this.minx,this.prng());
	     lenx = randomFromRange(this.lenx,this.prng());
	     miny = randomFromRange(this.miny,this.prng());
	     leny = randomFromRange(this.leny,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.graphs = {"0:0": true};
		 nqn = 0;
	     }
	}
	this.graphs[ m + ":" + c ] = true;
	 // axis limits
	 maxx = minx + lenx;
	 maxy = miny + leny;	
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];

	 var qmml = mmlelt('math').attr('display','inline');

	 qmml.append(tommlelt('y'));
	 qtex.push('y');
	 qmml.append(tommlelt('='));
	 qtex.push('=');

	 addCoefficient(m, qtex, qmml);
	 qmml.append(tommlelt('x'));
	 qtex.push('x');
	 addSignedNumber(c, qtex, qmml);
	 	 
	 qdiv.append(qmml);
	 
	 qtex.push('\\)');
	 
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex.push('\\begin{tikzpicture}[baseline=0pt]');
	 atex.push('\\draw[help lines] (' + minx + ',' + miny + ') grid (' + maxx + ',' + maxy + ');');
	 atex.push('\\draw[->,axis/.try] (' + (minx - .5) + ',0) -- (' + (maxx + .5) + ',0);');
	 atex.push('\\draw[->,axis/.try] (0,' + (miny - .5) + ') -- (0,' + (maxy + .5) + ');');
	 atex.push('\\foreach \\k in {' + minx + ',...,' + maxx + '} { \\draw (\\k,0) -- ++(0,-.2) node[below] {\\(\\k\\)};}');
	 atex.push('\\foreach \\k in {' + miny + ',...,' + maxy + '} { \\draw (0,\\k) -- ++(-.2,0) node[anchor=base east] {\\(\\k\\)};}');
	 atex.push('\\clip (' + minx + ',' + miny + ') rectangle (' + maxx + ',' + maxy + ');');
 	 atex.push('\\draw[graph line/.try] (' + minx + ',' + (m*minx + c) + ') -- (' + maxx + ',' + (m*maxx + c) + ');');
	 atex.push('\\end{tikzpicture}');

	 var w = $('#qns').width()/2 - 100;
	 
	 var graph =  createAxesSvg (
	     w, //width,
	     w, //height,
	     10, //border,
	     minx,
	     maxx,
	     1, //xmark,
	     1, //xlabel,
	     "_x_", //xaxlabel,
	     miny,
	     maxy,
	     1, //ymark,
	     1, //ylabel,
	     "_y_", //yaxlabel,
	     true, //aspect,
	     16, //fontsize,
	     1, //linewidth,
	     true, //gridbl,
	     1, //markwidth,
	     1, //marklength
	 );

	 var ax, ay, bx, by;
	 
	 if (m * minx + c < miny) {
	     ax = (miny - c) / m;
	     ay = miny;
	 } else if (m * minx + c > maxy) {
	     ax = (maxy - c) / m;
	     ay = maxy
	 } else {
	     ax = minx;
	     ay = m * minx + c;
	 }

	 if (m * maxx + c > maxy) {
	     bx = (maxy - c)/m;
	     by = maxy;
	 } else if (m * maxx + c < miny) {
	     bx = (minx - c)/m;
	     by = miny;
	 } else {
	     bx = maxx;
	     by = m * maxx + c;
	 }
	 
	 var sline = document.createElementNS("http://www.w3.org/2000/svg",'path');
	 sline.setAttribute('d','M ' + graph.transformX(ax) + ' ' + graph.transformY(ay) + ' L ' + graph.transformX(bx) + ' ' + graph.transformY(by));
	 sline.setAttribute('stroke','black');
	 sline.setAttribute('stroke-width',1);
	 graph.svg.appendChild(sline);

	 
	 adiv.append(graph.svg);


	 
	this.qn++;
	 return [adiv, qdiv, atex.join(''), qtex.join('')];
    }
   
    
    return this;
}

