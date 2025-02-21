/*
  Arithmetic
*/

/*
  Question Type: Initial Amount from a Percentage
*/

PercentInitial = new QuestionGenerator(
    "Arithmetic",
    "Initial Amount from a Percentage",
    "arith11",
    "PercentInitial",
    [""]
);

PercentInitial.explanation = function() {
    return 'Calculate the original amount from the following percentages.';
}
PercentInitial.shortexp = function() {
    return 'Calculate ';
}

PercentInitial.addOption("a","Range for final amount","a","string","1:100*10");
PercentInitial.addOption("p","Range for percentage","p","string","1:19*5");
PercentInitial.addOption("d","Accuracy of answer (decimal places)","d","integer","2");

PercentInitial.createQuestion = function(question) {
    var a,b;
    var nqn = 0;

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
    } while (a == 0 || this.checkQn([a,p]))

    this.registerQn([a,p]);
    
    question.qdiv.append(
	tomml(a)
    ).append(
	$('<span>').append(" is ")
    ).append(
	mmlelt('math').attr('display','inline').append(
	    tommlelt(p)
	).append(
	    tommlelt("%")
	)
    ).append(
	$('<span>').append(" of what?")
    );

    question.qtex = totex(a)
	+ " is "
	+ texwrap(texnum(p) + '\\%')
	+ " of what?";

    question.qmkd = tomkd(a)
	+ " is "
	+ mkdwrap(texnum(p) + '\\%')
	+ " of what?";

    var s = a/p * 100;

    s = Math.round10(s, -this.d);
    
    question.adiv.append(tomml(s));

    question.atex = totex(s);
    question.amkd = tomkd(s);

    return this;
}
