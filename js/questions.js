
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
	    text: "Maximum first term",
	    shortcut: "a",
	    type: "integer",
	    default: 10
	},
	{
	    name: "d",
	    text: "Maximum term-to-term",
	    shortcut: "d",
	    type: "integer",
	    default: 10
	},
	{
	    name: "linear",
	    text: "Only linear sequences",
	    shortcut: "l",
	    type: "boolean",
	    default: true
	},
	{
	    name: "negative",
	    text: "Allow negatives",
	    shortcut: "g",
	    type: "boolean",
	    default: false
	},
	{
	    name: "repeat",
	    text: "Repeat Questions",
	    shortcut: "r",
	    type: "integer",
	    default: 1
	}
    ];

    var optdict = {};
    for (var i = 0; i < this.options.length; i++) {
	optdict[this.options[i].name] = i;
    }

    this.setOptions = function() {
	for (var i = 0; i < this.options.length; i++) {
	    if (this.options[i].type == "integer") {
		this.options[i].value = parseInt(this.options[i].element.val());
	    } else if (this.options[i].type == "boolean") {
		this.options[i].value = this.options[i].element.is(':checked');
	    } else {
		this.options[i].value = this.options[i].element.val();
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
	
	if (this.negative) {
	    this.mkint = function(a) {
		var n = Math.floor(2*a*self.prng() - a);
		if (n >= 0) n++;
		return n;
	    }
	} else {
	    this.mkint = function(a) {
		var n = Math.floor(a*self.prng() + 1);
		return n;
	    }
	}
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0:Add ": true};
    }
    
    this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

	var a = 0,d = 0,op = mkop(true);
	var qdiv,adiv,p,sep,tex;

	while (this.seqs[ a + ":" + d + ":" + op.type]) {
	    a = this.mkint(this.a);
	    d = this.mkint(this.d);
	    op = mkop(this.linear);
	}
	this.seqs[ a + ":" + d + ":" + op.type] = true;
	
	qdiv = $('<div>').addClass('question');

	qdiv.append(tomml(a));
	qdiv.append($('<span>').addClass("separator").html(", "));
	qdiv.append($('<span>').addClass("linebreak").html(""));
	p = a;
	    
	for (var j = 1; j < this.length; j++) {
	    qdiv.append(tomml(op.op(p,d)));
	    p = op.op(p,d);
	    qdiv.append($('<span>').addClass("separator").html(", "));
	    qdiv.append($('<span>').addClass("linebreak").html(""));
	}
	qdiv.append($('<span>').addClass("dots").html("..."));

	tex = '';
	adiv = $('<div>').addClass('answer');
	sep = ",";
	if (op.type == "Add ") {
	    if (d > 0) {
		tex = 'Add ' + totex(d);
		adiv.append( $('<span>').html("Add " + d + ":").addClass('rule'));
	    } else {
		tex = 'Subtract ' + totex(-d);
		adiv.append( $('<span>').html("Subtract " + (-d) + ":").addClass('rule'));
	    }
	} else {
	    tex = op.type + totex(d);
	    adiv.append( $('<span>').html(op.type + d + ":").addClass('rule'));
	}
	adiv.append($('<span>').addClass("linebreak").html("&nbsp;"));
	tex += '. ';
	for (var j = 0; j < this.terms; j++) {
	    adiv.append(tomml(op.op(p,d)));
	    p = op.op(p,d);
	    tex += totex(p);
	    
	    if (j == this.terms - 1) sep = ".";
	    adiv.append($('<span>').addClass("separator").html(sep));
	    adiv.append($('<span>').addClass("linebreak").html("&nbsp;"));
	    tex += sep + ' ';
	}
	
	this.qn++;
	return [qdiv, adiv, tex];
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
	    text: "Maximum first term",
	    shortcut: "a",
	    type: "integer",
	    default: 10
	},
	{
	    name: "d",
	    text: "Maximum term-to-term",
	    shortcut: "d",
	    type: "integer",
	    default: 10
	},
	{
	    name: "linear",
	    text: "Only linear sequences",
	    shortcut: "l",
	    type: "boolean",
	    default: true
	},
	{
	    name: "negative",
	    text: "Allow negatives",
	    shortcut: "g",
	    type: "boolean",
	    default: false
	},
	{
	    name: "repeat",
	    text: "Repeat Questions",
	    shortcut: "r",
	    type: "integer",
	    default: 1
	}
    ];

    var optdict = {};
    for (var i = 0; i < this.options.length; i++) {
	optdict[this.options[i].name] = i;
    }

    this.setOptions = function() {
	for (var i = 0; i < this.options.length; i++) {
	    if (this.options[i].type == "integer") {
		this.options[i].value = parseInt(this.options[i].element.val());
	    } else if (this.options[i].type == "boolean") {
		this.options[i].value = this.options[i].element.is(':checked');
	    } else {
		this.options[i].value = this.options[i].element.val();
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
	
	if (this.negative) {
	    this.mkint = function(a) {
		var n = Math.floor(2*a*self.prng() - a);
		if (n >= 0) n++;
		return n;
	    }
	} else {
	    this.mkint = function(a) {
		var n = Math.floor(a*self.prng() + 1);
		return n;
	    }
	}
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0:Add ": true};
    }
    
    this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

	var a = 0,d = 0,op = mkop(true);
	var qdiv,adiv,p,sep,tex;

	while (this.seqs[ a + ":" + d + ":" + op.type]) {
	    a = this.mkint(this.a);
	    d = this.mkint(this.d);
	    op = mkop(this.linear);
	}
	this.seqs[ a + ":" + d + ":" + op.type] = true;
	
	qdiv = $('<div>').addClass('question');

	qdiv.append( $('<span>').append("First term: ").append(tomml(a)).append(", "));
	if (op.type == "Add ") {
	    if (d > 0) {
		qdiv.append( $('<span>').append("rule: Add ").append(tomml(d)).append("."));
	    } else {
		qdiv.append( $('<span>').append("rule: Subtract ").append(tomml(-d)).append("."));
	    }
	} else {
	    qdiv.append( $('<span>').append("rule: " + op.type).append(tomml(d)).append("."));
	}
	
	adiv = $('<div>').addClass('answer');
	adiv.append(tomml(a));
	p = a;
	tex = totex(a);

	for (var j = 1; j < this.terms; j++) {
	    adiv.append($('<span>').addClass("separator").html(", "));
	    adiv.append($('<span>').addClass("linebreak").html(""));
	    p = op.op(p,d);
	    adiv.append(tomml(p));
	    tex += ', ' + totex(p);
	}
	adiv.append($('<span>').addClass("dots").html("."));
	tex += '.';

	this.qn++;
	return [qdiv, adiv, tex];
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
	    text: "Maximum quadratic term",
	    shortcut: "a",
	    type: "integer",
	    default: 2
	},
	{
	    name: "b",
	    text: "Maximum linear term",
	    shortcut: "b",
	    type: "integer",
	    default: 6
	},
	{
	    name: "c",
	    text: "Maximum constant term",
	    shortcut: "c",
	    type: "integer",
	    default: 10
	},
	{
	    name: "negative",
	    text: "Allow negatives",
	    shortcut: "g",
	    type: "boolean",
	    default: false
	},
	{
	    name: "repeat",
	    text: "Repeat Questions",
	    shortcut: "r",
	    type: "integer",
	    default: 1
	}
    ];

    var optdict = {};
    for (var i = 0; i < this.options.length; i++) {
	optdict[this.options[i].name] = i;
    }

    this.setOptions = function() {
	for (var i = 0; i < this.options.length; i++) {
	    if (this.options[i].type == "integer") {
		this.options[i].value = parseInt(this.options[i].element.val());
	    } else if (this.options[i].type == "boolean") {
		this.options[i].value = this.options[i].element.is(':checked');
	    } else {
		this.options[i].value = this.options[i].element.val();
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
	
	if (this.negative) {
	    this.mkint = function(a) {
		var n = Math.floor(2*a*self.prng() - a);
		return n;
	    }
	} else {
	    this.mkint = function(a) {
		var n = Math.floor(a*self.prng() + 1);
		return n;
	    }
	}
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0:0": true};
    }
    
    this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

	var a = 0,b = 0,c = 0;
	var qdiv,adiv,p,sep,tex;

	while (this.seqs[ a + ":" + b + ":" + c ]) {
	    a = this.mkint(this.a);
	    b = this.mkint(this.b);
	    c = this.mkint(this.c);
	}
	this.seqs[ a + ":" + b + ":" + c ] = true;
	
	qdiv = $('<div>').addClass('question');

	var quad = mmlelt('math').attr('display','inline');
	if (a != 0) {
	    if (a != 1) {
		if (a == -1) {
		    quad.append(tommlelt('-').attr('lspace',"verythinmathspace").attr('rspace',"0em"));
		} else {
		    quad.append(tommlelt(a));
		}
	    }
	    quad.append(
		mmlelt('msup').append(
		    tommlelt('n')
		).append(
		    tommlelt('2')
		)
	    );
	}
	if (b != 0) {
	    if (a != 0) {
		if (b > 0) {
		    quad.append(tommlelt('+'));
		} else {
		    quad.append(tommlelt('-'));
		}
	    } else if (b < 0) {
		quad.append(tommlelt('-').attr('lspace',"verythinmathspace").attr('rspace',"0em"));
	    }
	    if (b != 1 && b != -1) {
		quad.append(tommlelt(math.abs(b)));
	    }
	    quad.append(tommlelt('n'));
	}
	if (c != 0) {
	    if (a != 0 || b != 0) {
		if (c > 0) {
		    quad.append(tommlelt('+'));
		} else {
		    quad.append(tommlelt('-'));
		}		    
	    } else if (c < 0) {
		quad.append(tommlelt('-').attr('lspace',"verythinmathspace").attr('rspace',"0em"));
	    }
	    quad.append(tommlelt(math.abs(c)));
	}
	
	qdiv.append( $('<span>').append(tomml('n')).append("th term is: ").append(quad) );
	
	adiv = $('<div>').addClass('answer');
	tex = '';

	for (var j = 0; j < this.terms; j++) {
	    p = math.eval('a*(n+1)^2 + b*(n+1) + c',{a: a, b: b, c: c, n: j});
	    adiv.append(tomml(p));
	    tex += totex(p);
	    if (j != this.terms - 1) {
		adiv.append($('<span>').addClass("separator").html(", "));
		adiv.append($('<span>').addClass("linebreak").html(""));
		tex += ', ';
	    }
	}
	adiv.append($('<span>').addClass("dots").html("."));
	tex += '.';

	this.qn++;
	return [qdiv, adiv, tex];
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
	    text: "Maximum first term",
	    shortcut: "a",
	    type: "integer",
	    default: 10
	},
	{
	    name: "d",
	    text: "Maximum common difference",
	    shortcut: "d",
	    type: "integer",
	    default: 10
	},
	{
	    name: "negative",
	    text: "Allow negatives",
	    shortcut: "g",
	    type: "boolean",
	    default: false
	},
	{
	    name: "repeat",
	    text: "Repeat Questions",
	    shortcut: "r",
	    type: "integer",
	    default: 1
	}
    ];

    var optdict = {};
    for (var i = 0; i < this.options.length; i++) {
	optdict[this.options[i].name] = i;
    }

    this.setOptions = function() {
	for (var i = 0; i < this.options.length; i++) {
	    if (this.options[i].type == "integer") {
		this.options[i].value = parseInt(this.options[i].element.val());
	    } else if (this.options[i].type == "boolean") {
		this.options[i].value = this.options[i].element.is(':checked');
	    } else {
		this.options[i].value = this.options[i].element.val();
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
	
	if (this.negative) {
	    this.mkint = function(a) {
		var n = Math.floor(2*a*self.prng() - a);
		if (n >= 0) n++;
		return n;
	    }
	} else {
	    this.mkint = function(a) {
		var n = Math.floor(a*self.prng() + 1);
		return n;
	    }
	}
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0": true};
    }
    
    this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

	var a = 0,d = 0;
	var qdiv,adiv,p,sep,tex;

	while (this.seqs[ a + ":" + d]) {
	    a = this.mkint(this.a);
	    d = this.mkint(this.d);
	}
	this.seqs[ a + ":" + d] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	tex = '';

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
	tex = texwrap('a = ' + texnum(a)) + ', ' + texwrap('d = ' + texnum(d)) + '.';

	p = a;
	for (var j = 0; j < this.terms; j++) {
	    qdiv.append(tomml(p));
	    p = math.add(p,d);
	    qdiv.append($('<span>').addClass("separator").html(", "));
	    qdiv.append($('<span>').addClass("linebreak").html(""));
	}
	qdiv.append($('<span>').addClass("dots").html("..."));

	this.qn++;
	return [qdiv, adiv, tex];
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
	    text: "Number of asked for terms",
	    shortcut: "t",
	    type: "integer",
	    default: 4
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
	    text: "Maximum first term",
	    shortcut: "a",
	    type: "integer",
	    default: 10
	},
	{
	    name: "d",
	    text: "Maximum common difference",
	    shortcut: "d",
	    type: "integer",
	    default: 10
	},
	{
	    name: "negative",
	    text: "Allow negatives",
	    shortcut: "g",
	    type: "boolean",
	    default: false
	},
	{
	    name: "repeat",
	    text: "Repeat Questions",
	    shortcut: "r",
	    type: "integer",
	    default: 1
	}
    ];

    var optdict = {};
    for (var i = 0; i < this.options.length; i++) {
	optdict[this.options[i].name] = i;
    }

    this.setOptions = function() {
	for (var i = 0; i < this.options.length; i++) {
	    if (this.options[i].type == "integer") {
		this.options[i].value = parseInt(this.options[i].element.val());
	    } else if (this.options[i].type == "boolean") {
		this.options[i].value = this.options[i].element.is(':checked');
	    } else {
		this.options[i].value = this.options[i].element.val();
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
	this.explanation = 'For each sequence, write down the sum of the first ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + '.';
	
	if (this.negative) {
	    this.mkint = function(a) {
		var n = Math.floor(2*a*self.prng() - a);
		if (n >= 0) n++;
		return n;
	    }
	} else {
	    this.mkint = function(a) {
		var n = Math.floor(a*self.prng() + 1);
		return n;
	    }
	}
    }

    this.reset = function() {
	this.qn = 0;
	this.seqs = {"0:0": true};
    }
    
    this.makeQuestion = function() {
	if (this.qn >= this.size) return false;

	var a = 0,d = 0;
	var qdiv,adiv,p,sep,tex;

	while (this.seqs[ a + ":" + d]) {
	    a = this.mkint(this.a);
	    d = this.mkint(this.d);
	}
	this.seqs[ a + ":" + d] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	tex = '';
	
	qdiv.append(tomml(a));
	p = a;

	for (var j = 1; j < this.length; j++) {
	    qdiv.append($('<span>').addClass("separator").html(", "));
	    qdiv.append($('<span>').addClass("linebreak").html(""));
	    p = math.add(p,d);
	    qdiv.append(tomml(p));
	}
	qdiv.append($('<span>').addClass("dots").html("."));

	p = math.eval('n*(2*a + (n-1)*d)/2', {a: a, d: d, n: self.terms});
	adiv.append(tomml(p));
	tex = totex(p);
	
	this.qn++;
	return [qdiv, adiv, tex];
    }
    

    return this;
}
