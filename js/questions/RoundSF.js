
// Rounding to significant figures

RoundSF = new QuestionGenerator(
    "Rounding",
    "Rounding to Significant Figures",
    "arith7",
    "RndSF",
    [":0:0:0"]
);

RoundSF.explanation = function() {
    return 'Round the following numbers to the given number of significant figures.';
}
RoundSF.shortexp = function() {
    return 'Round ';
}

RoundSF.addOption("d","Range for number of significant figures","d","string","1:10");
RoundSF.addOption("p","Range for position of decimal point","p","string","3:5");
RoundSF.addOption("n","Range for number of digits to drop","n","string","3:5");

RoundSF.createQuestion = function(question) {
    var a = [];
    var qtexa,atexa;
    var nqn = 0;

    var n = 0,d = 0,p = 0;

    do {
	n = 0;
	d = 0;
	p = 0;
	while (d < 1) {
	    d = randomFromRange(this.d,this.prng());
	}
	while (n < 1) {
	    n = randomFromRange(this.n,this.prng());
	}
	p = randomFromRange(this.p,this.prng());
	a = [];
	a.push(randomFromRange("1:9",this.prng()));
	for (var i = 1; i < n+d-1; i++) {
	    a.push(randomFromRange("0:9",this.prng()));
	}
	a.push(randomFromRange("1:9",this.prng()));
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (this.checkQn(a.join(':') + ':' + [d,n,p].join(':')))

    this.registerQn(a.join(':') + ':' + [d,n,p].join(':'));

    var b = a.slice(0,d);
    var lst = a[d];
    var dp = p;
    while (dp < 1) {
	a.unshift(0);
	b.unshift(0);
	dp++;
    }

    var i = b.length - 1;
    var bdp = dp;
    if (lst >= 5) {
	b[i]++;
	while (i > 0 && b[i] == 10) {
	    b[i] = 0;
	    i--;
	    b[i]++;
	}
	if (i == 0 && b[i] == 10) {
	    b[i] = 0;
	    b.unshift(1);
	    bdp++;
	}
    }
    
    var qn;
    if (a.length > dp) {
	qn = a.slice(0,dp).join('') + '.' + a.slice(dp).join('');
    } else {
	qn = a.join('') + "0".repeat(dp - a.length);
    }
    var ans;
    if (b.length > dp) {
	ans = b.slice(0,bdp).join('') + '.' + b.slice(bdp).join('');
    } else {
	ans = b.join('') + "0".repeat(bdp - b.length);
    }

    question.qdiv = $('<div>').addClass('question');
    question.adiv = $('<div>').addClass('answer');
    qtexa = ['\\('];
    atexa = ['\\('];

    var qmml = mmlelt('math').attr('display','inline');
    
    qmml.append(mmlelt('mi').html(qn));
    qtexa.push(qn);

    qtexa.push('\\)');
    question.qdiv.append(qmml);
    question.qdiv.append($('<span>').append(
	" to "
    ).append(
	tomml(d)
    ).append(
	" significant figure" + (d == 1 ? '' : "s") + "."
    ));

    qtexa.push(' to \\(' + d + '\\) significant figure' + (d == 1 ? '' : 's') + '.');
    
    var amml = mmlelt('math').attr('display','inline');
    amml.append(mmlelt('mi').html(ans));
    atexa.push(ans);
    
    question.adiv.append(amml);
    atexa.push('\\)');

    question.qtex = qtexa.join('');
    question.atex = atexa.join('');

    return this;
}
