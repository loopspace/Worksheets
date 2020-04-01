function CosineRule() {
    var self = this;
    this.title = "Using the Cosine Rule";
    this.storage = "CosineR";
    this.qn = 0;
    this.triangles = {"": true};

    var seedgen = new Math.seedrandom();

    this.options = [
	{
	    name: "seed",
	    text: "Random seed",
	    shortcut: "s",
	    type: "string",
	    default: ''
	},
	{
	    name: "size",
	    text: "Number of questions",
	    shortcut: "z",
	    type: "integer",
	    default: 10
	},
	{
	    name: "d",
	    text: "Accuracy of numbers",
	    shortcut: "d",
	    type: "string",
	    default: "3"
	},
	{
	    name: "m",
	    text: "Multiplier for side length",
	    shortcut: "m",
	    type: "range",
	    default: "3:10"
	},
	{
	    name: "obtuse",
	    text: "Allow obtuse angles",
	    shortcut: "b",
	    type: "boolean",
	    default: false
	},
	{
	    name: "repeat",
	    text: "Repeat Questions",
	    shortcut: "t",
	    type: "boolean",
	    default: false
	}
    ];

    var optdict = {};
    for (var i = 0; i < this.options.length; i++) {
	optdict[this.options[i].name] = i;
    }

    this.setOptions = function() {
	for (var i = 0; i < this.options.length; i++) {
	    if (this.options[i].type == "integer") {
		this.options[i].value = makeInt(this.options[i].element.val(),this.options[i].default);
	    } else if (this.options[i].type == "boolean") {
		this.options[i].value = this.options[i].element.is(':checked');
	    } else {
		if (this.options[i].element.val() == '') {
		    this.options[i].value = this.options[i].default;
		} else {
		    this.options[i].value = this.options[i].element.val();
		}
	    }
	    this[this.options[i].name] = this.options[i].value;
	    localStorage.setItem(this.storage + ':' + this.options[i].shortcut, this.options[i].value);
	}
	if (this.seed == '') {
	    this.seed = Math.abs(seedgen.int32()).toString();
	    this.options[optdict.seed].value = this.seed;
	    localStorage.removeItem(this.storage + ':' + this.options[optdict.seed].shortcut);
	}
	this.prng = new Math.seedrandom(this.seed);
	this.explanation = 'Find the stated angle or length in each of the following triangles.';
	this.shortexp = 'Let ' + tomml('ABC')[0].outerHTML + ' be a triangle. ';
    }

    this.reset = function() {
	this.qn = 0;
	this.triangles = {"": true};
    }

    this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	var a = [];
	var qdiv,adiv,qtex,atex;
	var nqn = 0;

	var A,B,C,p,r,s,m,omit,find;
	p = Math.pow(10,this.d);
	r = '1:' + (p-1);

	while (this.triangles[a.join(':')]) {

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
		this.triangles = {"": true};
		nqn = 0;
		break;
	    }
	}

	this.triangles[a.join(':')] = true;
	
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

	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['Find ','\\(',labels[find], '\\), ', 'where '];
	atex = [];

	qdiv.append(
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
		

	    qdiv.append(qmml)
		.append($('<span>').append(sep).addClass('separator'));
	    
	    qtex.push('\\(');
	    qtex.push(labels[qninf[i]]);
	    qtex.push("=");
	    if (qninf[i] < 2)
		qtex.push("\\ang{");
	    qtex.push(a[qninf[i]]);
	    if (qninf[i] < 2)
		qtex.push("}");
	    qtex.push('\\)');
	    qtex.push(sep);

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
	adiv.append(amml);

	atex.push('\\(');
	atex.push(labels[i]);
	atex.push("=");
	if (find < 2)
	    atex.push("\\ang{");
	atex.push(ans);
	if (find < 2)
	    atex.push("}");
	atex.push('\\)');
	
	this.qn++;
	return [qdiv, adiv, qtex.join(''), atex.join('')];
    }

    return this;
}

/*
Question Type: Solve an Equation
*/

// One-sided equations

