
// Two-sided inequalities

TwoIneqSolve = new QuestionGenerator(
    "Inequalities",
    "Two-sided Inequalities",
    "ineq1",
    "TwoIneqSolve",
    ["0:0:0:0"]
);

TwoIneqSolve.explanation = function() {
    return 'Solve each inequality';
}
TwoIneqSolve.shortexp = function() {
    return 'Solve ';
}

TwoIneqSolve.addOption("a","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi></math>","a","string","-5:5");
TwoIneqSolve.addOption("c","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi></math>","c","string","-5:5");
TwoIneqSolve.addOption("b","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi><mo>+</mo><mi>d</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo>=</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi></math>","b","string","1");
TwoIneqSolve.addOption("x","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math>","x","string","-5:5");
TwoIneqSolve.addOption("v","Range for letters used for variables","v","string","x");

TwoIneqSolve.createQuestion = function(question) {

    var a = 0, b = 0, c = 0, d = 0, x = 0, v = "", ieq;
    var p,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;

    do {

	a = randomFromRange(this.a,this.prng());
	c = randomFromRange(this.c,this.prng());
	b = randomFromRange(this.b,this.prng());
	x = randomFromRange(this.x,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while ( math.equal(math.multiply(a,c),0) || math.equal(a, c) || this.checkQn([ a, c, b, x ]))

    this.registerQn([ a, c,  b,  x ]);

    v = randomLetterFromRange(this.v, this.prng());
    ieq = Math.floor(this.prng()*4);
    
    d = math.add(
	math.subtract(
	    math.multiply(a,x),
	    math.multiply(c,x)
	),b);
    d = math.multiply(math.sign(d),math.floor(math.divide(math.abs(d),2)));
    b = math.add(
	math.subtract(
	    math.multiply(c,x),
	    math.multiply(a,x)
	),d);
    
    question.qdiv = $('<div>').addClass('question');
    question.adiv = $('<div>').addClass('answer');
    qtexa = [];
    atexa = [];

    var qmml = mmlelt('math').attr('display','inline');

    addCoefficient(a, qtexa, qmml);
    qmml.append(tommlelt(v));
    qtexa.push(v);
    addSignedNumber(b, qtexa, qmml);
    
    qmml.append(tommlelt(inequalEntities[ieq]));
    qtexa.push(inequalTeX[ieq]);
    
    addCoefficient(c, qtexa, qmml);
    qmml.append(tommlelt(v));
    qtexa.push(v);
    addSignedNumber(d, qtexa, qmml);
    
    question.qdiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');

    amml.append(tommlelt(v));
    atexa.push(v);

    if (math.compare(math.subtract(a,c),0) == -1) {
	ieq += 2;
	ieq %= 4;
    }
    
    amml.append(tommlelt(inequalEntities[ieq]));
    atexa.push(inequalTeX[ieq]);
    
    amml.append(tommlelt(x));
    atexa.push(x);
    
    question.adiv.append(amml);
    
    question.qtex = '\\(' + qtexa.join('') + '\\)';
    question.qmkd = '[m]' + qtexa.join('') + '[/m]';
    question.atex = '\\(' + atexa.join('') + '\\)';
    question.amkd = '[m]' + atexa.join('') + '[/m]';
    
    return this;
}
