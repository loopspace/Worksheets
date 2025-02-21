/*
Question Type: Sequences

Question Type: Geometric sequences unknown term from known terms

Given two terms of a geometric sequence, find another term
*/

SeqGeomTermFromTerms = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq10",
    "SeqGeomTermFromTerms",
    ["0:0"]
);

SeqGeomTermFromTerms.explanation = function() {
    return 'For each geometric sequence, find the requested term.';
}
SeqGeomTermFromTerms.shortexp = function () {
    return 'For the following geometric sequence, write down the ';
}

SeqGeomTermFromTerms.addOption("gvnterms","Range of given terms","g","string","1:20");
SeqGeomTermFromTerms.addOption("reqterm","Range of requested term","q","string","1:20");
SeqGeomTermFromTerms.addOption("a","Range for first term","a","string","1:10");
SeqGeomTermFromTerms.addOption("r","Range for ratio difference","r","string","1:10");
    
SeqGeomTermFromTerms.createQuestion = function(question) {
    var a,r;
    var f,l,q;
    var p,sep;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	r = randomFromRange(this.r,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn([ a, r ]))

    this.registerQn([ a, r]);

    do {
	f = randomFromRange(this.gvnterms, this.prng());
	l = randomFromRange(this.gvnterms, this.prng());
	q = randomFromRange(this.reqterm, this.prng());
    } while (math.compare(f,l) == 0 || math.compare(l,q) == 0 || math.compare(q,f) == 0);

    if (math.compare(f,l) == 1) {
	[l,f] = [f,l];
    }

    var fst, lst, qth;
    fst = math.multiply( a, math.pow(r, math.subtract(f,1) ));
    lst = math.multiply( a, math.pow(r, math.subtract(l,1) ));
    qth = math.multiply( a, math.pow(r, math.subtract(q,1) ));
    
    question.adiv.append(
	$('<span>').append(
	    mmlelt('math').attr('display','inline').append(
		tommlelt(qth)
	    )
	)
    );

    question.atex = totex(qth);

    p = a;
    question.qtex =  q + ordinal_suffix_of(q) + ' term, where the '
	+ totex(f) + ordinal_suffix_of(f) + ' term is ' + totex(fst)
	+ " and the "
	+ totex(l) + ordinal_suffix_of(l) + ' term is ' + totex(lst)
	+ ".";

    question.qdiv.append($('<span>')
		.append(q + ordinal_suffix_of(q) + ' term, where the ')
		.append(f + ordinal_suffix_of(f) + ' term is ')
		.append(tomml(fst))
		.append(" and the ")
		.append(l + ordinal_suffix_of(l) + ' term is ')
		.append(tomml(lst))
		.append(".")
	       );
    return this;
}
