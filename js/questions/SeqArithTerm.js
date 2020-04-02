/*
Question Type: Sequences

Question Type: Sequences nth Term of Arithmetic Sequence

Given linear sequence, write down nth term and a particular term
*/

SeqArithTerm = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq4",
    "SeqArithTerm",
    ["0:0"]
);

SeqArithTerm.explanation = function() {
    return 'For each sequence, write down the formula for the nth term and the given term.';
}

SeqArithTerm.shortexp = function() {
    'Write down the formula for the nth term and the given term of ';
}

SeqArithTerm.addOption("terms","Number of given terms","t","integer",4);
SeqArithTerm.addOption("a","Range for first term","a","string","1:10");
SeqArithTerm.addOption("d","Range for common difference","d","string","1:10");
SeqArithTerm.addOption("k","Range for requested kth term","k","string","20:40");
    
SeqArithTerm.createQuestion = function(question) {
    var a,d,k;
    var p,sep;
    var nqn = 0;
    
    do {
	a = randomFromRange(this.a,this.prng());
	d = randomFromRange(this.d,this.prng());
	k = randomFromRange(this.k,this.prng());
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (this.checkQn([ a, d ]) )
    this.registerQn([ a, d ]);

    var op,dif,term;
    if (a - d > 0) {
	op = tommlelt('+');
	dif = tommlelt(a - d);
    } else if (a - d < 0) {
	op = tommlelt('-');
	dif = tommlelt(d - a);
    }
    term = a + d*(k-1);

    var nthterm = mmlelt('math').attr('display','inline');
    question.atex = '';

    if (d == -1) {
	nthterm.append(tommlelt("-"));
	question.atex += '-';
    } else if (d != 1) {
	nthterm.append(tommlelt(d));
	question.atex += d;
    }

    nthterm.append(tommlelt("n"));
    question.atex += 'n';

    if (a - d > 0) {
	nthterm.append(tommlelt("+"));
	nthterm.append(tommlelt(a - d));
	question.atex += '+';
	question.atex += a - d;
    } else if (a - d < 0) {
	nthterm.append(tommlelt("-"));
	nthterm.append(tommlelt(d - a));
	question.atex += '-';
	question.atex += d - a;
    }
    
    
    question.adiv.append(
	$('<span>').append(nthterm).append("; ")
    );

    question.adiv.append(
	$('<span>').append(
	    mmlelt('math').attr('display','inline').append(
		tommlelt(term)
	    )
	).append(". ")
    );
    question.atex = texwrap(question.atex) + '; ' + texwrap(term) + '.';

    p = a;
    question.qtex = '';
    for (var j = 0; j < this.terms; j++) {
	question.qdiv.append(tomml(p));
	question.qtex += totex(p) + ", ";
	p = math.add(p,d);
	question.qdiv.append($('<span>').addClass("separator").html(", "));
	question.qdiv.append($('<span>').addClass("linebreak").html(""));
    }
    question.qtex += totex('\\dotsc');
    question.qdiv.append($('<span>').addClass("dots").html("..."));
    question.qdiv.append($('<span>').append(
	";&nbsp;"
    ).append(
	tomml(k)
    ).append(
	ordinal_suffix_of(k) + " term"
    ));
    question.qtex += '; ' + totex(k) +  ordinal_suffix_of(k) + ' term.';

    return this;
}
