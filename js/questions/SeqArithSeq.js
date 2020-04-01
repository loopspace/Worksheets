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
Question Type: Sequences unknown term from known terms
*/

/*
Given two terms of a linear sequence, find another term
*/

