
/*
  Question Type: Solve an Equation
*/

// One-sided equations

OneStepSolve = new QuestionGenerator(
    "Equations",
    "One-Step Equations",
    "eq3",
    "OneStepSolve",
    ["0:0"]
);

OneStepSolve.explanation = function() {
    return 'Solve each equation';
}
OneStepSolve.shortexp = function() {
    return 'Solve ';
}

OneStepSolve.addOption("a","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math>","a","string","-5:5");
OneStepSolve.addOption("x","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math>","x","string","-5:5");
OneStepSolve.addOption("v","Range for letters used for variables","v","string","x");

OneStepSolve.createQuestion = function(question) {
    var a = 0, b = 0, x = 0, v = "", op;
    var p,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	x = randomFromRange(this.x,this.prng());
	op = Math.floor(this.prng()*4);
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (
	math.equal(a, 0)
	    || math.equal(x, 0)
	    || (math.equal(a,1) && op > 1)
	    || (math.equal(x,1) && op > 1)
	    || this.checkQn([ a, x, op ])
    )

    this.registerQn([ a, x, op ]);

    v = randomLetterFromRange(this.v,this.prng());
    
    qtexa = ['\\('];
    atexa = [];

    var qmml = mmlelt('math').attr('display','inline');

    if (op == 0) { // addition
	b = math.add(a,x);
	qmml.append(tommlelt(v));
	qtexa.push(v);
	addSignedNumber(a,qtexa,qmml);
    } else if (op == 1) { // subtraction, a - x
	b = math.subtract(a,x);
	addNumber(a,qtexa,qmml);
	qtexa.push(' - ');
	qmml.append(tommlelt('-'));
	qtexa.push(v);
	qmml.append(tommlelt(v));
    } else if (op == 2) { // multiplication
	b = math.multiply(a,x);
	addMonomial([a,1], qtexa, qmml, v, true,false);
    } else if (op == 3) { // division, a/x
	b = math.divide(a,x);
	addMonomial([a,-1], qtexa, qmml, v, true, true);
    }
    
    qmml.append(tommlelt('='));
    qtexa.push('=');

    addNumber(b,qtexa,qmml);
    
    question.qdiv.append(qmml);
    qtexa.push('\\)');
    
    var amml = mmlelt('math').attr('display','inline');
    atexa.push('\\(');

    amml.append(tommlelt(v));
    atexa.push(v);
    
    amml.append(tommlelt('='));
    atexa.push('=');
    
    amml.append(tommlelt(x));
    atexa.push(x);
    
    question.adiv.append(amml);
    atexa.push('\\)');
    
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');
    
    return this;
}
