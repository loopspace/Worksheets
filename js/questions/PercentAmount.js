/*
  Arithmetic
*/

/*
  Question Type: Percentage of an Amount
*/

PercentAmount = new QuestionGenerator(
    "Arithmetic",
    "Percentage of an Amount",
    "arith9",
    "PercentAmount",
    [""]
);

PercentAmount.explanation = function() {
    return 'Calculate the following percentages.';
}
PercentAmount.shortexp = function() {
    return '';
}

PercentAmount.addOption("a","Range for initial amount","a","string","1:100*10");
PercentAmount.addOption("p","Range for percentage","p","string","1:19*5");
PercentAmount.addOption("d","Accuracy of answer (decimal places)","d","integer","2");

PercentAmount.createQuestion = function(question) {
    var a,p;
    var qtexa,atexa;
    var qmkda,amkda;
    var nqn = 0;

    do {
	a = randomFromRange(this.a, this.prng());
	p = randomFromRange(this.p, this.prng());
    
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (p == 0 || this.checkQn([a,p]))

    this.registerQn([a,p]);

    var ch;
    if (p > 0) {
	ch = "Increase";
    } else {
	ch = "Decrease";
    }

    question.qdiv.append(
	$('<span>').append("Find ")
    ).append(
	mmlelt('math').attr('display','inline').append(
	    tommlelt(p)
	).append(
	    tommlelt("%")
	)
    ).append(
	$('<span>').append(" of ")
    ).append(
	tomml(a)
    ).append(
	$('<span>').append(".")
    );

    question.qtex = "Find "
	+ texwrap(texnum(p) + '\\%')
	+ " of "
	+ totex(a)
	+ ".";

    question.qmkd = "Find "
	+ mkdwrap(texnum(p) + '\\%')
	+ " of "
	+ tomkd(a)
	+ ".";

    var s = a * (p/100);

    s = Math.round10(s, -this.d);
    
    question.adiv.append(tomml(s));

    question.atex = totex(s);
    question.amkd = tomkd(s);

    return this;
}
