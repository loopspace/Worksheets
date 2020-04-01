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

