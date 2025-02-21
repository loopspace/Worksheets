
// Simultaneous equations

SimEqSolve = new QuestionGenerator (
    "Equations",
    "Simultaneous Equations",
    "eq2",
    "SimEqSolve",
    ["0:0:0:0:0:0"]
);

SimEqSolve.explanation = function() {
    return 'Solve each pair of equations';
}
SimEqSolve.shortexp = function() {
    return 'Solve ';
}

SimEqSolve.addOption("a","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mi>y</mi><mo>=</mo><mi>c</mi></math>","a","string","-5:5");
SimEqSolve.addOption("b","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mi>y</mi><mo>=</mo><mi>c</mi></math>","b","string","-5:5");
SimEqSolve.addOption("x","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> and <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mi>y</mi><mo>=</mo><mi>c</mi></math>","x","string","-5:5");
SimEqSolve.addOption("v","Range for letters used for variables","v","string","x");

SimEqSolve.createQuestion = function(question) {
    var a = 0, b = 0, c = 0, d = 0, x = 0, y = 0, u = "", v = "";
    var e, f;
    var p,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;
    var bail = false;

    do {
	a = randomFromRange(this.a,this.prng());
	b = randomFromRange(this.b,this.prng());
	c = randomFromRange(this.a,this.prng());
	d = randomFromRange(this.b,this.prng());
	x = randomFromRange(this.x,this.prng());
	y = randomFromRange(this.x,this.prng());
	nqn++;
	if (nqn > 10) {
	    if (bail) { return false; }
	    this.resetSaved();
	    nqn = 0;
	    bail = true;
	}
    } while (
	math.equal(math.multiply(a,b,c,d),0)
	    || math.equal(math.multiply(a,d), math.multiply(b,c))
	    || this.checkQn([ a, b, c, d, x, y ])
    )
    
    this.registerQn([ a, b, c, d, x, y ])

    u = randomLetterFromRange(this.v, this.prng());
    v = u;

    nqn = 0;
    do {
	v = randomLetterFromRange(this.v,this.prng());
	nqn++;
	if (u == v && nqn > 10) {
	    u = nextletter(v);
	}
    } while (u == v);


    while (v == u) {
	v = randomLetterFromRange(this.v, this.prng());
	nqn++;
	if (nqn > 10) {
	    return false;
	}
    }
    e = math.add(
	math.multiply(a, x),
	math.multiply(b, y)
    );
    f = math.add(
	math.multiply(c, x),
	math.multiply(d, y)
    );
    
    question.qdiv = $('<div>').addClass('question').addClass('extraSpace');
    question.adiv = $('<div>').addClass('answer');
    qtexa = ['\\begin{align*}'];
    atexa = [];

    var qmml = mmlelt('math').attr('display','inline');
    var mtable = mmlelt('mtable').attr('displaystyle','true')
	.attr('columnalign','right left right left right left')
	.attr('columnspacing','verythinmathspace')
    qmml.append(mtable);

    var mtd, mrow;

    mrow = mmlelt('mtr');
    mtable.append(mrow);
    mtd = mmlelt('mtd');
    mrow.append(mtd);

    addCoefficient(a, qtexa, mtd);
    mtd.append(tommlelt(u));
    qtexa.push(u);
    
    mtd = mmlelt('mtd');
    mrow.append(mtd);
    qtexa.push('&');
    addSignofCoefficient(b, qtexa, mtd);

    mtd = mmlelt('mtd');
    mrow.append(mtd);
    qtexa.push('&');
    addUnsignedCoefficient(b, qtexa, mtd);
    mtd.append(tommlelt(v));
    qtexa.push(v);
    
    mtd = mmlelt('mtd');
    mrow.append(mtd);
    mtd.append(tommlelt('='));
    mtd.append(tommlelt(e));
    qtexa.push('&=');
    qtexa.push(texnum(e));
    qtexa.push('\\\\');

    mrow = mmlelt('mtr');
    mtable.append(mrow);
    mtd = mmlelt('mtd');
    mrow.append(mtd);

    addCoefficient(c, qtexa, mtd);
    mtd.append(tommlelt(u));
    qtexa.push(u);
    
    mtd = mmlelt('mtd');
    mrow.append(mtd);
    qtexa.push('&');
    addSignofCoefficient(d, qtexa, mtd);

    mtd = mmlelt('mtd');
    mrow.append(mtd);
    qtexa.push('&');
    addUnsignedCoefficient(d, qtexa, mtd);
    mtd.append(tommlelt(v));
    qtexa.push(v);
    
    mtd = mmlelt('mtd');
    mrow.append(mtd);
    mtd.append(tommlelt('='));
    mtd.append(tommlelt(f));
    qtexa.push('&=');
    qtexa.push(texnum(f));
    
    question.qdiv.append(qmml);
    qtexa.push('\\end{align*}');
    
    var amml = mmlelt('math').attr('display','inline');
    atexa.push('\\(');

    amml.append(tommlelt(u));
    atexa.push(u);
    
    amml.append(tommlelt('='));
    atexa.push('=');
    
    amml.append(tommlelt(x));
    atexa.push(x);
    
    question.adiv.append(amml);
    question.adiv.append($('<span>').addClass("separator").html(','));
    atexa.push('\\), ');

    amml = mmlelt('math').attr('display','inline');
    atexa.push('\\(');

    amml.append(tommlelt(v));
    atexa.push(v);
    
    amml.append(tommlelt('='));
    atexa.push('=');
    
    amml.append(tommlelt(y));
    atexa.push(y);
    
    question.adiv.append(amml);
    atexa.push('\\)');
    
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');
    
    return this;
}

