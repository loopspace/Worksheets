/*
  Arithmetic
*/

/*
  Question Type: Multiple add and subtracts
*/

ArithSums = new QuestionGenerator(
    "Arithmetic",
    "Arithmetic",
    "arith0",
    "ArithSums",
    [""]
);

ArithSums.explanation = function() {
    return 'Calculate the following expressions.';
}
ArithSums.shortexp = function() {
    return 'Calculate ';
}


ArithSums.addOption("a","Range for terms (zero is automatically excluded)","a","string","-10:10");
ArithSums.addOption("n","Range for number of terms","n","string","3:5");

ArithSums.createQuestion = function(question) {
    var a = [];
    var qtexa,atexa;
    var nqn = 0;

    var n = randomFromRange(this.n,this.prng());

    do {
	a = [];
	for (var i = 0; i < n; i++) {
	    var b;
	    do {
		b = randomFromRange(this.a,this.prng());
	    } while (b == 0);
	    a.push(b);
	}
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
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
