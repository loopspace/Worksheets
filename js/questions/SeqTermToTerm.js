/*
Question Type: Sequences

Question Type: Sequences Term to Term

Given first term and rule in a simple sequence, write down the next k terms.
*/

SeqTermToTerm = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq1",
    "SeqTermToTerm",
    ["0:0:Add "]
);

SeqTermToTerm.explanation = function() {
    return 'For each sequence, write down the first ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + '.';
}


SeqTermToTerm.shortexp = function() {
    return 'Write down the first ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + ' of ';
}

SeqTermToTerm.addOption("terms", "Number of asked for terms", "t", "integer", 4);
SeqTermToTerm.addOption("a", "Range for first term", "a", "string", "1:10");
SeqTermToTerm.addOption("d", "Range for term-to-term", "d", "string", "1:10");
SeqTermToTerm.addOption("linear", "Only linear sequences", "l", "boolean", true);


SeqTermToTerm.mkop = function(n) {
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

SeqTermToTerm.createQuestion = function(question) {
    var a,d,op;
    var p,sep;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	d = randomFromRange(this.d,this.prng());
	op = this.mkop(this.linear);
	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while (this.checkQn([ a,  d, op.type]))

    this.registerQn([ a, d, op.type]);
    
    question.qdiv.append( $('<span>').append("First term: ").append(tomml(a)).append(", "));
    question.qtex += "First term: " + totex(a) + ", ";
    if (op.type == "Add ") {
	if (d > 0) {
	    question.qdiv.append( $('<span>').append("rule: Add ").append(tomml(d)).append("."));
	    question.qtex += 'rule: Add ' + totex(d) + ".";
	} else {
	    question.qdiv.append( $('<span>').append("rule: Subtract ").append(tomml(-d)).append("."));
	    question.qtex += 'rule: Subtract ' + totex(-d) + ".";
	}
    } else {
	question.qdiv.append( $('<span>').append("rule: " + op.type).append(tomml(d)).append("."));
	question.qtex += 'rule: ' + op.type + totex(d) + '.';
    }
    
    question.adiv.append(tomml(a));
    p = a;
    question.atex += totex(a);

    for (var j = 1; j < this.terms; j++) {
	question.adiv.append($('<span>').addClass("separator").html(", "));
	question.adiv.append($('<span>').addClass("linebreak").html(""));
	p = op.op(p,d);
	question.adiv.append(tomml(p));
	question.atex += ', ' + totex(p);
    }
    question.adiv.append($('<span>').addClass("dots").html("."));
    question.atex += '.';

    return this;
}
