/*
Question Type: Sequences

Question Type: Sequences Sum of Arithmetic Series

Given a linear sequence, sum to a given term
*/

SeqSumSeries = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq7",
    "SeqSumSeriesToTerm",
    ["0:0"]
);

SeqSumSeries.explanation = function() {
    return 'For each sequence, write down its sum to the given term.';
}
SeqSumSeries.shortexp = function() {
    return 'Write down the sum of ';
}

SeqSumSeries.addOption("terms","Range for asked for terms","t","string","10:20");
SeqSumSeries.addOption("length","Number of shown terms","l","integer",4);
SeqSumSeries.addOption("a","Range for first term","a","string","1:10");
SeqSumSeries.addOption("d","Range for common difference","d","string","1:10");
    
SeqSumSeries.createQuestion = function(question) {
    var a,d,n,b;
    var p,sep;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	d = randomFromRange(this.d,this.prng());
	n = randomFromRange(this.terms,this.prng());
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (this.checkQn([ a , d]))

    this.registerQn([ a, d]);
    
    question.qtex = texnum(a);
    p = a;
    b = math.add(a, math.multiply(n - 1, d));

    var qmml = mmlelt('math').attr('display','inline');
    qmml.append(tommlelt(a));

    for (var j = 1; j < this.length; j++) {
	qmml.append(tommlelt('+'));
	question.qtex += ' + ';
	p = math.add(p,d);
	qmml.append(tommlelt(p));
	question.qtex += texnum(p);
    }
    qmml.append(tommlelt('+'));
    qmml.append(tommlelt('&ctdot;'));
    qmml.append(tommlelt('+'));
    qmml.append(tommlelt(b));
    
    question.qtex += ' + \\dots + ';
    question.qtex += texnum(b);
    
    question.qdiv.append(qmml);
    question.qtex = texwrap(question.qtex);

    p = math.multiply(n,
		      math.divide(
			  math.add(
			      math.multiply(2,a),
			      math.multiply(n-1,d)
			  ),
			  2)
		     );
    question.adiv.append(tomml(p));
    question.atex = totex(p);
    
    return this;
}
