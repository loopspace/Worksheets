
/*
  Question Type: Solve an Equation
*/

// One-sided equations

OneEqSolve = new QuestionGenerator(
    "Equations",
    "One-sided Equations",
    "eq0",
    "OneEqSolve",
    ["0:0:0"]
);

OneEqSolve.explanation = function() {
    return 'Solve each equation';
}
OneEqSolve.shortexp = function() {
    return 'Solve ';
}

OneEqSolve.addOption("a","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi></math>","a","string","-5:5");
OneEqSolve.addOption("b","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi></math>","b","string","-5:5");
OneEqSolve.addOption("x","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi></math>","x","string","-5:5");
OneEqSolve.addOption("v","Range for letters used for variables","v","string","x");

OneEqSolve.createQuestion = function(question) {
    var a = 0, b = 0, x = 0, v = "";
    var p,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	b = randomFromRange(this.b,this.prng());
	x = randomFromRange(this.x,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while ( math.equal(a, 0) || this.checkQn([ a, b, x ]))

    this.registerQn([ a, b, x ]);

    v = randomLetterFromRange(this.v,this.prng());
    
    question.qdiv = $('<div>').addClass('question');
    question.adiv = $('<div>').addClass('answer');
    qtexa = [];
    atexa = [];

    var qmml = mmlelt('math').attr('display','inline');

    addCoefficient(a, qtexa, qmml);
    qmml.append(tommlelt(v));
    qtexa.push(v);
    addSignedNumber(b, qtexa, qmml);
    
    qmml.append(tommlelt('='));
    qtexa.push('=');
    
    qmml.append(tommlelt(math.add(math.multiply(a,x),b)));
    qtexa.push(math.add(math.multiply(a,x),b));
    
    question.qdiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');

    amml.append(tommlelt(v));
    atexa.push(v);
    
    amml.append(tommlelt('='));
    atexa.push('=');
    
    amml.append(tommlelt(x));
    atexa.push(x);
    
    question.adiv.append(amml);
    
    question.qtex = '\\(' + qtexa.join('') + '\\)';
    question.qmkd = '[m]' + qtexa.join('') + '[/m]';
    question.atex = '\\(' + atexa.join('') + '\\)';
    question.amkd = '[m]' + atexa.join('') + '[/m]';
    
    return this;
}
