/*
  Arithmetic
*/

/*
  Question Type: Compound Percentage Interest
*/

PercentCompInt = new QuestionGenerator(
    "Arithmetic",
    "Compound Percentage Interest",
    "arith17",
    "PercentCompInt",
    [""]
);

PercentCompInt.explanation = function() {
    return 'Calculate the step percentage in the following compound percentage changes.';
}
PercentCompInt.shortexp = function() {
    return '';
}

PercentCompInt.addOption("a","Range for initial amount","a","string","1:100*10");
PercentCompInt.addOption("p","Range for percentage","p","string","-19:19*5");
PercentCompInt.addOption("n","Range for number of applications","n","string","2:4");
PercentCompInt.addOption("d","Accuracy of answer (decimal places)","d","integer","2");

PercentCompInt.createQuestion = function(question) {
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
	ch = "increased";
    } else {
	ch = "decreased";
    }

    var pct = Math.abs(p);
    var s = a * Math.pow(1 + p/100, n);

    s = Math.round10(s, -this.d);
    
    question.qdiv.append(
	$('<span>').append("The amount ")
    ).append(
	tomml(a)
    ).append(
	$('<span>').append(" was " + ch + " by a percentage a total of ")
    ).append(
	tomml(n)
    ).append(
	$('<span>').append(" times resulting in ")
    ).append(
	tomml(s)
    ).append(
	$('<span>').append(". What was the percentage?")
    );

    question.qtex = 
	"The amount "
	+ totex(a)
	+ "was " + ch +" by a percentage a total of "
	+ totex(n)
	+ " times resulting in"
	+ totex(s)
	+ ". What was the percentage?";

    question.qmkd =
	"The amount "
	+ tomkd(a)
	+ "was " + ch +" by a percentage a total of "
	+ tomkd(n)
	+ " times resulting in"
	+ tomkd(s)
	+ ". What was the percentage?";

    question.adiv.append(
	mmlelt('math').attr('display','inline').append(
	    tommlelt(pct)
	).append(
	    tommlelt("%")
	)
    );
    question.atex = texwrap(texnum(pct) + '\\%');
    question.amkd = mkdwrap(texnum(pct) + '\\%');

    return this;
}
