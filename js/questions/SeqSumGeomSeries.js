/*
Question Type: Sequences

Question Type: Sequences Sum of Geometric Series

Given a geometric sequence, sum the first n terms 
*/

SeqSumGeomSeries = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq11",
    "SeqSumGeomSeries",
    ["0:0"]
);

SeqSumGeomSeries.explanation = function() {
    return 'For each sequence, write down the sum of the given number of terms.';
}
SeqSumGeomSeries.shortexp = function() {
    return 'Write down the sum of ';
}

SeqSumGeomSeries.addOption("terms","Range for asked for terms","t","string","10:20");
SeqSumGeomSeries.addOption("length","Number of shown terms","l","integer",4);
SeqSumGeomSeries.addOption("a","Range for first term","a","string","1:10");
SeqSumGeomSeries.addOption("r","Range for common ratio","r","string","1:10");
    
SeqSumGeomSeries.createQuestion = function(question) {
    var a,r,n;
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
    var qmml = mmlelt('math').attr('display','inline');
    qmml.append(tommlelt(a));

    for (var j = 1; j < this.length; j++) {
	qmml.append(tommlelt('+'));
	question.qtex += ' + ';
	p = math.multiply(p,r);
	qmml.append(tommlelt(p));
	question.qtex += texnum(p);
    }
    qmml.append(tommlelt('+'));
    qmml.append(tommlelt('&ctdot;'));
    question.qtex += ' + \\dots';
    question.qdiv.append(qmml);
    question.qtex = texwrap(question.qtex);
    question.qtex += ' to ' + totex(n) + ' terms.';
    question.qdiv.append($('<span>').html(" to " + n + " terms."));

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
