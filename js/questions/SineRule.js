
/*
  Trigonometry Questions
*/

SineRule = new QuestionGenerator(
    "Trigonometry",
    "Using the Sine Rule",
    "trig0",
    "SineR",
    [""]
);

SineRule.explanation = function() {
    return 'Find the stated angle or length in each of the following triangles.';
}
SineRule.shortexp = function() {
    return 'Let ' + tomml('ABC')[0].outerHTML + ' be a triangle. ';
}

SineRule.addOption("d","Accuracy of numbers","d","string","3");
SineRule.addOption("m","Multiplier for side length","m","range","3:10");
SineRule.addOption("obtuse","Allow obtuse angles","b","boolean",false);
SineRule.addOption("ambiguous","Allow ambiguous triangles","g","boolean",false);

SineRule.createQuestion = function(question) {
    var a = [];
    var qtexa,atexa;
    var nqn = 0;

    var A,B,C,p,r,s,m,omit,find;
    p = Math.pow(10,this.d);
    r = '1:' + (p-1);
    s = 0;

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
	omit = randomFromRange('0:2',this.prng());
	find = randomFromRange('0:3',this.prng());
	if (!this.ambiguous && find < 2) {
	    // Finding an angle,
	    var b = a.slice(0,3);
	    b.splice(omit,1);
	    // Check for ambiguous case:
	    // 180 - A + B < 180
	    // => -A + B < 0
	    // => B < A
	    if (b[find] > b[1 - find]) {
		a = [];
		continue;
	    }
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

    var triangle = makeTriangle(a);
    
    for (var i = 0; i < 6; i++) {
	a[i] = Math.roundsf(a[i],this.d);
    }
    
    a.splice(omit+3,1);
    a.splice(omit,1);

    omit = randomFromRange('0:2',this.prng());
    var labels = ["C","B","A"];
    labels.splice(omit,1);
    if (this.prng() > .5) {
	labels.sort();
    }
    labels.push(labels[0].toLowerCase());
    labels.push(labels[1].toLowerCase());

    var ans;
    if (find == 0) {
	// A = sin^{-1}(a * sin(B)/b)
	ans = Math.asin( a[2] * Math.sin(a[1] * Math.PI/180 )/a[3] ) * 180/Math.PI;
    } else if (find == 1) {
	ans = Math.asin( a[3] * Math.sin(a[0] * Math.PI/180 )/a[2] ) * 180/Math.PI;
    } else if (find == 2) {
	// a = b * sin(A)/sin(B)
	ans = a[3] * Math.sin(a[0] * Math.PI/180)/Math.sin(a[1] * Math.PI/180);
    } else {
	ans = a[2] * Math.sin(a[1] * Math.PI/180)/Math.sin(a[0] * Math.PI/180);
    }

    //	ans = Math.floor(ans * p + .5)/p;
    ans = Math.roundsf(ans,this.d);

    question.qdiv = $('<div>').addClass('question');
    question.adiv = $('<div>').addClass('answer');
    qtexa = ['Find ','\\(',labels[find], '\\)', ', ', 'where '];
    atexa = [];

    question.qdiv.append(
	$('<span>').append('Find ')
    ).append(
	tomml(labels[find])
    ).append(
	$('<span>').append(', where ')
    );
//    question.qdiv.append(triangle);
    
    var qmml,amml;

    var seps = [', ', ', ', '.'];
    var sep;
    
    for (var i = 0; i < 4; i++) {
	if (i != find) {
	    sep = seps.shift();
	    qmml = mmlelt('math').attr('display','inline');
	    qmml.append(tommlelt(labels[i]))
		.append(tommlelt("="));
	    if (i < 2) {
		qmml.append(
		    mmlelt('msup').append(
			tommlelt(a[i])
		    ).append(
			tommlelt('&#xb0;')
		    )
		)
	    } else {
		qmml.append(tommlelt(a[i]));
	    }
	    

	    question.qdiv.append(qmml)
		.append($('<span>').append(sep).addClass('separator'));

	    qtexa.push('\\(');
	    qtexa.push(labels[i]);
	    qtexa.push("=");
	    if (i < 2)
		qtexa.push("\\ang{");
	    qtexa.push(a[i]);
	    if (i < 2)
		qtexa.push("}");
	    qtexa.push('\\)');
	    qtexa.push(sep);

	} else {
	    amml = mmlelt('math').attr('display','inline');
	    amml.append(tommlelt(labels[i]))
		.append(tommlelt("="))
	    if (i < 2) {
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
	    if (i < 2)
		atexa.push("\\ang{");
	    atexa.push(ans);
	    if (i < 2)
		atexa.push("}");
	    atexa.push('\\)');

	    if (i < 2 && ans > a[1 - i]) {

		question.adiv.append($('<span>').append(' or '));
		
		amml = mmlelt('math').attr('display','inline');
		amml.append(tommlelt(labels[i]))
		    .append(tommlelt("="))
		    .append(
			mmlelt('msup').append(
			    tommlelt(180 - ans)
			).append(
			    tommlelt('&#xb0;')
			)
		    );
		question.adiv.append(amml);

		atexa.push(' or ');
		atexa.push('\\(');
		atexa.push(labels[i]);
		atexa.push("=");
		atexa.push("\\ang{");
		atexa.push(180 - ans);
		atexa.push("}");
		atexa.push('\\)');
	    }
	}
    }

    question.qmkd = textomkda(qtexa).join('');
    question.amkd = textomkda(atexa).join('');

    question.qtex = qtexa.join('');
    question.atex = atexa.join('');
    return this;
}

