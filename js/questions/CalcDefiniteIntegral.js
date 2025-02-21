/*
  Question Type: Calculus
*/

//  Find a definite integral

IntExp = new QuestionGenerator(
    "Calculus",
    "Integrate Expression",
    "calc3",
    "IntExp",
    ["0:0:0:0"]
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
IntExp.addOption("l","Range for lower limit","l","string","0:7");
IntExp.addOption("u","Range for upper limit","u","string","0:7");
IntExp.addOption("f","Use fractions for negative powers","f","boolean",false);
IntExp.addOption("r","Use roots for fractional powers","r","boolean",false);
IntExp.addOption("b","Ensure the lower limit is below the upper","b","boolean",true);
IntExp.addOption("v","Range for letters used for variable in expression","v","string","x");

IntExp.createQuestion = function(question) {
    var a,p,u,v;
    var lower, upper;
    var lowerArea, upperArea;
    var area;
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
    var avoidZero;
    do {
	avoidZero = false;
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
	    if (p < 0) {
		avoidZero = true;
	    }
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
	do {
	    lower = randomFromRange(this.l, this.prng());
	    upper = randomFromRange(this.u, this.prng());
	} while (
	    (math.compare(upper,lower) == 0)
		||
		(avoidZero
		 &&
		 (
		     math.compare(upper,0)
			 *
			 math.compare(lower,0)
			 != 1
		 )
		)
	);
	if (this.b && math.compare(upper, lower) == -1) {
	    [lower, upper] = [upper, lower];
	}
	qs.push(lower);
	qs.push(upper);
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

    var mint = mmlelt('mrow').append(
	mmlelt('msubsup').append(
	    tommlelt('&Integral;').attr('displaystyle', 'true')
	).append(
	    tommlelt(lower)
	).append(
	    tommlelt(upper)
	)
    );
    
    qmml.append(mint);
    qtexa.push('\\int_{' + texnum(lower) + '}{' + texnum(upper) + '}' );

    addPolynomial(a,qtexa,qmml,v,this.f,this.r);
    qmml.append(
	mmlelt('mspace').attr('width', 'thickmathspace')
    );
    qmml.append(tommlelt('d').attr('mathvariant', 'normal'));
    qmml.append(tommlelt(v));
    
    
    var amml = mmlelt('math').attr('display','inline');

    upperArea = evaluatePolynomial(q,upper);
    lowerArea = evaluatePolynomial(q,lower);
    area = math.subtract(upperArea, lowerArea);

    atexa.push(area);
    amml.append(tommlelt(area));
    
    question.qdiv.append(qmml);
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
