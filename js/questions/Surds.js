/*
  Question Type: Simplify Surds
*/

// Simplify an expression involving surds

// Template:
//   (a + b \sqrt{c}) (d + e \sqrt{c})
//      = a d + b e c + (a e + b d) \sqrt{c}

Surds = new QuestionGenerator(
    "Arithmetic",
    "Simplify Surds",
    "arith16",
    "Surds",
    []
);

Surds.explanation = function() {
    return 'Simplify fully the following expressions';
}

Surds.shortexp = function() {
    return 'Simplify fully';
}

Surds.addOption("a","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><semantics><mrow><mi>a</mi><mo>+</mo><mi>b</mi><msqrt><mi>c</mi></msqrt></mrow><annotation encoding='application/x-tex'>a + b \sqrt{c}</annotation></semantics></math>", "a", "string", "-5:5");
Surds.addOption("b","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><semantics><mrow><mi>a</mi><mo>+</mo><mi>b</mi><msqrt><mi>c</mi></msqrt></mrow><annotation encoding='application/x-tex'>a + b \sqrt{c}</annotation></semantics></math>", "b", "string", "-5:5");
Surds.addOption("c","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><semantics><mrow><mi>a</mi><mo>+</mo><mi>b</mi><msqrt><mi>c</mi></msqrt></mrow><annotation encoding='application/x-tex'>a + b \sqrt{c}</annotation></semantics></math>", "c", "string", "2,3,5,7,11,13");

Surds.createQuestion = function(question) {
    var qtexa,atexa;
    var nqn = 0;
    var q = [];

    var a,b,c;
    var n = 2;

    var nq;

    do {
	c = randomFromRange(this.c,this.prng());
	nqn++;
	if (nqn == 10) {
	    return false;
	}
    } while (c <= 0)
    
    do {
	for (var i = 0; i < n; i++) {
	    nq = 0;
	    do {
		a = randomFromRange(this.a,this.prng());
		b = randomFromRange(this.b,this.prng());
		nq++;
		if (nq == 10) {
		    // bail out - too many zeros
		    return false;
		}
	    } while (b == 0)
	    q.push([a,b,c]);
	}
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (this.checkQn(q));
    
    this.registerQn(q);

    qtexa = ['\\('];
    atexa = ['\\('];

    var qmml = mmlelt('math').attr('display','inline');

    var bkts = true;
    
    for (var i = 0; i < q.length; i++) {
	if (q[i][0] != 0) {
	    qtexa.push('\\left(');
	    qmml.append(tommlelt('('));
	    bkts = true;
	} else {
	    if (!bkts) {
		qtexa.push('\\times');
		qmml.append(tommlelt('&times;'));
	    }
	    bkts = false;
	}
	addNumber(q[i][0],qtexa,qmml);
	if (q[i][0] != 0) {
	    addSignedCoefficient(q[i][1],qtexa,qmml);
	} else {
	    addCoefficient(q[i][1],qtexa,qmml);
	}
	addPower(c,math.fraction(math.divide(1,2)),qtexa,qmml,true);
	if (q[i][0] != 0) {
	    qtexa.push('\\right)');
	    qmml.append(tommlelt(')'));
	}
    }

    question.qdiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');

    var a = [1,0];
    for (var i = 0; i < q.length; i++) {
	a = [
	    math.add(
		math.multiply(a[0],q[i][0]),
		math.multiply(c,
			      math.multiply(a[1],q[i][1]))
	    ),
	    math.add(
		math.multiply(a[0],q[i][1]),
		math.multiply(a[1],q[i][0])
	    )
	];
    }

    addNumber(a[0],atexa,amml);
    if (a[0] != 0) {
	if (addSignedCoefficient(a[1],atexa,amml)) {
	    addPower(c,math.fraction(math.divide(1,2)),atexa,amml,true);
	};
    } else {
	if (addCoefficient(a[1],atexa,amml)) {
	    addPower(c,math.fraction(math.divide(1,2)),atexa,amml,true);
	};
    }

    
    question.adiv.append(amml);
    
    question.qtex =
	'\\('
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
	'[m]'
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
};
