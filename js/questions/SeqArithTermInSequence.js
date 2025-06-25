/*
Question Type: Sequences

Find where a value appears in a sequence, if it does
*/

SeqArithFIndTerm = new QuestionGenerator(
    "Sequences",
    "Sequence",
    "seq13",
    "SeqArithFindTerm",
    ["0:0"]
);

SeqArithFIndTerm.explanation = function() {
    return 'For each linear sequence, specified by its nth term rule, find where the value occurs or show that it doesn\'t occur in that sequence.';
}
SeqArithFIndTerm.shortexp = function () {
    return 'For the following linear sequence, find - if possible - the term with value ';
}

SeqArithFIndTerm.addOption("b","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><semantics><mrow><mi>b</mi></mrow><annotation encoding='application/x-tex'>b</annotation></semantics></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><semantics><mrow><mi>d</mi><mi>n</mi><mo>+</mo><mi>b</mi></mrow><annotation encoding='application/x-tex'>d n + b</annotation></semantics></math>","b","string","1:10");
SeqArithFIndTerm.addOption("d","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><semantics><mrow><mi>d</mi></mrow><annotation encoding='application/x-tex'>d</annotation></semantics></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><semantics><mrow><mi>d</mi><mi>n</mi><mo>+</mo><mi>b</mi></mrow><annotation encoding='application/x-tex'>d n + b</annotation></semantics></math>","b","string","1:10");

SeqArithFIndTerm.addOption("n","Range for where the value can occur","n","string","5:20");
SeqArithFIndTerm.addOption("intonly","Integer only values","i","boolean","true");
    
SeqArithFIndTerm.createQuestion = function(question) {
    var b,d;
    var n,sep;
    var qtexa,qmml,atexa,amml,qmkda,amkda;
    var nqn = 0;

    do {
	b = randomFromRange(this.b,this.prng());
	d = randomFromRange(this.d,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn([ b, d ]))

    this.registerQn([ b, d]);

    if (this.intonly) {
	nqn = 0;
	do {
	    n = randomFromRange(this.n,this.prng());
	    nqn++;
	    if (nqn == 10) {
		this.resetSaved();
	    }
	    if (nqn == 20) {
		return false;
	    }
	} while (!math.isInteger(math.multiply(n,d)))
    } else {
	n = randomFromRange(this.n, this.prng());
    }

    val = math.add(b, math.multiply( n, d) );

    qtexa = [];
    qmkda = [];
    atexa = [];
    amkda = [];
    qmml = mmlelt('math').attr('display', 'inline');
    amml = mmlelt('math').attr('display', 'inline');
    
    if (n.d == 1) {
	question.adiv.append(
	    $('<span>').append(
		n + ordinal_suffix_of(n) + ' term'
	    )
	);
	question.atex = totex(n) + ordinal_suffix_of(n) + ' term';
	question.amkd = tomkd(n) + ordinal_suffix_of(n) + ' term';
    } else {
	question.adiv.append(
	    $('<span>').append(
		'No, it does not occur ('
	    ).append(
		mmlelt('math').attr('display','inline').append(
		    tommlelt("n")
		).append(
		    tommlelt("=")
		).append(
		    tommlelt(n)
		)
	    ).append(')')
	);
	question.atex = 'No, it does not occur (' + texwrap('n = ' + texnum(n))  + ')';
	question.amkd = 'No, it does not occur (' + mkdwrap('n = ' + texnum(n))  + ')';
	
    }

    qtexa.push('Sequence ');
    qtexa.push('\\(')
    addPolynomial([ [d,1], [b,0] ], qtexa, qmml, 'n');
    qtexa.push('\\)');
    qtexa.push(', value ');
    qtexa.push(totex(val));
    
    question.qtex = qtexa.join('');
    question.qmkd = textomkda(qtexa).join('');
    question.qdiv.append(
	$('<span>').append(
	    'Sequence '
	).append(
	    qmml
	).append(
	    ', value '
	).append(
	    tomml(val)
	)
    );

    return this;
}
