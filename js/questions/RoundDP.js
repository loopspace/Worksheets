
// Rounding to decimal places

RoundDP = new QuestionGenerator(
    "Rounding",
    "Rounding to Decimal Places",
    "arith6",
    "RndDP",
    [":0:0:0"]
);

RoundDP.explanation = function() {
    return 'Round the following numbers to the given number of decimal places.';
}
RoundDP.shortexp = function() {
    return 'Round ';
}

RoundDP.addOption("d","Range for number of decimal places","d","string","1:10");
RoundDP.addOption("n","Range for number of digits to drop","n","string","3:5");
RoundDP.addOption("m","Range for number of digits to keep","m","string","3:5");

RoundDP.createQuestion = function(question) {
    var a = [];
    var qtexa,atexa;
    var nqn = 0;

    var n = 0,d = 0,m = 0;

    do {
	n = 0;
	m = 0;
	d = 0;
	while (d < 1) {
	    d = randomFromRange(this.d,this.prng());
	}
	while (n < 1) {
	    n = randomFromRange(this.n,this.prng());
	}
	while (m < 1) {
	    m = randomFromRange(this.m,this.prng());
	}
	a = [];
	a.push(randomFromRange("1:9",this.prng()));
	for (var i = 1; i < n+m-1; i++) {
	    a.push(randomFromRange("0:9",this.prng()));
	}
	a.push(randomFromRange("1:9",this.prng()));
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn(a.join(':') + ':' + d + ':' + n + ':' + m))

    this.registerQn(a.join(':') + ':' + d + ':' + n + ':' + m);

    var b = a.slice(0,m);
    var lst = a[m];
    var dp = m - d;
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
    
    var qn = a.slice(0,dp).join('') + '.' + a.slice(dp).join('');
    var ans = b.slice(0,bdp).join('') + '.' + b.slice(bdp).join('');

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
	" decimal places."
    ));

    qtexa.push(' to \\(' + d + '\\) decimal places.');
    
    var amml = mmlelt('math').attr('display','inline');
    amml.append(mmlelt('mi').html(ans));
    atexa.push(ans);
    
    question.adiv.append(amml);
    atexa.push('\\)');
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');

    return this;
}
