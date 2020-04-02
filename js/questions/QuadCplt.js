
/*
Question type: Complete the square
*/

QuadCplt = new QuestionGenerator(
    "Quadratics",
    "Quadratics",
    "quad2",
    "QuadCplt",
    ["0:0:0"]
);

QuadCplt.explanation = function() {
    return 'Complete the square for each quadratic expression';
}

QuadCplt.shortexp = function() {
    return 'Complete the square for ';
}

QuadCplt.addOption("p","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>","p","string","1");
QuadCplt.addOption("q","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>q</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>","q","string","-5:5");
QuadCplt.addOption("r","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>r</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>","r","string","-5:5");


QuadCplt.createQuestion = function(question) {

    var p = 0,q = 0, r = 0;
    var qdiv,adiv,a,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;

    do {
	p = randomFromRange(this.p,this.prng());
	q = randomFromRange(this.q,this.prng());
	r = randomFromRange(this.r,this.prng());
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (p == 0 || this.checkQn([p, q, r]))
    this.registerQn([ p, q, r]);
    
    qtexa = ['\\('];
    atexa = [];
    coeffn = addCoefficient;
    numbfn = addNumber;

    var qmml = mmlelt('math').attr('display','inline');
    if (coeffn(p,qtexa,qmml)) {
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

    if (coeffn(2 * p * q,qtexa,qmml)) {
	qtexa.push(' x ');
	qmml.append(tommlelt('x'));

	coeffn = addSignedCoefficient;
	numbfn = addSignedNumber;
    }

    numbfn(p * q**2 + r,qtexa,qmml);
    question.qdiv.append(qmml);
    qtexa.push('\\)');
    
    var amml = mmlelt('math').attr('display','inline');
    atexa.push('\\(');

    addCoefficient(p,atexa,amml);

    var bmml = mmlelt('msup');
    var gmml = mmlelt('mrow');

    
    if (q != 0) {
	atexa.push('(');
	gmml.append(tommlelt('('));
    }

    atexa.push('x');
    gmml.append(tommlelt('x'));

    if (addSignedNumber(q,atexa,gmml)) {
	atexa.push(')');
	gmml.append(tommlelt(')'));
    }

    atexa.push('^2');
    bmml.append(
	gmml
    ).append(
	tommlelt('2')
    )
    amml.append(bmml);

    addSignedNumber(r,atexa,amml);
    
    question.adiv.append(amml);
    atexa.push('\\)');
    
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');
    return this;
}
