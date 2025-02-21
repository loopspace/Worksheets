
// From standard form

FromStdForm = new QuestionGenerator(
    "Standard Form",
    "From Standard Form",
    "arith5",
    "FromStdForm",
    [":0"]
);

FromStdForm.explanation = function() {
    return 'Write the following as normal numbers.';
}
FromStdForm.shortexp = function() {
    return 'Write as a normal number ';
}

FromStdForm.addOption("d","Range for number of significant figures","d","string","1:10");
FromStdForm.addOption("e","Range for exponent","e","string","3:5");

FromStdForm.createQuestion = function(question) {
    var a = [];
    var qtexa,atexa;
    var nqn = 0;
    
    var n = 0,e = 0;

    do {
	n = 0;
	while (n < 1) {
	    n = randomFromRange(this.d,this.prng());
	}
	e = randomFromRange(this.e,this.prng());
	a = [];
	a.push(randomFromRange("1:9",this.prng()));
	for (var i = 1; i < n-1; i++) {
	    a.push(randomFromRange("0:9",this.prng()));
	}
	a.push(randomFromRange("1:9",this.prng()));
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while (this.checkQn(a.join(':') + ':' + e))

    this.registerQn(a.join(':') + ':' + e);

    var ans = a[0];
    if (a.length > 1) {
	ans += '.' + a.slice(1).join('');
    }

    var qn;
    if (e < 0) {
	qn = "0." + "0".repeat(-1-e);
	qn += a.join('');
    } else {
	if (e < a.length-1) {
	    qn = a.slice(0,e+1).join('') + '.' + a.slice(e+1).join('');
	} else {
	    qn = a.join('') + "0".repeat(e-a.length+1);
	}
    }

    /*
      Code copied from the previous section so qn and ans are swapped over.
    */
    
    qtexa = ['\\('];
    atexa = ['\\('];

    var qmml = mmlelt('math').attr('display','inline');
    
    qmml.append(mmlelt('mi').html(qn));
    qtexa.push(qn);

    qtexa.push('\\)');
    question.adiv.append(qmml);
    
    var amml = mmlelt('math').attr('display','inline');
    amml.append(mmlelt('mi').html(ans));
    atexa.push(ans);
    atexa.push('\\times');
    atexa.push('10^{' + e + '}');
    amml.append(mmlelt('mo').html('&times;'));
    amml.append(
	mmlelt('msup')
	    .append(tommlelt(10))
	    .append(tommlelt(e))
    );
    
    question.qdiv.append(amml);
    atexa.push('\\)');

    question.atex = qtexa.join('');
    question.qtex = atexa.join('');

    return this;
}
