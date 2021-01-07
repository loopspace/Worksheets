/*
Quadratics

Question Type: Factorise a quadratic expression
*/

QuadFact = new QuestionGenerator(
    "Quadratics",
    "Quadratics",
    "quad0",
    "QuadFact",
    ["0:0:0:0"]
);

QuadFact.explanation = function() {
    return 'Factorise each quadratic expression';
}
QuadFact.shortexp = function () {
    return 'Factorise ';
}

QuadFact.addOption("a","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>","a","string","1");
QuadFact.addOption("b","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>","b","string","-5:5");
QuadFact.addOption("c","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>","c","string","1");
QuadFact.addOption("d","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>d</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>","d","string","-5:5");


QuadFact.createQuestion = function(question) {
    var a,b,c,d;
    var p,sep,coeffn,numbfn, qtexa, atexa;
    var nqn = 0;
    var tmp;

    do {
	a = randomFromRange(this.a,this.prng());
	b = randomFromRange(this.b,this.prng());
	c = randomFromRange(this.c,this.prng());
	d = randomFromRange(this.d,this.prng());
	nqn++;

	if (a > c) {
	    tmp = a;
	    a = c;
	    c = tmp;

	    tmp = b;
	    b = d;
	    d = tmp;
	} else if (a == c && b > d) {
	    tmp = b;
	    b = d;
	    d = tmp;
	}
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (!math.equal(commonTerms(a,b,c,d),1) || a * c == 0 || b**2 + d**2 == 0 || this.checkQn([ a, b, c, d]))

    this.registerQn([ a, b, c, d]);

    if (math.equal(d,0)) {
	tmp = a;
	a = c;
	c = tmp;
	
	tmp = b;
	b = d;
	d = tmp;
    }
    
    qtexa = ['\\('];
    atexa = [];
    coeffn = addCoefficient;
    numbfn = addNumber;

    var qmml = mmlelt('math').attr('display','inline');
    
    if (coeffn(a * c,qtexa,qmml)) {
	qmml.append(
	    mmlelt('msup').append(
		tommlelt('x')
	    ).append(
		tommlelt('2')
	    )
	);
	qtexa.push('x^2');
	coeffn = addSignedCoefficient;
	numbfn = addSignedNumber;
    }

    if (coeffn(a * d + c * b,qtexa,qmml)) {
	qtexa.push(' x ');
	qmml.append(tommlelt('x'));
	coeffn = addSignedCoefficient;
	numbfn = addSignedNumber;
    }

    numbfn(b * d,qtexa,qmml);
    question.qdiv.append(qmml);
    qtexa.push('\\)');
    
    var amml = mmlelt('math').attr('display','inline');
    atexa.push('\\(');

    coeffn = addCoefficient;
    numbfn = addNumber;

    if (b != 0) {
	atexa.push("(");
	amml.append(tommlelt('('));
    }
    
    if (coeffn(a,atexa,amml)) {
	atexa.push(" x ");
	amml.append(tommlelt('x'));
	numbfn = addSignedNumber;
    }

    if (numbfn(b,atexa,amml)) {
	atexa.push(")");
	amml.append(tommlelt(')'));
    }

    numbfn = addNumber;

    if (d != 0) {
	atexa.push("(");
	amml.append(tommlelt('('));
    }
    
    if (coeffn(c,atexa,amml)) {
	atexa.push(" x ");
	amml.append(tommlelt('x'));
	numbfn = addSignedNumber;
    }

    if (numbfn(d,atexa,amml)) {
	atexa.push(")");
	amml.append(tommlelt(')'));
    }
    
    question.adiv.append(amml);
    atexa.push('\\)');

    question.qtex = qtexa.join('');
    question.atex = atexa.join('');
    return this;

}
