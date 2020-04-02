/*
  Question Type: Multiple multiply and divides
*/

ArithProds = new QuestionGenerator(
    "Arithmetic",
    "Arithmetic",
    "arith1",
    "ArithProds",
    [";"]
);

ArithProds.explanation = function() {
    return 'Calculate the following expressions.';
}
ArithProds.shortexp = function() {
    return 'Calculate ';
}

ArithProds.addOption("a","Range for terms (zero and one are automatically excluded)","a","string","-10:10");
ArithProds.addOption("n","Range for number of terms","n","string","3:5");

ArithProds.createQuestion = function(question) {
    var a = [];
    var m = [];
    var qtexa,atexa;
    var nqn = 0;

    var n = randomFromRange(this.n,this.prng());

    do {
	a = [];
	for (var i = 0; i < n; i++) {
	    var b;
	    do {
		b = randomFromRange(this.a,this.prng());
	    } while (b == 0 || b == 1);
	    a.push(b);
	}
	m = [];
	for (var i = 0; i < n-1; i++) {
	    m.push(Math.round10(this.prng(),0));
	}
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
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
