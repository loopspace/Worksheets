/*
Question Type: Sequences

Question Type: Sequences Next Terms

Given first k terms in a simple sequence, write down the term-to-term rule and the next l terms.
*/

SeqNextTerms = new QuestionGenerator(
    "Sequences", // group
    "Sequence",  // title
    "seq0", // alias
    "SeqNextTerms", // storage
    ["0:0:Add "], // default questions to exclude
);

SeqNextTerms.explanation = function() {
    return 'For each sequence, write down the rule and the next ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + '.';
}

SeqNextTerms.shortexp = function() {
    return 'For each sequence, write down the rule and the next ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + '.';
}

SeqNextTerms.addOption("seed", "Random seed", "s", "string", "");
SeqNextTerms.addOption("size", "Number of questions", "z", "integer", 10);
SeqNextTerms.addOption("length", "Number of given terms", "n", "integer", 4);
SeqNextTerms.addOption("terms", "Number of asked for terms", "t", "integer", 2);
SeqNextTerms.addOption("a", "Range for first term", "a", "string", "1:10");

SeqNextTerms.addOption("d", "Range for term-to-term", "d", "string", "1:10");
SeqNextTerms.addOption("linear", "Only linear sequences", "l", "boolean", true);

SeqNextTerms.mkop = function(n) {
    if (n) {
	n = 0;
    } else {
	n = Math.floor(3*this.prng());
    }
    if (n == 0) {
	return {op: function(u,v) { return math.add(u,v) }, type: "Add "};
    } else if (n == 1) {
	return {op: function(u,v) { return math.multiply(u,v) }, type: "Multiply by "};
    } else {
	return {op: function(u,v) { return math.fraction(math.divide(u,v)) }, type: "Divide by " };
    }
};
    
SeqNextTerms.makeQuestion = function(force) {
    if (this.qn >= this.size && !force) return false;

    var a,d,op;
    var qdiv,adiv,p,sep,qtex,atex;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	d = randomFromRange(this.d,this.prng());
	op = this.mkop(this.linear);
	nqn++;
	if (nqn > 10) {
	    this.seqs = {"0:0:Add ": true};
	    nqn = 0;
	}
    } while (this.qns[ a + ":" + d + ":" + op.type]);

    this.qns[ a + ":" + d + ":" + op.type] = true;

    qtex = '';
    qdiv = $('<div>').addClass('question');

    qdiv.append(tomml(a));
    qtex += totex(a);
    qdiv.append($('<span>').addClass("separator").html(", "));
    qtex += ', ';
    qdiv.append($('<span>').addClass("linebreak").html(""));
    p = a;
    
    for (var j = 1; j < this.length; j++) {
	p = op.op(p,d);
	qdiv.append(tomml(p));
	qtex += totex(p);
	qdiv.append($('<span>').addClass("separator").html(", "));
	qtex += ', ';
	qdiv.append($('<span>').addClass("linebreak").html(""));
    }
    qdiv.append($('<span>').addClass("dots").html("..."));
    qtex += totex('\\dots');

    atex = '';
    adiv = $('<div>').addClass('answer');
    sep = ",";
    if (op.type == "Add ") {
	if (d > 0) {
	    atex = 'Add ' + totex(d);
	    adiv.append( $('<span>').html("Add " + d + ":").addClass('rule'));
	} else {
	    atex = 'Subtract ' + totex(-d);
	    adiv.append( $('<span>').html("Subtract " + (-d) + ":").addClass('rule'));
	}
    } else {
	atex = op.type + totex(d);
	adiv.append( $('<span>').html(op.type + d + ":").addClass('rule'));
    }
    adiv.append($('<span>').addClass("linebreak").html("&nbsp;"));
    atex += ': ';
    for (var j = 0; j < this.terms; j++) {
	adiv.append(tomml(op.op(p,d)));
	p = op.op(p,d);
	atex += totex(p);
	
	if (j == this.terms - 1) sep = ".";
	adiv.append($('<span>').addClass("separator").html(sep));
	adiv.append($('<span>').addClass("linebreak").html("&nbsp;"));
	atex += sep + ' ';
    }
    
    this.qn++;
    return new Question(qdiv, adiv, qtex, atex, this);
}

