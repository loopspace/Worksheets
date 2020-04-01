function OneEqSolve() {
    var self = this;
    this.title = "One-sided Equations";
    this.storage = "OneEqSolve";
    this.qn = 0;
    this.eqns = {"0:0:0": true};

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
	    name: "a",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi></math>",
	    shortcut: "a",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "b",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi></math>",
	    shortcut: "b",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "x",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi></math>",
	    shortcut: "x",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "v",
	    text: "Range for letters used for variables",
	    shortcut: "v",
	    type: "string",
	    default: "x"
	},
	{
	    name: "repeat",
	    text: "Repeat Questions",
	    shortcut: "r",
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
	this.explanation = 'Solve each equation';
	this.shortexp = 'Solve ';
    }

    this.reset = function() {
	this.qn = 0;
	this.eqns = {"0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var a = 0, b = 0, x = 0, v = "";
	 var qdiv,adiv,p,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while ( a == 0 || this.eqns[ a + ":" + b + ":" + x ]) {
	     a = randomFromRange(this.a,this.prng());
	     b = randomFromRange(this.b,this.prng());
	     x = randomFromRange(this.x,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.eqns = {"0:0:0": true};
		 nqn = 0;
	     }
	}
	this.eqns[ a + ":" + b + ":" + x ] = true;

	 v = randomLetterFromRange(this.v,this.prng());
	 
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];

	 var qmml = mmlelt('math').attr('display','inline');

	 addCoefficient(a, qtex, qmml);
	 qmml.append(tommlelt(v));
	 qtex.push(v);
	 addSignedNumber(b, qtex, qmml);
	 
	 qmml.append(tommlelt('='));
	 qtex.push('=');
	 
	 qmml.append(tommlelt(a*x+b));
	 qtex.push(a*x+b);
	 
	 qdiv.append(qmml);
	 qtex.push('\\)');
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex.push('\\(');

	 amml.append(tommlelt(v));
	 atex.push(v);
	 
	 amml.append(tommlelt('='));
	 atex.push('=');
	 
	 amml.append(tommlelt(x));
	 atex.push(x);
	 
	 adiv.append(amml);
	 atex.push('\\)');
	
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
   
    
    return this;
}

// Two-sided equations

