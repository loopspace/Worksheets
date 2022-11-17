
/*
Question type: Solve a quadratic by completing the square
*/


QuadIneqCplt = new QuestionGenerator(
    "Quadratics",
    "Quadratics",
    "quad6",
    "QuadIneqCplt",
    ["0:0:0"]
);

QuadIneqCplt.explanation = function() {
    return 'Solve the following quadratic inequalities.';
}
QuadIneqCplt.shortexp = function() {
    return 'Solve by completing the square ';
}

QuadIneqCplt.addOption("p","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>","p","string","1");
QuadIneqCplt.addOption("q","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>q</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>","q","string","-5:5");
QuadIneqCplt.addOption("r","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>r</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>","r","string","-5:5");
QuadIneqCplt.addOption("l","Allow non-zero terms on right-hand side", "l", "boolean", "false"); 
QuadIneqCplt.addOption("v","Range for letters used for variables","v","string","x");

QuadIneqCplt.createQuestion = function(question) {
    var p = 0,q = 0, r = 0;
    var sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;
    var rhs;
    var a,b,c;
    var v;

    do {
	p = randomFromRange(this.p,this.prng());
	q = randomFromRange(this.q,this.prng());
	r = randomFromRange(this.r,this.prng());
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (p == 0 || !math.equal(commonTerms(p,r),1) || this.checkQn([ p, q, r]))

    this.registerQn([ p, q,r ]);

    var inequality = Math.floor(Math.random()*4);

    v = randomLetterFromRange(this.v, this.prng());
    
    a = p;
    b = 2*p*q;
    c = p * q**2 + r;
    
    qtexa = ['\\('];
    atexa = [];
    coeffn = addCoefficient;
    numbfn = addNumber;

    var qmml = mmlelt('math').attr('display','inline');

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

    addPolynomial(lhs, qtexa, qmml, v);
    switch (inequality) {
    case 0:
	qtexa.push(' \\le ');
	qmml.append(tommlelt('&le;'));
	break;
    case 1:
	qtexa.push(' \\lt ');
	qmml.append(tommlelt('&lt;'));
	break;
    case 2:
	qtexa.push(' \\ge ');
	qmml.append(tommlelt('&ge;'));
	break;
    case 3:
	qtexa.push(' \\gt ');
	qmml.append(tommlelt('&gt;'));
	break;
    }
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

    var amml;
    
    if (p < 0) {
	p = - p;
	r = - r;
	inequality ^= 2;
    }
    
    if (r > 0) {
	if (inequality < 2) {
	    question.adiv.append($('<span>').html("No solution."));
	    atexa.push('No solution.');
	} else {
	    question.adiv.append($('<span>').html("All of the real line."));
	    atexa.push('All of the real line.');
	}
    } else if (r == 0) {
	switch(inequality) {
	case 0:
	    question.adiv.append($('<span>').html("Only "));
	    atexa.push('Only ');
	    amml = mmlelt('math').attr('display','inline');
	    amml.append(tommlelt(v));
	    amml.append(tommlelt('='));
	    amml.append(tommlelt(-q));
	    atexa.push('\\( ' + v + ' = ');
	    atexa.push(texnum(-q));
	    atexa.push('\\)');
	    break;
	case 1:
	    question.adiv.append($('<span>').html("No solution."));
	    atexa.push('No solution.');
	    break;
	case 2:
	    question.adiv.append($('<span>').html("All of the real line."));
	    atexa.push('All of the real line.');
	    break;
	case 3:
	    question.adiv.append($('<span>').html("All except "));
	    atexa.push('All except ');
	    amml = mmlelt('math').attr('display','inline');
	    amml.append(tommlelt(v));
	    amml.append(tommlelt('='));
	    amml.append(tommlelt(-q));
	    atexa.push('\\( ' + v + ' = ');
	    atexa.push(texnum(-q));
	    atexa.push('\\)');
	    break;
	}
	question.adiv.append(amml);
    } else {
	r = - r;
	q = - q;
	amml = mmlelt('math').attr('display','inline');
	atexa.push('\\(');

	if (inequality > 1) {
	    amml.append(tommlelt(v));
	    atexa.push(v);
	    if (inequality == 2) {
		atexa.push(' \\le ');
		amml.append(tommlelt('&le;'));
	    } else {
		atexa.push(' \\lt ');
		amml.append(tommlelt('&lt;'));
	    }
	}
	
	var a = math.fraction(math.divide(r,p));
	var sqt;
	if (hasSquareRoot(a)) {
	    sqt = squareRoot(a);
	    atexa.push(texnum(math.fraction(math.subtract(q,sqt))));
	    amml.append(tommlelt(math.fraction(math.subtract(q,sqt))));
	} else {
	    addNumber(q,atexa,amml);
	    atexa.push(' - ');
	    atexa.push('\\sqrt{' + texnum(a) + '}');
	    amml.append(tommlelt('-'));
	    amml.append(mmlelt('msqrt').append(tommlelt(a)));
	}

	if (inequality > 1) {
	    atexa.push('\\)');
	    atexa.push(', ');
	    atexa.push('\\(');
	    question.adiv.append(amml);
	    question.adiv.append($('<span>').addClass("separator").html(", "));
	    amml = mmlelt('math').attr('display','inline');
	    
	    amml.append(tommlelt(v));
	    atexa.push(v);
	    if (inequality == 2) {
		atexa.push(' \\ge ');
		amml.append(tommlelt('&ge;'));
	    } else {
		atexa.push(' \\gt ');
		amml.append(tommlelt('&gt;'));
	    }
	} else {
	    if (inequality == 0) {
		atexa.push(' \\le ');
		amml.append(tommlelt('&le;'));
	    } else {
		atexa.push(' \\lt ');
		amml.append(tommlelt('&lt;'));
	    }
	    atexa.push(v);
	    amml.append(tommlelt(v));
	    if (inequality == 0) {
		atexa.push(' \\le ');
		amml.append(tommlelt('&le;'));
	    } else {
		atexa.push(' \\lt ');
		amml.append(tommlelt('&lt;'));
	    }
	}

	if (hasSquareRoot(a)) {
	    atexa.push(texnum(math.fraction(math.add(q,sqt))));
	    amml.append(tommlelt(math.fraction(math.add(q,sqt))));
	} else {
	    addNumber(q,atexa,amml);
	    if (!math.equal(q,0)) {
		atexa.push(' + ');
		amml.append(tommlelt('+'));
	    }
	    atexa.push('\\sqrt{' + texnum(a) + '}');
	    amml.append(mmlelt('msqrt').append(tommlelt(a)));
	}
	
    }
    atexa.push('\\)');
    question.adiv.append(amml);
    
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');
    return this;
}
