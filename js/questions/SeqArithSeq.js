/*
Question Type: Sequences

Question Type: Sequences First Term and Common Difference

Given linear sequence, write down first term and common difference.
*/

SeqArithSeq = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq3",
    "SeqArithSeq",
    ["0:0"]
);

SeqArithSeq.explanation = function() {
    return 'For each sequence, write down the first term (' + tomml('a')[0].outerHTML +  ') and the common difference (' + tomml('d')[0].outerHTML + ').';
}

SeqArithSeq.shortexp = function() {
    return 'Write down the first term (' + tomml('a')[0].outerHTML +  ') and the common difference (' + tomml('d')[0].outerHTML + ') of ';
}

SeqArithSeq.addOption("terms","Number of given terms","t","integer",4);
SeqArithSeq.addOption("a","Range for first term","a","string","1:10");
SeqArithSeq.addOption("d","Range for common difference","d","string","1:10");
    
SeqArithSeq.createQuestion = function(question) {
    var a,d;
    var p,sep;
    var nqn = 0;
    do {
	a = randomFromRange(this.a,this.prng());
	d = randomFromRange(this.d,this.prng());
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (this.checkQn([ a, d]))

    this.registerQn([ a, d]);

    question.adiv.append(
	$('<span>').append(
	    mmlelt('math').attr('display','inline').append(
		tommlelt('a')
	    ).append(
		tommlelt('=')
	    ).append(
		tommlelt(a)
	    )
	).append(", ")
    );

    question.adiv.append(
	$('<span>').append(
	    mmlelt('math').attr('display','inline').append(
		tommlelt('d')
	    ).append(
		tommlelt('=')
	    ).append(
		tommlelt(d)
	    )
	).append(". ")
    );
    question.atex = texwrap('a = ' + texnum(a)) + ', ' + texwrap('d = ' + texnum(d)) + '.';

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

    return this;
}

