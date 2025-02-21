// Simplify expressions

SimpExp = new QuestionGenerator(
    "Expressions",
    "Simplifying Expressions",
    "exp0",
    "SimpExp",
    [""]
);

SimpExp.explanation = function() {
    return 'Simplify each expression';
}
SimpExp.shortexp = function() {
    return 'Simplify ';
}

SimpExp.addOption("c","Range for coefficients","c","string","-5:5");
SimpExp.addOption("n","Range for number of terms","n","string","3:5");
SimpExp.addOption("m","Range for number of unknowns","m","string","1");
SimpExp.addOption("constant","Include constant terms", "k", "boolean", true);
SimpExp.addOption("v","Range for letters used for variables","v","string","x");

SimpExp.createQuestion = function(question) {

    var v;
    var p,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;

    var n = randomFromRange(this.n,this.prng());
    var m = randomFromRange(this.m,this.prng());
    if (!this.constant) {m--};
    var c,k, exp, lexp;

    do {
	exp = [];
	lexp = [];
	for (var i = 0; i < n; i++) {
	    do {
		c = randomFromRange(this.c,this.prng());
	    } while ( c == 0);
	    k = randomFromRange("0:" + m,this.prng());
	    exp.push( [c, k ]);
	    lexp.push( c + ":" + k );
	}
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while ( this.checkQn(lexp))

    this.registerQn(lexp);

    v = [];
    var sol = [];
    var l; // = generateFromRange(this.v, this.prng());
    
    
    for (var i = 0; i < m; i++) {
	do {
	    l = randomLetterFromRange(this.v, this.prng());
	} while (v.includes(l));
	v.push(l);
	sol.push(0);
    }
    v.sort();

    if (this.constant) {
	v.push("");
	sol.push(0);
    }
    
    question.qdiv = $('<div>').addClass('question');
    question.adiv = $('<div>').addClass('answer');
    qtexa = ['\\('];
    atexa = ['\\('];

    var qmml = mmlelt('math').attr('display','inline');
    var amml = mmlelt('math').attr('display','inline');

    var st = true;

    for (var i = 0; i < exp.length; i++) {
	sol[exp[i][1]] += exp[i][0];
	if (!math.equal(exp[i][0],0)) {
	    if (st) {
		if (v[exp[i][1]] == "") {
		    addNumber(exp[i][0], qtexa, qmml);
		} else {
		    addMonomial([ exp[i][0], 1], qtexa, qmml, v[exp[i][1]], false, false);
		}
		st = false;
	    } else {
		if (v[exp[i][1]] == "") {
		    addSignedNumber(exp[i][0], qtexa, qmml);
		} else {
		    addSignedMonomial([ exp[i][0], 1], qtexa, qmml, v[exp[i][1]], false, false);
		}
	    }
	}
    }

    st = true;
    for (var i = 0; i < sol.length; i++) {
	if (!math.equal(sol[i],0)) {
	    if (st) {
		if (v[i] == "") {
		    addNumber(sol[i], atexa, amml);
		} else {
		    addMonomial([ sol[i], 1], atexa, amml, v[i], false, false);
		}
		st = false;
	    } else {
		if (v[i] == "") {
		    addSignedNumber(sol[i], atexa, amml);
		} else {
		    addSignedMonomial([ sol[i], 1], atexa, amml, v[i], false, false);
		}
	    }
	}
    }

    
    question.qdiv.append(qmml);
    qtexa.push('\\)');
    
    
    question.adiv.append(amml);
    atexa.push('\\)');
    
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');
    
    return this;
}
