/*
  Question Type: Rewrite Indices
*/

// Rewrite an expression using indices


AlgIndices = new QuestionGenerator(
    "Algebra",
    "Rewrite Expression",
    "alg1",
    "AlgIndices",
    ["0:0"]
);

AlgIndices.explanation = function() {
    return 'Rewrite each of the following expressions in index form.';
}
AlgIndices.shortexp = function() {
    return 'Rewrite ';
}

AlgIndices.addOption("n","Range for number of terms","n","string","3:5");
AlgIndices.addOption("a","Range for coefficients of terms","a","string","1:9");
AlgIndices.addOption("p","Range for powers in terms","p","string","0:7");
AlgIndices.addOption("v","Range for letters used for variable in expression","v","string","x");

AlgIndices.createQuestion = function(question) {
    var a,p,u,v;
    var qtexa,atexa;
    var nqn = 0;
    var q, qs, ps;
    var n = 0;
    do {
	n = randomFromRange(this.n,this.prng());
	nqn++;
	if (n < 1 && nqn > 10) {
	    n = 2;
	    nqn = 0;
	}
    } while (n < 1);
    
    nqn = 0;
    var nqa;
    do {
	q = [];
	qs = [];
	ps = [];
	for (var i = 0; i < n; i++) {
	    nqa = 0;
	    do {
		a = randomFromRange(this.a,this.prng());
		nqa++;
		if (a == 0 && nqa > 10) {
		    a = 1;
		}
	    } while (a == 0);
	    nqa = 0;
	    do {
		p = randomFromRange(this.p,this.prng());
		nqa++;
	    } while (nqa <= 10 && ps.indexOf(p.toString()) != -1);
	    q.push([a,p]);
	    ps.push(p.toString());
	}
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
	q.sort(function(a,b) { return b[1] - a[1] });
	for (var j = 0; j < q.length; j++) {
	    qs.push(q[j].join(","));
	}
    } while (this.checkQn(qs))

    this.registerQn(qs);

    v = randomLetterFromRange(this.v,this.prng());
    
    question.qdiv = $('<div>').addClass('question');
    question.adiv = $('<div>').addClass('answer');
    qtexa = []
    atexa = [];

    var qmml = mmlelt('math').attr('display','inline');

    addPolynomial(q,qtexa,qmml,v,true,true);
    question.qdiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');

    addPolynomial(q,atexa,amml,v,false,false);
    
    question.adiv.append(amml);
    
    question.qtex =
	'\\('
	+
	qtexa.join('')
	+
	'\\)';
    question.atex =
	'\\('
	+
	atexa.join('')
	+
	'\\)';
    question.qmkd =
	'[m]'
	+
	qtexa.join('')
	+
	'[/m]';
    question.amkd =
	'[m]'
	+
	atexa.join('')
	+
	'[/m]';
   
    
    return this;
}
