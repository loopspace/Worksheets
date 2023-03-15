/*
Question Type: Sequences

Question Type: Sequences nth Term of Geometric Sequence

Given geometric sequence, write down nth term and a particular term
*/

SeqGeomTerm = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq9",
    "SeqGeomTerm",
    ["0:0"]
);

SeqGeomTerm.explanation = function() {
    return 'For each sequence, write down the formula for the nth term and the given term.';
}

SeqGeomTerm.shortexp = function() {
    return 'Write down the formula for the nth term and the ';
}

SeqGeomTerm.addOption("terms","Number of given terms","t","integer",4);
SeqGeomTerm.addOption("a","Range for first term","a","string","1:10");
SeqGeomTerm.addOption("r","Range for common ratio","r","string","1:10");
SeqGeomTerm.addOption("k","Range for requested " + tomml('k')[0].outerHTML + "th term","k","string","20:40");
    
SeqGeomTerm.createQuestion = function(question) {
    var a,r,k;
    var p,sep;
    var nqn = 0;
    
    do {
	a = randomFromRange(this.a,this.prng());
	r = randomFromRange(this.r,this.prng());
	k = randomFromRange(this.k,this.prng());
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (this.checkQn([ a, r ]) )
    this.registerQn([ a, r ]);

    var term;
    term = math.multiply(a,math.pow(r,math.subtract(k,1)));

    var nthterm = mmlelt('math').attr('display','inline');
    var atex = [];

    var b = math.divide(a,r);

    addMonomial([b,'n'], atex, nthterm,r, true, false);
    
    question.adiv.append(
	$('<span>').append(nthterm).append("; ")
    );

    question.adiv.append(
	$('<span>').append(
	    mmlelt('math').attr('display','inline').append(
		tommlelt(term)
	    )
	).append(". ")
    );
    question.atex = texwrap(atex.join('')) + '; ' + texwrap(term) + '.';

    p = a;
    question.qtex = '';

    question.qdiv.append(
	tomml(k)
    ).append(
	ordinal_suffix_of(k) + " term of "
    );
    question.qtex = totex(k) +  ordinal_suffix_of(k) + ' term of ';
    for (var j = 0; j < this.terms; j++) {
	question.qdiv.append(tomml(p));
	question.qtex += totex(p) + ", ";
	p = math.multiply(p,r);
	question.qdiv.append($('<span>').addClass("separator").html(", "));
	question.qdiv.append($('<span>').addClass("linebreak").html(""));
    }
    question.qtex += totex('\\dotsc');
    question.qdiv.append($('<span>').addClass("dots").html("..."));

    return this;
}
