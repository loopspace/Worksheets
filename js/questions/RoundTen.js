
// Rounding to tens

RoundTen = new QuestionGenerator(
    "Rounding",
    "Rounding to Powers of Ten",
    "arith8",
    "RndTen",
    [":0:0"]
)

RoundTen.explanation = function() {
    return 'Round the following numbers to the given number of powers of ten.';
}
RoundTen.shortexp = function() {
    return 'Round ';
}


RoundTen.addOption("n","Range for number of digits to drop","n","string","3:5");
RoundTen.addOption("m","Range for number of digits to keep","m","string","3:5");

RoundTen.createQuestion = function(question) {
    var a = [];
    var qtexa,atexa;
    var nqn = 0;

    var n = 0,m = 0;

    do {
	n = 0;
	m = 0;
	while (n < 1) {
	    n = randomFromRange(this.n,this.prng());
	}
	while (m < 1) {
	    m = randomFromRange(this.m,this.prng());
	}
	a = [];
	a.push(randomFromRange("1:9",this.prng()));
	for (var i = 1; i < n+m; i++) {
	    a.push(randomFromRange("0:9",this.prng()));
	}
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn(a.join(':') + ':' + n + ':' + m))


    this.registerQn(a.join(':') + ':' + n + ':' + m);

    var b = a.slice(0,m);
    var lst = a[m];

    var i = b.length - 1;
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
	}
    }

    for (var i = 0; i < n; i++) {
	b.push(0);
    }

    var qn = a;
    var ans = b;

    question.qdiv = $('<div>').addClass('question');
    question.adiv = $('<div>').addClass('answer');
    qtexa = ['\\('];
    atexa = ['\\('];

    var qmml = mmlelt('math').attr('display','inline');
    
    qmml.append(mmlelt('mi').html(qn.join("")));
    qtexa.push(qn.join(""));

    qtexa.push('\\)');
    question.qdiv.append(qmml);
    question.qdiv.append($('<span>').append(
	" to the nearest " + powerOfTen(n) + '.'
    ));

    qtexa.push(' to the nearest ' + powerOfTen(n) +  '.');
    
    var amml = mmlelt('math').attr('display','inline');
    amml.append(mmlelt('mi').html(ans.join("")));
    atexa.push(ans.join(""));
    
    question.adiv.append(amml);
    atexa.push('\\)');

    question.qtex = qtexa.join('');
    question.atex = atexa.join('');


    return this;
}
