/*
  Question Type: Calculus
*/

//  Differentiate an Expression

DiffExp = new QuestionGenerator(
    "Calculus",
    "Differentiate Expression",
    "calc0",
    "DiffExp",
    ["0:0"]
);

DiffExp.explanation = function() {
    return '';
}
DiffExp.shortexp = function() {
    return '';
}

DiffExp.addOption("n","Range for number of terms","n","string","3:5");
DiffExp.addOption("a","Range for coefficients of terms","a","string","1:9");
DiffExp.addOption("p","Range for powers in terms","p","string","0:7");
DiffExp.addOption("f","Use fractions for negative powers","f","boolean",false);
DiffExp.addOption("r","Use roots for fractional powers","r","boolean",false);
DiffExp.addOption("v","Range for letters used for variable in expression","v","string","x");
DiffExp.addOption("u","Range for letters used for name of expression","u","string","y");

DiffExp.createQuestion = function(question) {
    var a,p,u,v;
    var qtexa,atexa;
    var nqn = 0;
    var q, qs, ps;
    var n = 0;
    do {
	n = randomFromRange(this.n,this.prng());
	nqn++;
	if (n < 1 && nqn > 10) {
	    n = 2;
	    nqn = 0;
	}
    } while (n < 1);
    
    nqn = 0;
    var nqa;
    do {
	q = [];
	qs = [];
	ps = [];
	for (var i = 0; i < n; i++) {
	    nqa = 0;
	    do {
		a = randomFromRange(this.a,this.prng());
		nqa++;
		if (a == 0 && nqa > 10) {
		    a = 1;
		}
	    } while (a == 0);
	    nqa = 0;
	    do {
		p = randomFromRange(this.p,this.prng());
		nqa++;
	    } while (nqa <= 10 && ps.indexOf(p.toString()) != -1);
	    q.push([a,p]);
	    ps.push(p.toString());
	}
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
	q.sort(function(a,b) { return b[1] - a[1] });
	for (var j = 0; j < q.length; j++) {
	    qs.push(q[j].join(","));
	}
    } while (this.checkQn(qs))

    this.registerQn(qs);

    v = randomLetterFromRange(this.v,this.prng());
    nqn = 0;
    do {
	u = randomLetterFromRange(this.u,this.prng());
	nqn++;
	if (u == v && nqn > 10) {
	    u = nextletter(v);
	}
    } while (u == v);
    
    question.qdiv = $('<div>').addClass('question');
    question.adiv = $('<div>').addClass('answer');
    qtexa = []
    atexa = [];

    var dmml, deriv, delt, drow;

    dmml = mmlelt('math').attr('display','inline');
    deriv = mmlelt('mrow');
    delt = mmlelt('mfrac');

    drow = mmlelt('mrow');
    drow.append(tommlelt('d'));
    drow.append(tommlelt(u));
    delt.append(drow);

    drow = mmlelt('mrow');
    drow.append(tommlelt('d'));
    drow.append(tommlelt(v));
    delt.append(drow);

    deriv.append(delt);
    dmml.append(deriv);
    
    question.qdiv.append(
	$('<span>').append('Find ')
    ).append(dmml).append(
	$('<span>').append(' where ')
    );
    
    var qmml = mmlelt('math').attr('display','inline');

    qmml.append(tommlelt(u)).append(tommlelt('='));
    qtexa.push(u);
    qtexa.push('=');

    addPolynomial(q,qtexa,qmml,v,this.f,this.r);
    question.qdiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');

    amml.append(deriv.clone());
    amml.append(tommlelt('='));
    atexa.push('\\frac{d' + u + '}{d' + v + '} = ');
    var a = [];
    for (var i = 0; i < n; i++) {
	if (q[i][1] != 0) {
	    a.push([math.multiply(q[i][1], q[i][0]), math.subtract(q[i][1], 1)]);
	}
    }

    if (a.length == 0) {
	atexa.push(texnum(0));
	amml.append(tommlelt(0));
    } else {
	addPolynomial(a,atexa,amml,v,this.f,this.r);
    }

    
    question.adiv.append(amml);
    
    question.qtex =
	'Find \\(\\frac{d' + u + '}{d' + v + '}\\) where \\('
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
	'Find [m]\\frac{d' + u + '}{d' + v + '}[/m] where [m]'
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
