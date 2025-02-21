
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
QuadCplt.addOption("v","Range for letters used for variables","v","string","x");


QuadCplt.createQuestion = function(question) {

    var p = 0,q = 0, r = 0;
    var a,b,c;
    var v;
    var qdiv,adiv,a,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;

    do {
	p = randomFromRange(this.p,this.prng());
	q = randomFromRange(this.q,this.prng());
	r = randomFromRange(this.r,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (p == 0 || this.checkQn([p, q, r]))
    this.registerQn([ p, q, r]);

    v = randomLetterFromRange(this.v, this.prng());

    a = p;
    b = math.multiply(2, math.multiply(p,q))
    c = math.add(math.multiply(p, math.multiply(q,q)), r);

    var lhs = [[a,2], [b,1], [c,0]];
    
    qtexa = ['\\('];
    atexa = [];
    coeffn = addCoefficient;
    numbfn = addNumber;

    var qmml = mmlelt('math').attr('display','inline');

    addPolynomial(lhs, qtexa, qmml, v);
    
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

    atexa.push(v);
    gmml.append(tommlelt(v));

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
