
/*
Question type: Solve a quadratic using the formula
*/

QuadFormula = new QuestionGenerator(
    "Quadratics",
    "Quadratics",
    "quad4",
    "QuadFormula",
    ["0:0:0"]
);

QuadFormula.explanation = function() {
    return 'Solve the following quadratic equations.';
}
QuadFormula.shortexp = function() {
    return 'Solve ';
}

QuadFormula.addOption("a","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>","a","string","1");
QuadFormula.addOption("b","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>","b","string","-5:5");
QuadFormula.addOption("c","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>","c","string","-5:5");
QuadFormula.addOption("l","Allow non-zero terms on right-hand side", "l", "boolean", "false"); 
QuadFormula.addOption("v","Range for letters used for variables","v","string","x");

QuadFormula.createQuestion = function(question) {
    var a,b,c,v;
    var p,q,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	b = randomFromRange(this.b,this.prng());
	c = randomFromRange(this.c,this.prng());
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (a == 0 || this.checkQn([ a, b, c]))

    this.registerQn([ a, b,  c]);

    v = randomLetterFromRange(this.v, this.prng());
    
    var lhs = [ [a,2], [b,1], [c,0] ];
    var rhs = [];

    var l;
    if (this.l) {
	l = Math.floor(Math.random()*3);
	rhs = lhs.slice(3-l);
	lhs = lhs.slice(0,3-l);
	for (var i = 0; i < rhs.length; i++) {
	    rhs[i][0] *= -1;
	}
    }

    qtexa = ['\\('];
    atexa = [];
    
    var qmml = mmlelt('math').attr('display','inline');
    
    addPolynomial(lhs, qtexa, qmml, v);

    qtexa.push(' = ');
    qmml.append(tommlelt('='));
    
    if (rhs.length > 0) {
	if (!addPolynomial(rhs, qtexa, qmml, v)) {
	    qtexa.push(texnum(0));
	    qmml.append(tommlelt(0));
	};
    } else {
	qtexa.push(texnum(0));
	qmml.append(tommlelt(0));
    }

    question.qdiv.append(qmml);
    qtexa.push('\\)');

    var amml;
    numbfn = addNumber;
    coeffn = addCoefficient;

    p = math.subtract(math.multiply(b,b),
		      math.multiply(4, math.multiply(a,c)));

    if (p < 0) {
	question.adiv.append($('<span>').html("No solution: "));
	amml = mmlelt('math').attr('display','inline');
	amml.append(
	    mmlelt('msup').append(
		tommlelt('b')
	    ).append(
		tommlelt('2')
	    )
	);
	amml.append(tommlelt('-'));
	amml.append(tommlelt(4));
	amml.append(tommlelt('a'));
	amml.append(tommlelt('c'));
	amml.append(tommlelt('='));
	amml.append(tommlelt(p));
	question.adiv.append(amml);

	atexa.push('No solution: \\(b^2 - 4 a c = ' + texnum(p) + '\\).');
    } else {
	amml = mmlelt('math').attr('display','inline');
	amml.append(tommlelt(v));
	amml.append(tommlelt('='));
	atexa.push('\\( ' + v + ' = ');

	if (p != 0) {

	    var pd = primeDecomposition(p);
	    var nsq = 1;
	    var sq = 1;

	    var l;
	    for (var i = 0; i < pd.length; i++) {
		l = pd[i][1];
		if (l%2 == 1) {
		    sq *= pd[i][0];
		    l--;
		}
		l /= 2;
		for (var j = 0; j < l; j++) {
		    nsq *= pd[i][0];
		}
	    }

	    if (sq == 1) {
		q = math.fraction(math.divide(-b + nsq,2*a));
		amml.append(tommlelt(q));
		atexa.push(texnum(q));


		atexa.push('\\), \\(' + v + ' = ');
		question.adiv.append(amml);
		question.adiv.append($('<span>').addClass("separator").html(", "));
		
		amml = mmlelt('math').attr('display','inline');
		amml.append(tommlelt(v));
		amml.append(tommlelt('='));
		
		q = math.fraction(math.divide(-b - nsq,2*a));
		amml.append(tommlelt(q));
		atexa.push(texnum(q));
	    } else {
		q = math.fraction(math.divide(-b,2*a));
		numbfn(q,atexa,amml);
		
		amml.append(tommlelt('&plusmn;'));
		atexa.push(' \\pm ');

		q = math.fraction(math.divide(nsq,math.abs(2*a)));
		coeffn(q,atexa,amml);
		
		amml.append(
		    mmlelt('msqrt')
			.append(mmlelt('mrow')
				.append(tommlelt(sq))
			       )
		);

		atexa.push('\\sqrt{');
		atexa.push(sq);
		atexa.push('}');
	    }
	    atexa.push('\\)');
	    question.adiv.append(amml);
	} else {
	    q = math.fraction(math.divide(-b,2*a));
	    amml.append(tommlelt(q));
	    atexa.push(texnum(q));

	    question.adiv.append(amml);
	    question.adiv.append($('<span>').html(" repeated."));
	    atexa.push('\\)');
	    atexa.push(' repeated.');
	    
	}
    }
    
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');
    return this;
}
