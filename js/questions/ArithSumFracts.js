/*
  Question Type: Multiple add and subtracts of fractions
*/

ArithSumFracts = new QuestionGenerator(
    "Arithmetic",
    "Arithmetic",
    "arith2",
    "ArithSumFracts",
    [""]
);

ArithSumFracts.explanation = function() {
    return 'Calculate the following expressions.';
}
ArithSumFracts.shortexp = function() {
    return 'Calculate ';
}

ArithSumFracts.addOption("a","Range for numerators (zero is automatically excluded)","a","string","-10:10");
ArithSumFracts.addOption("d","Range for denominators (zero is automatically excluded)","d","string","-10:10");
ArithSumFracts.addOption("n","Range for number of terms","n","string","3:5");

ArithSumFracts.createQuestion = function(question) {
    var a = [];
    var qtexa,atexa;
    var nqn = 0;

    var n = randomFromRange(this.n,this.prng());

    do {
	a = [];
	for (var i = 0; i < n; i++) {
	    var b,d;
	    do {
		b = randomFromRange(this.a,this.prng());
		d = randomFromRange(this.d,this.prng());
	    } while (b == 0 || d == 0);
	    a.push(math.fraction(math.divide(b,d)));
	}
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (this.checkQn(a.slice().sort()))

    this.registerQn(a.slice().sort());
    
    qtexa = ['\\('];
    atexa = ['\\('];

    var qmml = mmlelt('math').attr('display','inline');
    
    addNumber(a[0],qtexa,qmml);
    for (var i = 1; i < a.length; i++) {
	addSignedNumber(a[i],qtexa,qmml);
    }

    qtexa.push('\\)');
    var s = 0;
    for (var i = 0; i < a.length; i++) {
	s = math.add(s,a[i]);
    }

    question.qdiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');
    addNumber(s,atexa,amml);
    question.adiv.append(amml);
    atexa.push('\\)');
    
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');

    return this;
}
