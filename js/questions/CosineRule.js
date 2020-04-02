CosineRule = new QuestionGenerator(
    "Trigonometry",
    "Using the Cosine Rule",
    "trig1",
    "CosineR",
    [""]
);

CosineRule.explanation = function() {
    return 'Find the stated angle or length in each of the following triangles.';
}
CosineRule.shortexp = function() {
    return 'Let ' + tomml('ABC')[0].outerHTML + ' be a triangle. ';
}


CosineRule.addOption("d","Accuracy of numbers","d","string","3");
CosineRule.addOption("m","Multiplier for side length","m","range","3:10");
CosineRule.addOption("obtuse","Allow obtuse angles","b","boolean",false);

CosineRule.createQuestion = function(question) {
    var a = [];
    var qtexa,atexa;
    var nqn = 0;

    var A,B,C,p,r,s,m,omit,find;
    p = Math.pow(10,this.d);
    r = '1:' + (p-1);

    do {

	A = 0;
	B = 0;

	while (A == B) {
	    A = randomFromRange(r,this.prng());
	    B = randomFromRange(r,this.prng());
	}

	a = [A,B];
	a.sort(function(a, b) {return a - b;});

	a[2] = p - a[1];
	a[1] -= a[0];

	a.sort(function(a, b) {return a - b;});

	if (!this.obtuse && a[2] > p/2) {
	    a = [];
	    continue;
	}

	a.push(randomFromRange(r,this.prng()));

	nqn++;
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	    break;
	}
    } while (this.checkQn(a)) 


    this.registerQn(a);
    
    m = randomFromRange(this.m,this.prng());
    
    a[0] *= 180/p;
    a[1] *= 180/p;
    a[2] *= 180/p;

    a.push(a[3] * Math.sin(a[1]*Math.PI/180)/Math.sin(a[0]*Math.PI/180));
    a.push(a[3] * Math.sin(a[2]*Math.PI/180)/Math.sin(a[0]*Math.PI/180));

    a[3] *= m/p;
    a[4] *= m/p;
    a[5] *= m/p;

    for (var i = 0; i < 6; i++) {
	a[i] = Math.roundsf(a[i],this.d);
    }
    
    find = randomFromRange('0:5',this.prng());
    
    var labels = ["A","B","C","a","b","c"];

    var ans;
    var qninf;

    if (find < 3) {
	// A = cos^{-1}( (b^2 + c^2 - a^2)/(2 b c))
	var b,c;
	b = (find + 1)%3 + 3;
	c = (find + 2)%3 + 3;
	ans = Math.acos( (a[b] * a[b] + a[c] * a[c] - a[find+3] * a[find+3]) / (2 * a[b] * a[c])) * 180/Math.PI;
	qninf = [3,4,5];
    } else {
	var b,c;
	b = (find + 1)%3 + 3;
	c = (find + 2)%3 + 3;
	ans = a[b] * a[b] + a[c] * a[c] - 2 * a[b] * a[c] * Math.cos( a[find-3] * Math.PI/180);
	qninf = [find-3,b,c];
	qninf.sort(function(a, b) {return a - b;});
    }

    ans = Math.roundsf(ans,this.d);

    question.qdiv = $('<div>').addClass('question');
    question.adiv = $('<div>').addClass('answer');
    qtexa = ['Find ','\\(',labels[find], '\\), ', 'where '];
    atexa = [];

    question.qdiv.append(
	$('<span>').append('Find ')
    ).append(
	tomml(labels[find])
    ).append(
	$('<span>').append(', where ')
    );
    
    var qmml,amml;

    var seps = [', ', ', ', '.'];
    var sep;

    
    for (var i = 0; i < qninf.length; i++) {
	sep = seps.shift();
	qmml = mmlelt('math').attr('display','inline');
	qmml.append(tommlelt(labels[qninf[i]]))
	    .append(tommlelt("="));
	if (qninf[i] < 2) {
	    qmml.append(
		mmlelt('msup').append(
		    tommlelt(a[qninf[i]])
		).append(
		    tommlelt('&#xb0;')
		)
	    )
	} else {
	    qmml.append(tommlelt(a[qninf[i]]));
	}
	

	question.qdiv.append(qmml)
	    .append($('<span>').append(sep).addClass('separator'));
	
	qtexa.push('\\(');
	qtexa.push(labels[qninf[i]]);
	qtexa.push("=");
	if (qninf[i] < 2)
	    qtexa.push("\\ang{");
	qtexa.push(a[qninf[i]]);
	if (qninf[i] < 2)
	    qtexa.push("}");
	qtexa.push('\\)');
	qtexa.push(sep);

    }

    amml = mmlelt('math').attr('display','inline');
    amml.append(tommlelt(labels[find]))
	.append(tommlelt("="))
    if (find < 2) {
	amml.append(
	    mmlelt('msup').append(
		tommlelt(ans)
	    ).append(
		tommlelt('&#xb0;')
	    )
	)
    } else {
	amml.append(tommlelt(ans));
    }
    question.adiv.append(amml);

    atexa.push('\\(');
    atexa.push(labels[i]);
    atexa.push("=");
    if (find < 2)
	atexa.push("\\ang{");
    atexa.push(ans);
    if (find < 2)
	atexa.push("}");
    atexa.push('\\)');
    
    question.qtex = qtexa.join('');
    question.atex = atexa.join('');

    return this;
}
