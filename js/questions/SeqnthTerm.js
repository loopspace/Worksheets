/*
Question Type: Sequences

Question Type: Sequences nth Term Rule

Given nth term rule, write down the first k terms.
*/

SeqnthTerm = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq2",
    "SeqnthTerm",
    ["0:0:0"]
);

SeqnthTerm.explanation = function() {
    return 'For each sequence, write down the first ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + '.';
}

SeqnthTerm.shortexp = function() {
    return 'Write down the first ' + (this.terms == 1 ? 'term' :  int_to_words(this.terms) + ' terms') + ' of ';
}

SeqnthTerm.addOption("terms", "Number of asked for terms", "t", "integer", 4);
SeqnthTerm.addOption("a", "Range for quadratic term", "a", "string", "0:2");	
SeqnthTerm.addOption("b", "Range for linear term", "b", "string", "0:6");	
SeqnthTerm.addOption("c", "Range for constant term", "c", "string", "1:10");

SeqnthTerm.createQuestion = function(question) {
    var a = 0,b = 0,c = 0;
    var p,sep;
    var nqn = 0;

    do {
	a = randomFromRange(this.a,this.prng());
	b = randomFromRange(this.b,this.prng());
	c = randomFromRange(this.c,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn([ a, b, c ]));
    this.registerQn([ a, b , c ]);
	
    var quad = mmlelt('math').attr('display','inline');
    var quadtex = '';
    if (a != 0) {
	if (a != 1) {
	    if (a == -1) {
		quad.append(tommlelt('-').attr('lspace',"verythinmathspace").attr('rspace',"0em"));
		quadtex += '-';
	    } else {
		quad.append(tommlelt(a));
		quadtex += a;
	    }
	}
	quad.append(
	    mmlelt('msup').append(
		tommlelt('n')
	    ).append(
		tommlelt('2')
	    )
	);
	quadtex += 'n^2';
    }
    if (b != 0) {
	if (a != 0) {
	    if (b > 0) {
		quad.append(tommlelt('+'));
		quadtex += '+';
	    } else {
		quad.append(tommlelt('-'));
		quadtex += '-';
	    }
	} else if (b < 0) {
	    quad.append(tommlelt('-').attr('lspace',"verythinmathspace").attr('rspace',"0em"));
	    quadtex += '-';
	}
	if (b != 1 && b != -1) {
	    quad.append(tommlelt(math.abs(b)));
	    quadtex += b;
	}
	quad.append(tommlelt('n'));
	quadtex += 'n';
    }
    if (c != 0) {
	if (a != 0 || b != 0) {
	    if (c > 0) {
		quad.append(tommlelt('+'));
		quadtex += '+';
	    } else {
		quad.append(tommlelt('-'));
		quadtex += '-';
	    }		    
	} else if (c < 0) {
	    quad.append(tommlelt('-').attr('lspace',"verythinmathspace").attr('rspace',"0em"));
	    quadtex += '-';
	}
	quad.append(tommlelt(math.abs(c)));
	quadtex += c;
    }
    
    question.qdiv.append( $('<span>').append(tomml('n')).append("th term is: ").append(quad) );
    question.qtex += totex('n') + 'th term is: ' + texwrap(quadtex);
    
    for (var j = 0; j < this.terms; j++) {
	p = a*(j+1)^2 + b*(j+1) + c;
	question.adiv.append(tomml(p));
	question.atex += totex(p);
	if (j != this.terms - 1) {
	    question.adiv.append($('<span>').addClass("separator").html(", "));
	    question.adiv.append($('<span>').addClass("linebreak").html(""));
	    question.atex += ', ';
	}
    }
    question.adiv.append($('<span>').addClass("dots").html("."));
    question.atex += '.';
    
    return this;
}
