/*
  Question Type: Multiple multiply and divides
*/

ArithProdFracts = new QuestionGenerator(
    "Arithmetic",
    "Arithmetic",
    "arith3",
    "ArithProdFracts",
    [";"]
);

ArithProdFracts.explanation = function() {
    return 'Calculate the following expressions.';
}
ArithProdFracts.shortexp = function() {
    'Calculate ';
}

ArithProdFracts.addOption("a","Range for numerators (zero is automatically excluded)","a","string","-10:10");
ArithProdFracts.addOption("d","Range for denominators (zero is automatically excluded)","d","string","-10:10");
ArithProdFracts.addOption("n","Range for number of terms","n","string","3:5");

ArithProdFracts.createQuestion = function(question) {
    var a = [];
    var m = [];
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
	    } while (b == 0 || d == 0 || b == d);
	    a.push(math.fraction(math.divide(b,d)));
	}
	m = [];
	for (var i = 0; i < n-1; i++) {
	    m.push(Math.round10(this.prng(),0));
	}
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn(a.join(':') + ";" + m.join(':')))


    this.registerQn(a.join(':') + ";" + m.join(':'));
    
    qtexa = ['\\('];
    atexa = ['\\('];

    var qmml = mmlelt('math').attr('display','inline');

    addNumber(a[0],qtexa,qmml);
    var s = a[0];
    for (var i = 1; i < a.length; i++) {
	if (m[i-1] == 1) {
	    qtexa.push('\\times');
	    qmml.append(mmlelt('mo').html('&times;'));
	    s = math.multiply(s,a[i]);
	} else {
	    qtexa.push('\\div');
	    qmml.append(mmlelt('mo').html('&div;'));
	    s = math.fraction(math.divide(s,a[i]));
	}
	addNumber(a[i],qtexa,qmml);
    }

    qtexa.push('\\)');
    question.qdiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');
    addNumber(s,atexa,amml);
    question.adiv.append(amml);
    atexa.push('\\)');

    question.qtex = qtexa.join('');
    question.atex = atexa.join('');

    return this;
}
