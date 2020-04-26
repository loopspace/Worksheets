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
DiffExp.addOption("v","Range for letters used for variable in expression","v","string","x");
DiffExp.addOption("u","Range for letters used for name of expression","u","string","y");

DiffExp.createQuestion = function(question) {
    var a,p,u,v;
    var sep,qtexa,atexa,coeffn,numbfn;
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
	    } while (nqa <= 10 && ps.indexOf(p) != -1);
	    q.push([a,p]);
	    ps.push(p);
	}
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
	q.sort(function(a,b) { return b[1] - a[1] });
	for (var j = 0; j < q.length; j++) {
	    qs.push(q[j].join(","));
	}
    } while ( a == 0 || this.checkQn(qs))

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
    
    if (q[0][1] == 0) {
	addNumber(q[0][0], qtexa, qmml);
    } else {
	addCoefficient(q[0][0], qtexa, qmml);
	if (q[0][1] == 1) {
	    qmml.append(tommlelt(v));
	    qtexa.push(v);
	} else {
	    addPower(v, q[0][1], qtexa, qmml);
	}
    }
    
    for (var i = 1; i < n; i++) {
	if (q[i][1] == 0) {
	    addSignedNumber(q[i][0], qtexa, qmml);
	} else {
	    addSignedCoefficient(q[i][0], qtexa, qmml);
	    if (q[i][1] == 1) {
		qmml.append(tommlelt(v));
		qtexa.push(v);
	    } else {
		addPower(v, q[i][1], qtexa, qmml);
	    }
	}
    }
    
    question.qdiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');

    amml.append(deriv.clone());
    amml.append(tommlelt('='));
    atexa.push('\\frac{d' + u + '}{d' + v + '} = ');
    var a = [];
    for (var i = 0; i < n; i++) {
	if (q[i][1] != 0) {
	    a.push([q[i][1] * q[i][0], q[i][1] - 1]);
	}
    }

    if (a.length == 0) {
	a.push([0,0]);
    }
    
    if (a[0][1] == 0) {
	if (a.length == 1) {
	    atexa.push(texnum(a[0][0]));
	    amml.append(tommlelt(a[0][0]));
	} else {
	    addNumber(a[0][0], atexa, amml);
	}
    } else {
	addCoefficient(a[0][0], atexa, amml);
	if (a[0][1] == 1) {
	    amml.append(tommlelt(v));
	    atexa.push(v);
	} else {
	    addPower(v, a[0][1], atexa, amml);
	}
    }
    
    for (var i = 1; i < a.length; i++) {
	if (a[i][1] == 0) {
	    addSignedNumber(a[i][0], atexa, amml);
	} else {
	    addSignedCoefficient(a[i][0], atexa, amml);
	    if (a[i][1] == 1) {
		amml.append(tommlelt(v));
		atexa.push(v);
	    } else {
		addPower(v, a[i][1], atexa, amml);
	    }
	}
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
