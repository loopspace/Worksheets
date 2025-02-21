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
    return 'Write down the formula for the nth term and the ';
}

SeqArithTerm.addOption("terms","Number of given terms","t","integer",4);
SeqArithTerm.addOption("a","Range for first term","a","string","1:10");
SeqArithTerm.addOption("d","Range for common difference","d","string","1:10");
SeqArithTerm.addOption("k","Range for requested <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>k</mi></math>th term","k","string","20:40");
    
SeqArithTerm.createQuestion = function(question) {
    var a,d,k;
    var p,sep;
    var nqn = 0;
    
    do {
	a = randomFromRange(this.a,this.prng());
	d = randomFromRange(this.d,this.prng());
	k = randomFromRange(this.k,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn([ a, d ]) )
    this.registerQn([ a, d ]);

    var term;
    term = math.add(a,math.multiply(d,math.subtract(k,1)));

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

    if (math.compare(a, d) == 1) {
	nthterm.append(tommlelt("+"));
	nthterm.append(tommlelt(math.subtract(a, d)));
	question.atex += '+';
	question.atex += math.subtract(a, d);
    } else if (math.compare(a, d) == -1) {
	nthterm.append(tommlelt("-"));
	nthterm.append(tommlelt(math.subtract(d, a)));
	question.atex += '-';
	question.atex += math.subtract(d, a);
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

    question.qdiv.append(
	tomml(k)
    ).append(
	ordinal_suffix_of(k) + " term of "
    );
    question.qtex = totex(k) +  ordinal_suffix_of(k) + ' term of ';
    for (var j = 0; j < this.terms; j++) {
	question.qdiv.append(tomml(p));
	question.qtex += totex(p) + ", ";
	p = math.add(p,d);
	question.qdiv.append($('<span>').addClass("separator").html(", "));
	question.qdiv.append($('<span>').addClass("linebreak").html(""));
    }
    question.qtex += totex('\\dotsc');
    question.qdiv.append($('<span>').addClass("dots").html("..."));

    return this;
}
