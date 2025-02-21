/*
  Arithmetic
*/

/*
  Question Type: Compound Percentage
*/

PercentComp = new QuestionGenerator(
    "Arithmetic",
    "Compound Percentage",
    "arith13",
    "PercentComp",
    [""]
);

PercentComp.explanation = function() {
    return 'Calculate the final amount after the following percentage changes.';
}
PercentComp.shortexp = function() {
    return '';
}

PercentComp.addOption("a","Range for initial amount","a","string","1:100*10");
PercentComp.addOption("p","Range for percentage","p","string","-19:19*5");
PercentComp.addOption("n","Range for number of changes","n","string","2:4");
PercentComp.addOption("d","Accuracy of answer (decimal places)","d","integer","2");

PercentComp.createQuestion = function(question) {
    var p = [];
    var qtexa,atexa;
    var qmkda,amkda;
    var nqn = 0;

    var n = randomFromRange(this.n,this.prng());
    var a = randomFromRange(this.a, this.prng());
    
    do {
	p = [];
	
	for (var i = 0; i < n; i++) {
	    var b;
	    do {
		b = randomFromRange(this.p, this.prng());
	    } while (b == 0);
	    p.push(b);
	}
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn(Array.prototype.concat(a, p.slice().sort())))

    this.registerQn(Array.prototype.concat(a, p.slice().sort()));

    question.qdiv.append(
	$('<span>').append("The amount ")
    ).append(
	tomml(a)
    );
    var changeSpan = $('<span>').append(" is ");
    qtexa = [
	"The amount ",
	totex(a),
	" is "
    ];
    qmkda = [
	"The amount ",
	tomkd(a),
	" is "
    ];

    var pct;
    for (var i = 0; i < p.length; i++) {
	pct = math.abs(p[i]);
	if (p[i] > 0) {
	    qtexa.push('increased by ');
	    qmkda.push('increased by ');
	    changeSpan.append('increased by ');
	} else {
	    qtexa.push('decreased by ');
	    qmkda.push('decreased by ');
	    changeSpan.append('decreased by ');
	}
	qtexa.push(texwrap(texnum(pct) + '\\%'));
	qmkda.push(mkdwrap(texnum(pct) + '\\%'));
	question.qdiv.append(changeSpan).append(
	    mmlelt('math').attr('display','inline').append(
		tommlelt(pct)
	    ).append(
		tommlelt("%")
	    )
	);
	changeSpan = $('<span>');
	if (i < p.length - 2) {
	    qtexa.push(', then ');
	    qmkda.push(', then ');
	    changeSpan.append(', then ');
	}
	if (i == p.length - 2) {
	    qtexa.push(', and then ');
	    qmkda.push(', and then ');
	    changeSpan.append(', and then ');
	}
	if (i == p.length -1) {
	    qtexa.push('.');
	    qmkda.push('.');
	    changeSpan.append('.');
	}
    }
    question.qdiv.append(changeSpan);

    var s = a;
    for (var i = 0; i < p.length; i++) {
	s *= (1 + p[i]/100);
    }

    s = Math.round10(s, -this.d);
    
    var amml = mmlelt('math').attr('display','inline');
    atexa = [];
    addNumber(s,atexa,amml);
    question.adiv.append(amml);

    question.qtex = qtexa.join('');
    question.qmkd = qmkda.join('');
    question.atex = '\\(' + atexa.join('') + '\\)';
    question.amkd = '[m]' + atexa.join('') + '[/m]';

    return this;
}
