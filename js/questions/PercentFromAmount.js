/*
  Arithmetic
*/

/*
  Question Type: Percentage from an Amount
*/

PercentFrom = new QuestionGenerator(
    "Arithmetic",
    "Percentage from an Amount",
    "arith10",
    "PercentFrom",
    [""]
);

PercentFrom.explanation = function() {
    return 'Calculate the following percentages.';
}
PercentFrom.shortexp = function() {
    return 'Calculate ';
}

PercentFrom.addOption("a","Range for initial amount","a","string","1:100*10");
PercentFrom.addOption("b","Range for final amount","b","string","1:100*10");
PercentFrom.addOption("d","Accuracy of answer (decimal places)","d","integer","2");

PercentFrom.createQuestion = function(question) {
    var a,b;
    var nqn = 0;

    do {
	a = randomFromRange(this.a, this.prng());
	b = randomFromRange(this.b, this.prng());
    
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (a == 0 || this.checkQn([a,b]))

    this.registerQn([a,b]);
    
    question.qdiv.append(
	tomml(b)
    ).append(
	$('<span>').append(" as a percentage of ")
    ).append(
	tomml(a)
    );

    question.qtex = totex(b)
	+ " as a percentage of "
	+ totex(a);

    question.qmkd = tomkd(b)
	+ " as a percentage of "
	+ tomkd(a);

    var s = b/a * 100;

    s = Math.round10(s, -this.d);
    
    question.adiv.append(tomml(s));

    question.atex = totex(s);
    question.amkd = tomkd(s);

    return this;
}
