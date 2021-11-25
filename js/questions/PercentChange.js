/*
  Arithmetic
*/

/*
  Question Type: Percentage Change 
*/

PercentChange = new QuestionGenerator(
    "Arithmetic",
    "Percentage Change",
    "arith12",
    "PercentChange",
    [""]
);

PercentChange.explanation = function() {
    return 'Calculate the following percentage changes.';
}
PercentChange.shortexp = function() {
    return 'Calculate ';
}

PercentChange.addOption("a","Range for initial amount","a","string","1:100*10");
PercentChange.addOption("p","Range for the percentage","p","string","-19:19*5");
PercentChange.addOption("d","Accuracy of answer (decimal places)","d","integer","2");

PercentChange.createQuestion = function(question) {
    var a,p;
    var nqn = 0;

    do {
	a = randomFromRange(this.a, this.prng());
	p = randomFromRange(this.p, this.prng());
    
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (a == 0 || p == 0 || this.checkQn([a,p]))

    this.registerQn([a,p]);

    var ch;
    if (p > 0) {
	ch = "Increase ";
    } else {
	ch = "Decrease ";
    }

    var pct = Math.abs(p);
    
    question.qdiv.append(
	$('<span>').append(ch)
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
	$('<span>').append(".")
    );

    question.qtex = ch
	+ totex(a)
	+ " by "
    	+ texwrap(texnum(pct) + '\\%')
	+ "."
    ;

    question.qmkd = ch
	+ tomkd(a)
	+ " by "
    	+ mkdwrap(texnum(pct) + '\\%')
	+ "."
    ;

    var s = a * (1 + p/100);

    s = Math.round10(s, -this.d);
    
    question.adiv.append(tomml(s));

    question.atex = totex(s);
    question.amkd = tomkd(s);

    return this;
}
