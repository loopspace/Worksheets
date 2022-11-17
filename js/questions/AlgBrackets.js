
/*
  Question Type: Algebra
*/

// Expanding Brackets

AlgBrackets = new QuestionGenerator(
    "Algebra",
    "Expanding Brackets",
    "alg0",
    "ExpBracket",
    ["0:0:0"]
);

AlgBrackets.explanation = function() {
    return 'Simplify each expression, multiplying out the brackets first';
}
AlgBrackets.shortexp = function() {
    return 'Simplify ';
}

AlgBrackets.addOption("n","Range for number of brackets","n","string","2");
AlgBrackets.addOption("d","Range for degrees of terms in brackets","d","string","1");
AlgBrackets.addOption("f","Use fractions for negative powers","f","boolean",false);
AlgBrackets.addOption("a","Range for coefficients of first term in brackets","a","string","-5:5");
AlgBrackets.addOption("b","Range for coefficients of other terms in brackets","b","string","-5:5");
AlgBrackets.addOption("v","Range for letters used for variables","v","string","x");

AlgBrackets.createQuestion = function(question) {
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

    if (degs.length < 2) {
	return false;
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
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
	qs.sort();
    } while ( this.checkQn(qs) )

    this.registerQn(qs);

    v = randomLetterFromRange(this.v,this.prng());

    question.qdiv = $('<div>').addClass('question');
    question.adiv = $('<div>').addClass('answer');
    qtexa = []
    atexa = [];
    
    var qmml = mmlelt('math').attr('display','inline');

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

    addPolynomial(ap,atexa,amml,v,this.f);

    
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
}
