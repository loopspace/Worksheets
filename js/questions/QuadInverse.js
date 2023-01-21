/*
Question type: Find the inverse of a quadratic
*/

QuadInverse = new QuestionGenerator(
    "Functions",
    "Invert a Quadratic",
    "funct0",
    "QuadInverse",
    ["0:0:0"]
);

QuadInverse.explanation = function() {
    return 'Find the inverse of the following quadratic functions.';
}
QuadInverse.shortexp = function() {
    return 'Invert ';
}

QuadInverse.addOption("a","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>","a","string","1");
QuadInverse.addOption("b","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>","b","string","-5:5");
QuadInverse.addOption("c","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>","c","string","-5:5");
QuadInverse.addOption("v","Range for letters used for variables","v","string","x");
QuadInverse.addOption("f","Range for letters used for functions","f","string","f");

QuadInverse.createQuestion = function(question) {
    var a,b,c,v,f;
    var p,q,r,s,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	b = randomFromRange(this.b,this.prng());
	c = randomFromRange(this.c,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (a == 0 || this.checkQn([ a, b, c]))

    this.registerQn([ a, b,  c]);

    f = randomLetterFromRange(this.f, this.prng());
    v = randomLetterFromRange(this.v, this.prng());
    
    var fn = [ [a,2], [b,1], [c,0] ];

    qtexa = [];
    atexa = [];
    
    var qmml = mmlelt('math').attr('display','inline');
    
    qtexa.push(f + ' \\colon ' + v + ' \\mapsto ');
    qmml.append(tommlelt(f));
    qmml.append(tommlelt('&colon;').attr('lspace',"0.1111111111111111em"));
    qmml.append(tommlelt(v));
    qmml.append(tommlelt('&map;'));

    addPolynomial(fn, qtexa, qmml, v);

    atexa = [];
    
    var amml = mmlelt('math').attr('display','inline');
    
    atexa.push(f + '^{-1} \colon ' + v + ' \mapsto ');

    var mrow = mmlelt('mrow');
    var msup = mmlelt('msup');
    msup.append(tommlelt(f));
    msup.append(tommlelt(-1));
    mrow.append(msup);
    amml.append(mrow);
    
    amml.append(tommlelt('&colon;').attr('lspace',"0.1111111111111111em"));
    amml.append(tommlelt(v));
    amml.append(tommlelt('&map;').attr('lspace', "0.2222222222222222em"));

    p = math.subtract(math.square(math.divide(b,math.multiply(2,a))),
		      math.divide(c,a));
    q = math.divide(1,a);
    r = math.unaryMinus(math.divide(b, math.multiply(2,a)));
    
    var mrow = mmlelt('mrow');

    addNumber(r,atexa, mrow);
    if (math.compare(r,0) != 0) {
	atexa.push(' + ');
	mrow.append(tommlelt('+'));
    }
p
    var msqrt = mmlelt('msqrt');
    var msqrtrow = mmlelt('mrow');
    atexa.push('\\sqrt{');

    addCoefficient(q,atexa,msqrtrow);
    atexa.push(v);
    msqrtrow.append(tommlelt(v));
    
    addSignedNumber(p,atexa,msqrtrow);

    msqrt.append(msqrtrow);
    mrow.append(msqrt);

    amml.append(mrow);

//    console.log(amml);
    question.qdiv.append(qmml);
    question.adiv.append(amml);
    
    question.qtex =
	'Find the inverse of \\('
	+
	qtexa.join('')
	+
	'\\)';
    question.atex =
	'\\('
	+
	atexa.join('')
	+
	'\\)';
    question.qmkd =
	'Find [m]'
	+
	qtexa.join('')
	+
	'[/m]';
    question.amkd =
	'[m]'
	+
	atexa.join('')
	+
	'[/m]';

    return this;
}
