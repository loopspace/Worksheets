function SeqArithTermFromTerms() {
    var self = this;
    this.title = "Sequence";
    this.storage = "SeqArithTermFromTerms";
    this.qn = 0;
    this.seqs = {"0:0": true};
    this.explanation = 'For each linear sequence, find the requested term.';
    this.shortexp = 'Write down the requested term of the linear sequence ';

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
	    name: "gvnterms",
	    text: "Range of given terms",
	    shortcut: "g",
	    type: "string",
	    default: "1:20"
	},
	{
	    name: "reqterm",
	    text: "Range of requested term",
	    shortcut: "q",
	    type: "string",
	    default: "1:20"
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
	var f = 1, l = 1, q = 1;
	var qdiv,adiv,p,sep,qtex,atex;
	var nqn = 0;

	while (this.seqs[ a + ":" + d ]) {
	    a = randomFromRange(this.a,this.prng());
	    d = randomFromRange(this.d,this.prng());
	    nqn++;
	    if (nqn > 10) {
		this.seqs = {"0:0": true};
		nqn = 0;
	    }
	}
	this.seqs[ a + ":" + d] = true;

	while (f == l || l == q || q == f) {
	    f = randomFromRange(this.gvnterms, this.prng());
	    l = randomFromRange(this.gvnterms, this.prng());
	    q = randomFromRange(this.reqterm, this.prng());
	}

	var fst, lst, qth;
	fst = a + (f - 1)*d;
	lst = a + (l - 1)*d;
	qth = a + (q - 1)*d;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = '';
	atex = '';

	adiv.append(
	    $('<span>').append(
		mmlelt('math').attr('display','inline').append(
		    tommlelt(qth)
		)
	    )
	);

	atex = totex(qth);

	p = a;
	qtex = 'Find the ' + q + ordinal_suffix_of(q) + ' term, where the '
	    + totex(f) + ordinal_suffix_of(f) + ' term is ' + totex(fst)
	    + " and the "
	    + totex(l) + ordinal_suffix_of(l) + ' term is ' + totex(lst)
	    + ".";

	qdiv.append($('<span>')
		    .append(q + ordinal_suffix_of(q) + ' term, where the ')
		    .append(f + ordinal_suffix_of(f) + ' term is ')
		    .append(tomml(fst))
		    .append(" and the ")
		    .append(l + ordinal_suffix_of(l) + ' term is ')
		    .append(tomml(lst))
		    .append(".")
		   );
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

