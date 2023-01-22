/*
Question type: Find the inverse of a rational function of the form (ax + b)/(cx + d)
*/

RatInverse = new QuestionGenerator(
    "Functions",
    "Invert a Rational Function",
    "funct1",
    "RatInverse",
    ["0:0:0:0"]
);

RatInverse.explanation = function() {
    return 'Find the inverse of the following rational functions.';
}
RatInverse.shortexp = function() {
    return 'Invert ';
}

RatInverse.addOption("a","Range for the coefficients","a","string","-5:5");
RatInverse.addOption("v","Range for letters used for variables","v","string","x");
RatInverse.addOption("f","Range for letters used for functions","f","string","f");

RatInverse.createQuestion = function(question) {
    var a,b,c,d,v,f;
    var det, sgn, cf;
    var qtexa,atexa;
    var nqn = 0;
    var num,den;

    do {
	a = randomFromRange(this.a,this.prng());
	b = randomFromRange(this.a,this.prng());
	c = randomFromRange(this.a,this.prng());
	d = randomFromRange(this.a,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
	sgn = [a,b,c,d].reduce( (s,v) => s + math.compare(v,0));
	if (sgn < 0) {
	    [a,b,c,d] = [a,b,c,d].map(x => math.unaryMinus(x));
	}
	if ([a,b,c,d].reduce( (s,v) => s && math.isInteger(v))) {
	    [a,b,c,d] = [a,b,c,d].map(x => math.number(x));
	    cf = math.gcd(a,b,c,d);
	    [a,b,c,d] = [a,b,c,d].map(x => math.divide(x,cf));
	}
	det = math.subtract( math.multiply(a,d), math.multiply(b,c));
    } while (math.isZero(det) || this.checkQn([ a, b, c, d]))

    this.registerQn([ a, b,  c, d]);

    f = randomLetterFromRange(this.f, this.prng());
    v = randomLetterFromRange(this.v, this.prng());

    sgn = 1;

    if (!math.isPositive(a) && !math.isPositive(b)) {
	sgn *= -1;
	a = math.unaryMinus(a);
	b = math.unaryMinus(b);
	num = [ [a,1], [b,0] ];
    } else if (math.isNegative(a)) {
	num = [ [b,0], [a,1] ];
    } else {
	num = [ [a,1], [b,0] ];
    }
    
    if (!math.isPositive(c) && !math.isPositive(d)) {
	sgn *= -1;
	c = math.unaryMinus(c);
	d = math.unaryMinus(d);
	den = [ [c,1], [d,0] ];
    } else if (math.isNegative(c)) {
	den = [ [d,0], [c,1] ];
    } else {
	den = [ [c,1], [d,0] ];
    }

    qtexa = [];
    
    var qmml = mmlelt('math').attr('display','inline');
    
    qtexa.push(f + ' \\colon ' + v + ' \\mapsto ');
    qmml.append(tommlelt(f));
    qmml.append(tommlelt('&colon;').attr('lspace',"0.1111111111111111em"));
    qmml.append(tommlelt(v));
    qmml.append(tommlelt('&map;').attr('lspace', "0.2222222222222222em"));

    if (sgn == -1) {
	qtexa.push(' - ');
	qmml.append(tommlelt('-'));
    }

    var mfrac, mrow;
    
    if (math.isZero(c) && math.isEqual(d,1)) {
	addPolynomial(num, qtexa, qmml, v);
    } else {
	mfrac = mmlelt('mfrac');
	mrow = mmlelt('mrow');

	qtexa.push('\\frac{');
	addPolynomial(num, qtexa, mrow, v);
	qtexa.push('}{');
	
	mfrac.append(mrow);
	mrow = mmlelt('mrow');

	addPolynomial(den, qtexa, mrow, v);

	qtexa.push('}');
	mfrac.append(mrow);
	qmml.append(mfrac);
    }    

    if (sgn == 1) {
	b = math.unaryMinus(b);
    } else {
	a = math.unaryMinus(a);
    }
    c = math.unaryMinus(c);
    sgn = [a,b,c,d].reduce( (s,v) => s + math.compare(v,0));
    if (sgn < 0) {
	[a,b,c,d] = [a,b,c,d].map(x => math.unaryMinus(x));
    }

    sgn = 1;
    
    if (!math.isPositive(d) && !math.isPositive(b)) {
	sgn *= -1;
	d = math.unaryMinus(d);
	b = math.unaryMinus(b);
	num = [ [d,1], [b,0] ];
    } else if (math.isNegative(d)) {
	num = [ [b,0], [d,1] ];
    } else {
	num = [ [d,1], [b,0] ];
    }
    
    if (math.isNegative(c) && math.isNegative(a)) {
	sgn *= -1;
	c = math.unaryMinus(c);
	a = math.unaryMinus(a);
	den = [ [c,1], [a,0] ];
    } else if (math.isNegative(c)) {
	den = [ [a,0], [c,1] ];
    } else {
	den = [ [c,1], [a,0] ];
    }
    
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

    if (sgn == -1) {
	atexa.push(' - ');
	amml.append(tommlelt('-'));
    }
    
    if (math.isZero(c) && math.isEqual(a,1)) {
	addPolynomial(den, atexa, amml, v);
    } else {
	mfrac = mmlelt('mfrac');
	mrow = mmlelt('mrow');

	atexa.push('\\frac{');
	addPolynomial(num, atexa, mrow, v);
	atexa.push('}{');
	
	mfrac.append(mrow);
	mrow = mmlelt('mrow');

	addPolynomial(den, atexa, mrow, v);

	atexa.push('}');
	mfrac.append(mrow);
	amml.append(mfrac);
    }    
    
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
