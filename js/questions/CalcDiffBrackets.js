
/*
  Question Type: Calculus
*/

// Expanding Brackets then Differentiating

CalcBrackets = new QuestionGenerator(
    "Calculus",
    "Differentiating Brackets",
    "calc1",
    "CalcBracket",
    []
);

CalcBrackets.explanation = function() {
    return 'Differentiate each expression, multiplying out the brackets first';
}
CalcBrackets.shortexp = function() {
    return 'Multiply out then differentiate ';
}

CalcBrackets.addOption("n","Range for number of brackets","n","string","2");
CalcBrackets.addOption("d","Range for degrees of terms in brackets","d","string","0:1");
CalcBrackets.addOption("f","Use fractions for negative powers","f","boolean",false);
CalcBrackets.addOption("a","Range for coefficients of first term in brackets","a","string","-5:5");
CalcBrackets.addOption("b","Range for coefficients of other terms in brackets","b","string","-5:5");
CalcBrackets.addOption("v","Range for letters used for variables","v","string","x");
CalcBrackets.addOption("u","Range for letters used for name of expression","u","string","y");

CalcBrackets.createQuestion = function(question) {
    var v;
    var qtexa,atexa;
    var nqn = 0;
    var p, q, qs, ps;
    var n = 0;
    do {
	n = randomFromRange(this.n,this.prng());
	nqn++;
	if (n < 2 && nqn > 10) {
	    n = 2;
	    nqn = 0;
	}
    } while (n < 2);

    nqn = 0;
    var nqa;
    var deg = generateFromRange(this.d);
    var degs = [];
    for (var d of deg) {
	degs.push(d);
    }

    var a,f,s,l;
    do {
	q = [];
	qs = [];
	s = 1;

	for (var i = 0; i < n; i++) {

	    do {
		p = [];
		ps = [];
		f = false;
		l = 0;
		
		for (var d = 0; d < degs.length; d++) {
		    if (f) {
			a = randomFromRange(this.b,this.prng());
		    } else {
			a = randomFromRange(this.a,this.prng());
			if (!math.equal(a, 0)) f = true;
		    }
		    if (!math.equal(a, 0)) l++;
		    ps.push(a);
		    p.push([a,degs[d]]);
		}
	    } while ( l < s || qs.indexOf(ps.join(",")) != -1);
	    if (l == 1) {
		s = 2;
		q.unshift(p);
	    } else {
		q.push(p);
	    }
	    qs.push(ps.join(","));
	}

	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
	qs.sort();
    } while ( this.checkQn(qs) )

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
    
    var l;
    for (var i = 0; i < q.length; i++ ) {
	l = 0;
	for (var j = 0; j < q[i].length; j++) {
	    if (!math.equal(q[i][j][0],0)) {
		l++;
	    }
	}
	if (l > 1) {
	    qtexa.push('\\left(');
	    qmml.append(tommlelt('('));
	}
	addPolynomial(q[i],qtexa,qmml,v,this.f);
	if (l > 1) {
	    qtexa.push('\\right)');
	    qmml.append(tommlelt(')'));
	}
    }
    
    question.qdiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');

    amml.append(deriv.clone());
    amml.append(tommlelt('='));
    atexa.push('\\frac{d' + u + '}{d' + v + '} = ');

    var ap = [ [1,0] ];
    var bp;
    var cp;
    for (var i = 0; i < q.length; i++) {
	bp = [];
	for (var j = 0; j < q[i].length; j++) {
	    for (var k = 0; k < ap.length; k++) {
		bp.push( [ math.multiply( q[i][j][0], ap[k][0] ), math.add( q[i][j][1], ap[k][1] ) ] );
	    }
	}
	bp.sort(function(a,b) { return b[1] - a[1] });
	ap = [ bp[0] ];

	for (var j = 1; j < bp.length ; j++) {
	    if (math.equal(bp[j][1], ap[ap.length-1][1])) {
		ap[ap.length-1][0] = math.add(ap[ap.length-1][0], bp[j][0]);
	    } else {
		ap.push(bp[j]);
	    }
	}
    }

    var a = [];
    for (var i = 0; i < ap.length; i++) {
	if (ap[i][1] != 0) {
	    a.push([math.multiply(ap[i][1], ap[i][0]), math.subtract(ap[i][1], 1)]);
	}
    }

    if (a.length == 0) {
	atexa.push(texnum(0));
	amml.append(tommlelt(0));
    } else {
	addPolynomial(a,atexa,amml,v,this.f);
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
