/*
  Arithmetic
*/

/*
  Question Type: Multiple add and subtracts
*/

ArithSums = new QuestionGenerator(
    "Arithmetic",
    "Arithmetic",
    "arith15",
    "ArithSumProd",
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
    var op = [];
    var qtexa,atexa;
    var nqn = 0;

    var n = randomFromRange(this.n,this.prng());

    do {
	a = [];
	op = [];
	for (var i = 0; i < n; i++) {
	    var b;
	    do {
		b = randomFromRange(this.a,this.prng());
	    } while (b == 0);
	    a.push(b);
	    op.push( Math.floor(this.prng()*4)  );
	}
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
	op[0] = 0;
    } while (this.checkQn([a,op]))

    this.registerQn([a,op]);
    
    qtexa = ['\\('];
    atexa = ['\\('];

    var qmml = mmlelt('math').attr('display','inline');
    
    addNumber(a[0],qtexa,qmml);
    for (var i = 1; i < a.length; i++) {
	if (op[i] == 0) { // addition
	    addSignedNumber(a[i],qtexa,qmml);
	} else if (op[i] == 1) { // subtraction
	    qtexa.push(' - ');
	    qmml.append(tommlelt('-'));
	    addNumber(a[i],qtexa,qmml);
	} else if (op[i] == 2) { // multiplication
	    qtexa.push(' \\times ');
	    qmml.append(tommlelt('&times;'));
	    addNumber(a[i],qtexa,qmml);
	} else if (op[i] == 3) { // division
	    qtexa.push(' \\div ');
	    qmml.append(tommlelt('&div;'));
	    addNumber(a[i],qtexa,qmml);
	}
    }

    qtexa.push('\\)');
    var m = true;
    var b, oq, s;
    b = [];
    oq = [];
    b.push(a[0]);
    oq.push(op[0]);
    for (var i = 1; i < a.length; i++) {
	if (op[i] == 2) {
	    b[b.length - 1] = math.multiply(b[b.length-1],a[i]);
	} else if (op[i] == 3) {
	    b[b.length - 1] = math.fraction(math.divide(b[b.length-1],a[i]));
	} else {
	    b.push(a[i]);
	    oq.push(op[i]);
	}
    }
    s = b[0];
    for (var i = 1; i < b.length; i++) {
	if (oq[i] == 0) {
	    s = math.add(s,b[i]);
	} else {
	    s = math.subtract(s,b[i]);
	}
    }

    question.qdiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');

    atexa.push(texnum(s));
    amml.append(tommlelt(s));

    question.adiv.append(amml);
    atexa.push('\\)');
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');

    return this;
}
