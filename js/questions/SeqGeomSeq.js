/*
Question Type: Sequences

Question Type: Sequences First Term and Common Ratio

Given geometric sequence, write down first term and common ratio.
*/

SeqGeomSeq = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq8",
    "SeqGeomSeq",
    ["0:0"]
);

SeqGeomSeq.explanation = function() {
    return 'For each sequence, write down the first term (' + tomml('a')[0].outerHTML +  ') and the common ratio (' + tomml('r')[0].outerHTML + ').';
}

SeqGeomSeq.shortexp = function(type) {
    if (type == HTML) {
	return 'Write down the first term (' + tomml('a')[0].outerHTML +  ') and the common ratio (' + tomml('r')[0].outerHTML + ') of ';
    } else if (type == TEX) {
	return 'Write down the first term (\\(a\\)) and the common ratio (\\(r\\)) of ';
    } else if (type == MKDWN) {
	return 'Write down the first term ([m]a[/m]) and the common ratio ([m]r[/m]) of ';
    }
}

SeqGeomSeq.addOption("terms","Number of given terms","t","integer",4);
SeqGeomSeq.addOption("a","Range for first term","a","string","1:10");
SeqGeomSeq.addOption("r","Range for common ratio","r","string","1:10");
    
SeqGeomSeq.createQuestion = function(question) {
    var a,r;
    var p,sep;
    var nqn = 0;
    do {
	a = randomFromRange(this.a,this.prng());
	r = randomFromRange(this.r,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn([ a, r]))

    this.registerQn([ a, r]);

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
		tommlelt('r')
	    ).append(
		tommlelt('=')
	    ).append(
		tommlelt(r)
	    )
	).append(". ")
    );
    question.atex = texwrap('a = ' + texnum(a)) + ', ' + texwrap('r = ' + texnum(r)) + '.';

    p = a;
    question.qtex = '';
    for (var j = 0; j < this.terms; j++) {
	question.qdiv.append(tomml(p));
	question.qtex += totex(p) + ", ";
	p = math.multiply(p,r);
	question.qdiv.append($('<span>').addClass("separator").html(", "));
	question.qdiv.append($('<span>').addClass("linebreak").html(""));
    }
    question.qtex += totex('\\dotsc');
    question.qdiv.append($('<span>').addClass("dots").html("..."));

    return this;
}

