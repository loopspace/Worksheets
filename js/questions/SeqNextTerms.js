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
    return 'Write down the rule and the next ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + ' for the sequnce ';
}

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
    
SeqNextTerms.createQuestion = function(question) {
    var a,d,op;
    var p,sep;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	d = randomFromRange(this.d,this.prng());
	op = this.mkop(this.linear);
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn([ a, d, op.type]))

    this.registerQn([ a, d, op.type]);

    question.qdiv.append(tomml(a));
    question.qtex += totex(a);
    question.qmkd += tomkd(a);
    question.qdiv.append($('<span>').addClass("separator").html(", "));
    question.qtex += ', ';
    question.qmkd += ', ';
    question.qdiv.append($('<span>').addClass("linebreak").html(""));
    p = a;
    
    for (var j = 1; j < this.length; j++) {
	p = op.op(p,d);
	question.qdiv.append(tomml(p));
	question.qtex += totex(p);
	question.qmkd += tomkd(p);
	question.qdiv.append($('<span>').addClass("separator").html(", "));
	question.qtex += ', ';
	question.qmkd += ', ';
	question.qdiv.append($('<span>').addClass("linebreak").html(""));
    }
    question.qdiv.append($('<span>').addClass("dots").html("..."));
    question.qtex += totex('\\dots');
    question.qmkd += tomkd('\\dots');

    sep = ",";
    if (op.type == "Add ") {
	if (d > 0) {
	    question.atex = 'Add ' + totex(d);
	    question.amkd = 'Add ' + tomkd(d);
	    question.adiv.append( $('<span>').html("Add " + d + ":").addClass('rule'));
	} else {
	    question.atex = 'Subtract ' + totex(-d);
	    question.amkd = 'Subtract ' + tomkd(-d);
	    question.adiv.append( $('<span>').html("Subtract " + (-d) + ":").addClass('rule'));
	}
    } else {
	question.atex = op.type + totex(d);
	question.amkd = op.type + tomkd(d);
	question.adiv.append( $('<span>').html(op.type + d + ":").addClass('rule'));
    }
    question.adiv.append($('<span>').addClass("linebreak").html("&nbsp;"));
    question.atex += ': ';
    question.amkd += ': ';
    for (var j = 0; j < this.terms; j++) {
	question.adiv.append(tomml(op.op(p,d)));
	p = op.op(p,d);
	question.atex += totex(p);
	question.amkd += tomkd(p);
	
	if (j == this.terms - 1) sep = ".";
	question.adiv.append($('<span>').addClass("separator").html(sep));
	question.adiv.append($('<span>').addClass("linebreak").html("&nbsp;"));
	question.atex += sep + ' ';
	question.amkd += sep + ' ';
    }
    
    return this;
}

