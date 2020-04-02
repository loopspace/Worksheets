
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


QuadSolveFact.createQuestion = function(question) {

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
    } while (math.gcd(a,b,c,d) != 1 || a == 0 || c == 0 || b*d == 0 || this.checkQn([ a, b, c, d]))
    
    this.registerQn([ a, b, c, d]);
    
    qtexa = ['\\('];
    atexa = [];

    var qmml = mmlelt('math').attr('display','inline');

    coeffn = addCoefficient;
    numbfn = addNumber;

    if (coeffn(a * c, qtexa, qmml)) {
	qmml.append(
	    mmlelt('msup').append(
		tommlelt('x')
	    ).append(
		tommlelt('2')
	    )
	);
	qtexa.push( 'x^2');
	
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

    qmml.append(tommlelt('='));
    qmml.append(tommlelt(0));
    
    question.qdiv.append(qmml);
    qtexa.push(' = 0\\)');
    
    var amml = mmlelt('math').attr('display','inline');
    atexa = ['\\('];

    p = math.fraction(math.divide(-b,a));

    atexa.push('x = ');
    atexa.push(texnum(p));
    atexa.push('\\), ');

    amml.append(tommlelt('x'));
    amml.append(tommlelt('='));
    amml.append(tommlelt(p));
    question.adiv.append(amml);
    question.adiv.append($('<span>').addClass("separator").html(", "));
    
    amml = mmlelt('math').attr('display','inline');
    atexa.push('\\(');

    p = math.fraction(math.divide(-d,c));

    atexa.push('x = ');
    atexa.push(texnum(p));
    atexa.push('\\)');
    
    amml.append(tommlelt('x'));
    amml.append(tommlelt('='));
    amml.append(tommlelt(p));
    question.adiv.append(amml);

    question.qtex =  qtexa.join('');
    question.atex = atexa.join('');
    return this;
}
