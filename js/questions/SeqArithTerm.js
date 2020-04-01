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

