
/*
Question type: Solve a quadratic by completing the square
*/


QuadSolveCplt = new QuestionGenerator(
    "Quadratics",
    "Quadratics",
    "quad3",
    "QuadSolveCplt",
    ["0:0:0"]
);

QuadSolveCplt.explanation = function() {
    return 'Solve the following quadratic equations.';
}
QuadSolveCplt.shortexp = function() {
    return 'Solve by completing the square ';
}

QuadSolveCplt.addOption("p","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>","p","string","1");
QuadSolveCplt.addOption("q","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>q</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>","q","string","-5:5");
QuadSolveCplt.addOption("r","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>r</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>","r","string","-5:5");

QuadSolveCplt.createQuestion = function(question) {
    var p = 0,q = 0, r = 0;
    var a,sep,qtexa,atexa,coeffn,numbfn;
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
    } while (p == 0 || !math.equal(commonTerms(p,r),1) || this.checkQn([ p, q, r]))

    this.registerQn([ p, q,r ]);
    
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
    if (coeffn(2*p*q,qtexa,qmml)) {
	qtexa.push(' x ');
	qmml.append(tommlelt('x'));

	coeffn = addSignedCoefficient;
	numbfn = addSignedNumber;
    }

    numbfn(p * q**2 + r,qtexa,qmml);
    qmml.append(tommlelt('='));
    qmml.append(tommlelt(0));

    question.qdiv.append(qmml);
    qtexa.push(' = 0\\)');

    var amml;
    
    if (p < 0) {
	p = - p;
	r = - r;
    }
    
    if (r > 0) {
	question.adiv.append($('<span>').html("No solution."));
	atexa = ['No solution.'];
    } else {
	r = - r;
	q = - q;
	amml = mmlelt('math').attr('display','inline');
	amml.append(tommlelt('x'));
	amml.append(tommlelt('='));
	atexa = ['\\( x = '];

	var a = math.fraction(math.divide(r,p));
	if (hasSquareRoot(a)) {
	    a = squareRoot(a);
	    var b = math.fraction(math.add(q,a));
	    amml.append(tommlelt(b));
	    atexa.push(texnum(b));

	    atexa.push('\\)');

	    question.adiv.append(amml);
	    if (a == 0) {
		question.adiv.append(amml);
		question.adiv.append($('<span>').html(" repeated."));
		atexa.push(' repeated.');
	    } else {
		question.adiv.append($('<span>').addClass("separator").html(", "));
		
		amml = mmlelt('math').attr('display','inline');
		amml.append(tommlelt('x'));
		amml.append(tommlelt('='));
		
		var b = math.fraction(math.subtract(q,a));
		amml.append(tommlelt(b));
		atexa.push(', \\(x = ');
		atexa.push(texnum(b));
		atexa.push('\\)');
		question.adiv.append(amml);
	    }

	} else {
	    
	    if (q != 0) {
		amml.append(tommlelt(q));
		atexa.push(q);
	    }

	    
	    if (r != 0) {
		var b = math.fraction(math.divide(r,p));
		amml.append(tommlelt('&plusmn;'));
		amml.append(
		    mmlelt('msqrt').append(tommlelt(b))
		);
		atexa.push('\\pm \\sqrt{' + texnum(b) + '}');
	    }
	    atexa.push('\\)');
	    question.adiv.append(amml);
	}
    }
    
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');
    return this;
}
