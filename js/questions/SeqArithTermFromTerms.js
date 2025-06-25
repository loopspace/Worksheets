/*
Question Type: Sequences

Question Type: Sequences unknown term from known terms

Given two terms of a linear sequence, find another term
*/

SeqArithTermFromTerms = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq5",
    "SeqArithTermFromTerms",
    ["0:0"]
);

SeqArithTermFromTerms.explanation = function() {
    return 'For each linear sequence, find the requested term.';
}
SeqArithTermFromTerms.shortexp = function () {
    return 'For the following linear sequence, write down the ';
}

SeqArithTermFromTerms.addOption("gvnterms","Range of given terms","g","string","1:20");
SeqArithTermFromTerms.addOption("reqterm","Range of requested term","q","string","1:20");
SeqArithTermFromTerms.addOption("a","Range for first term","a","string","1:10");
SeqArithTermFromTerms.addOption("d","Range for common difference","d","string","1:10");
    
SeqArithTermFromTerms.createQuestion = function(question) {
    var a,d;
    var f,l,q;
    var p,sep;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	d = randomFromRange(this.d,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn([ a, d ]))

    this.registerQn([ a, d]);

    do {
	f = randomFromRange(this.gvnterms, this.prng());
	l = randomFromRange(this.gvnterms, this.prng());
	q = randomFromRange(this.reqterm, this.prng());
    } while (math.compare(f,l) == 0 || math.compare(l,q) == 0 || math.compare(q,f) == 0);

    if (math.compare(f,l) == 1) {
	[l,f] = [f,l];
    }

    var fst, lst, qth;
    fst = math.add(a, math.multiply(f - 1,d));
    lst = math.add(a, math.multiply(l - 1,d));
    qth = math.add(a, math.multiply(q - 1,d));
    
    question.adiv.append(
	$('<span>').append(
	    tomml(qth)
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
