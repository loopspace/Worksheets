/*
Question Type: Sequences

Question Type: Sequences Sum of Geometric Series

Given a geometric sequence, sum to a given term
*/

SeqSumGeomSeriesToTerm = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq12",
    "SeqSumGeomSeriesToTerm",
    ["0:0"]
);

SeqSumGeomSeriesToTerm.explanation = function() {
    return 'For each sequence, write down its sum to the given term.';
}
SeqSumGeomSeriesToTerm.shortexp = function() {
    return 'Write down the sum of ';
}

SeqSumGeomSeriesToTerm.addOption("terms","Range for asked for terms","t","string","10:20");
SeqSumGeomSeriesToTerm.addOption("length","Number of shown terms","l","integer",4);
SeqSumGeomSeriesToTerm.addOption("a","Range for first term","a","string","1:10");
SeqSumGeomSeriesToTerm.addOption("r","Range for common ratio","r","string","1:10");
    
SeqSumGeomSeriesToTerm.createQuestion = function(question) {
    var a,r,n,b;
    var p,sep;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	r = randomFromRange(this.r,this.prng());
	n = randomFromRange(this.terms,this.prng());
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (this.checkQn([ a , r]))

    this.registerQn([ a, r]);
    
    question.qtex = texnum(a);
    p = a;
    b = math.multiply(a, math.pow(r,math.subtract(n, 1)));

    var qmml = mmlelt('math').attr('display','inline');
    qmml.append(tommlelt(a));

    for (var j = 1; j < this.length; j++) {
	p = math.multiply(p,r);
	if (math.compare(p,0) !== -1) {
	    qmml.append(tommlelt('+'));
	    question.qtex += ' + ';
	} else {
	    qmml.append(tommlelt('-'));
	    question.qtex += ' - ';
	}
	qmml.append(tommlelt(p));
	question.qtex += texnum(p);
    }
    qmml.append(tommlelt('+'));
    qmml.append(tommlelt('&ctdot;'));
    question.qtex += ' + \\dots ';
    
    if (math.compare(b,0) !== -1) {
	qmml.append(tommlelt('+'));
	question.qtex += ' + ';
    } else {
	qmml.append(tommlelt('-'));
	question.qtex += ' - ';
    }
    
    qmml.append(tommlelt(b));
    question.qtex += texnum(b);
    
    question.qdiv.append(qmml);
    question.qtex = texwrap(question.qtex);

    if(math.equal(r,1)) {
	p = math.multiply(a,n);
    } else {
	p = math.multiply(
	    a,
	    math.divide(
		math.subtract(
		    math.pow(r,n)
		    ,1)
		, math.subtract(r,1)
	    )
	);
    }

    question.adiv.append(tomml(p));
    question.atex = totex(p);
    
    return this;
}
