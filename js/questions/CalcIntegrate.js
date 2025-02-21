/*
  Question Type: Calculus
*/

//  Integrate an Expression

IntExp = new QuestionGenerator(
    "Calculus",
    "Integrate Expression",
    "calc2",
    "IntExp",
    ["0:0"]
);

IntExp.explanation = function() {
    return '';
}
IntExp.shortexp = function() {
    return '';
}

IntExp.addOption("n","Range for number of terms","n","string","3:5");
IntExp.addOption("a","Range for coefficients of terms","a","string","1:9");
IntExp.addOption("p","Range for powers in terms","p","string","0:7");
IntExp.addOption("f","Use fractions for negative powers","f","boolean",false);
IntExp.addOption("r","Use roots for fractional powers","r","boolean",false);
IntExp.addOption("v","Range for letters used for variable in expression","v","string","x");

IntExp.createQuestion = function(question) {
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
	    } while (nqa <= 10 && ( ps.indexOf(p.toString()) != -1 || p == 0));
	    q.push([a,p]);
	    ps.push(p.toString());
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
    } while (this.checkQn(qs))

    this.registerQn(qs);

    v = randomLetterFromRange(this.v,this.prng());

    var a = [];
    for (var i = 0; i < n; i++) {
	if (q[i][1] != 0) {
	    a.push([math.multiply(q[i][1], q[i][0]), math.subtract(q[i][1], 1)]);
	}
    }
    
    question.qdiv = $('<div>').addClass('question');
    question.adiv = $('<div>').addClass('answer');
    qtexa = [];
    atexa = [];
    
    question.qdiv.append(
	$('<span>').append('Find ')
    );
    
    var qmml = mmlelt('math').attr('display','inline');

    qmml.append(tommlelt('&Integral;').attr('displaystyle', 'true'));
    qtexa.push('\\int');

    addPolynomial(a,qtexa,qmml,v,this.f,this.r);
    qmml.append(
	mmlelt('mspace').attr('width', 'thickmathspace')
    );
    qmml.append(tommlelt('d').attr('mathvariant', 'normal'));
    qmml.append(tommlelt(v));
    
    question.qdiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');


    if (q.length == 0) {
	atexa.push('c');
	amml.append(tommlelt('c'));
    } else {
	addPolynomial(q,atexa,amml,v,this.f,this.r);
	atexa.push(' + c');
	amml.append(tommlelt('+'));
	amml.append(tommlelt('c'));
    }

    
    question.adiv.append(amml);
    
    question.qtex =
	'Find \\('
	+
	qtexa.join('')
	+
	'\\)';
    question.atex =
	'\\('
	+
	atexa.join('')
	+
	'+ c \\)';
    question.qmkd =
	'Find [m]'
	+
	qtexa.join('')
	+
	'[/m]';
    question.amkd =
	'[m]'
	+
	atexa.join('')
	+
	'+ c [/m]';
   
    
    return this;
}
