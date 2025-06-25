/*
  Arithmetic
*/

/*
  Question Type: Compound Percentage Interest, Final Amount
*/

PercentCompAmt = new QuestionGenerator(
    "Arithmetic",
    "Compound Percentage Amount",
    "arith14",
    "PercentCompAmt",
    [""]
);

PercentCompAmt.explanation = function() {
    return 'Calculate the final amount after applying the following percentage changes.';
}
PercentCompAmt.shortexp = function() {
    return '';
}

PercentCompAmt.addOption("a","Range for initial amount","a","string","1:100*10");
PercentCompAmt.addOption("p","Range for percentage","p","string","-19:19*5");
PercentCompAmt.addOption("n","Range for number of applications","n","string","2:4");
PercentCompAmt.addOption("d","Accuracy of answer (decimal places)","d","integer","2");

PercentCompAmt.createQuestion = function(question) {
    var a,p;
    var qtexa,atexa;
    var qmkda,amkda;
    var nqn = 0;

    var n = randomFromRange(this.n,this.prng());

    do {
	a = randomFromRange(this.a, this.prng());
	p = randomFromRange(this.p, this.prng());
    
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (p == 0 || this.checkQn([a,p]))

    this.registerQn([a,p]);

    var ch;
    if (p > 0) {
	ch = "Increase";
    } else {
	ch = "Decrease";
    }

    var pct = Math.abs(p);
    
    question.qdiv.append(
	$('<span>').append(ch + " the amount ")
    ).append(
	tomml(a)
    ).append(
	$('<span>').append(" by ")
    ).append(
	mmlelt('math').attr('display','inline').append(
	    tommlelt(pct)
	).append(
	    tommlelt("%")
	)
    ).append(
	$('<span>').append(" a total of ")
    ).append(
	tomml(n)
    ).append(
	$('<span>').append(" times.")
    );

    question.qtex = ch
	+ " the amount "
	+ totex(a)
	+ " by "
	+ texwrap(texnum(pct) + '\\%')
	+ " a total of "
	+ totex(n)
	+ " times.";

    question.qmkd = ch
	+ " the amount "
	+ tomkd(a)
	+ " by "
	+ mkdwrap(texnum(pct) + '\\%')
	+ " a total of "
	+ tomkd(n)
	+ " times.";

    var s = a * Math.pow(1 + p/100, n);

    s = Math.round10(s, -this.d);
    
    question.adiv.append(tomml(s));

    question.atex = totex(s);
    question.amkd = tomkd(s);

    return this;
}
