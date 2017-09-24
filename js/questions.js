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
	
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0:Add ": true};
    }
    
    this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

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
	
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0:Add ": true};
    }
    
    this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

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
	
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0:0": true};
    }
    
    this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

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
    
    this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

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
    
    this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

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
	
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0": true};
    }
    
    this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

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
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0:0": true};
    }

     this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

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
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0:0": true};
    }

     this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

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
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0": true};
    }

     this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

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
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0": true};
    }

     this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

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
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0": true};
    }

     this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

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
