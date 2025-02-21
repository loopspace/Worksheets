
/*
  Question type: Solve a quadratic using factorisation
*/

QuadSolveFact = new QuestionGenerator(
    "Quadratics",
    "Quadratics",
    "quad1",
    "QuadSolveFact",
    ["0:0:0:0"]
);

QuadSolveFact.explanation = function() {
    return 'Solve each quadratic equation.';
}
QuadSolveFact.shortexp = function() {
    return 'Solve by factorising ';
}

QuadSolveFact.addOption("a","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>","a","string","1");
QuadSolveFact.addOption("b","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>","b","string","-5:5");
QuadSolveFact.addOption("c","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>","c","string","1");
QuadSolveFact.addOption("d","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>d</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>","d","string","-5:5");
QuadSolveFact.addOption("l","Allow non-zero terms on right-hand side", "l", "boolean", "false"); 
QuadSolveFact.addOption("v","Range for letters used for variables","v","string","x");


QuadSolveFact.createQuestion = function(question) {

    var a,b,c,d,v;
    var p,q,r;
    var p,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	b = randomFromRange(this.b,this.prng());
	c = randomFromRange(this.c,this.prng());
	d = randomFromRange(this.d,this.prng());

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

	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (!math.equal(commonTerms(a,b),1) || !math.equal(commonTerms(c,d),1) || a == 0 || c == 0 || b*d == 0 || this.checkQn([ a, b, c, d]))

    this.registerQn([ a, b, c, d]);

    v = randomLetterFromRange(this.v, this.prng());

    p = math.multiply(a,c);
    q = math.add( math.multiply(a,d), math.multiply(b,c));
    r = math.multiply(b,d);
    
    qtexa = ['\\('];
    atexa = [];

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
    
    coeffn = addCoefficient;
    numbfn = addNumber;

    var amml = mmlelt('math').attr('display','inline');
    atexa = ['\\('];

    p = math.fraction(math.divide(-b,a));

    atexa.push(v + ' = ');
    atexa.push(texnum(p));
    atexa.push('\\), ');

    amml.append(tommlelt(v));
    amml.append(tommlelt('='));
    amml.append(tommlelt(p));
    question.adiv.append(amml);
    question.adiv.append($('<span>').addClass("separator").html(", "));
    
    amml = mmlelt('math').attr('display','inline');
    atexa.push('\\(');

    p = math.fraction(math.divide(-d,c));

    atexa.push(v + ' = ');
    atexa.push(texnum(p));
    atexa.push('\\)');
    
    amml.append(tommlelt(v));
    amml.append(tommlelt('='));
    amml.append(tommlelt(p));
    question.adiv.append(amml);

    question.qtex =  qtexa.join('');
    question.atex = atexa.join('');
    return this;
}
