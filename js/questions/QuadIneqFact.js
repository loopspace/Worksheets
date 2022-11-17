
/*
  Question type: Solve a quadratic inequality using factorisation
*/

QuadIneqFact = new QuestionGenerator(
    "Quadratics",
    "Quadratics",
    "quad5",
    "QuadIneqFact",
    ["0:0:0:0"]
);

QuadIneqFact.explanation = function() {
    return 'Solve each quadratic inequality.';
}
QuadIneqFact.shortexp = function() {
    return 'Solve by factorising ';
}

QuadIneqFact.addOption("a","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>","a","string","1");
QuadIneqFact.addOption("b","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>","b","string","-5:5");
QuadIneqFact.addOption("c","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>","c","string","1");
QuadIneqFact.addOption("d","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>d</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>","d","string","-5:5");
QuadIneqFact.addOption("l","Allow non-zero terms on right-hand side", "l", "boolean", "false"); 
QuadIneqFact.addOption("v","Range for letters used for variables","v","string","x");


QuadIneqFact.createQuestion = function(question) {

    var a,b,c,d;
    var p,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;

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
    } while (!math.equal(commonTerms(a,b),1) || !math.equal(commonTerms(c,d),1) || a == 0 || c == 0 || b*d == 0 || this.checkQn([ a, b, c, d]))

    this.registerQn([ a, b, c, d]);
    var inequality = Math.floor(Math.random()*4);

    v = randomLetterFromRange(this.v, this.prng());

    p = math.multiply(a,c);
    q = math.add( math.multiply(a,d), math.multiply(b,c));
    r = math.multiply(b,d);
    
    qtexa = ['\\('];
    atexa = [];
    coeffn = addCoefficient;
    numbfn = addNumber;

    var qmml = mmlelt('math').attr('display','inline');

    var lhs = [ [p,2], [q,1], [r,0] ];
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
    qtexa.push('\\)');

    var amml;
    
    if (p < 0) {
	inequality ^= 2;
    }

    var alpha = math.fraction(math.divide(-b,a));
    var beta = math.fraction(math.divide(-d,c));

    if (beta < alpha) {
	var tmp = alpha;
	alpha = beta;
	beta = tmp;
    }
    
    if (alpha == beta) {
	switch(inequality) {
	case 0:
	    question.adiv.append($('<span>').html("Only "));
	    atexa.push('Only ');
	    amml = mmlelt('math').attr('display','inline');
	    amml.append(tommlelt(v));
	    amml.append(tommlelt('='));
	    amml.append(tommlelt(alpha));
	    atexa.push('\\( ' + v + ' = ');
	    atexa.push(texnum(alpha));
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
	    amml.append(tommlelt(alpha));
	    atexa.push('\\( ' + v + ' = ');
	    atexa.push(texnum(alpha));
	    atexa.push('\\)');
	    break;
	}
	question.adiv.append(amml);
    } else {
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
	
	atexa.push(texnum(alpha));
	amml.append(tommlelt(alpha));

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

	atexa.push(texnum(beta));
	amml.append(tommlelt(beta));
	
    }
    atexa.push('\\)');
    question.adiv.append(amml);
    
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');
    return this;
}
