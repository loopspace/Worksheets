/*
  Arithmetic
*/

/*
  Question Type: Compound Percentage Interest, Total Percentage Change
*/

PercentCompTot = new QuestionGenerator(
    "Arithmetic",
    "Total from Compound Percentage",
    "arith18",
    "PercentCompTot",
    [""]
);

PercentCompTot.explanation = function() {
    return 'Calculate the final percentage change after applying the following percentage changes.';
}
PercentCompTot.shortexp = function() {
    return '';
}

PercentCompTot.addOption("a","Range for initial amount","a","string","1:100*10");
PercentCompTot.addOption("p","Range for percentage","p","string","-19:19*5");
PercentCompTot.addOption("n","Range for number of applications","n","string","2:4");
PercentCompTot.addOption("d","Accuracy of answer (decimal places)","d","integer","2");

PercentCompTot.createQuestion = function(question) {
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

    var s = Math.abs((Math.pow(1 + p/100, n) - 1)*100);

    s = Math.round10(s, -this.d);
    
    question.adiv.append(
	$('<span>').append(ch + " by ")
    ).append(
	mmlelt('math').attr('display','inline').append(
	    tommlelt(s)
	).append(
	    tommlelt("%")
	)
    );

    question.atex = ch
	+ " by "
	+ totex(s);
    question.amkd = ch
	+ " by "
	+ tomkd(s);

    return this;
}
