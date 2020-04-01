function QuadFact() {
    var self = this;
    this.title = "Quadratics";
    this.storage = "QuadFact";
    this.qn = 0;
    this.quads = {"0:0:0:0": true};

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
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "a",
	    type: "string",
	    default: "1"
	},
	{
	    name: "b",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "b",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "c",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "c",
	    type: "string",
	    default: "1"
	},
	{
	    name: "d",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>d</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mo stretchy=\"false\">(</mo><mi>c</mi><mi>x</mi><mo>+</mo><mi>d</mi><mo stretchy=\"false\">)</mo></math>",
	    shortcut: "d",
	    type: "string",
	    default: "-5:5"
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
	this.explanation = 'Factorise each quadratic expression';
	this.shortexp = 'Factorise ';
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var a = 0,b = 0, c = 0,d = 0;
	 var qdiv,adiv,p,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while (math.gcd(a,b,c,d) != 1 || a * c == 0 || b**2 + d**2 == 0 || this.quads[ a + ":" + b + ":" + c + ":" + d]) {
	     a = randomFromRange(this.a,this.prng());
	     b = randomFromRange(this.b,this.prng());
	     c = randomFromRange(this.c,this.prng());
	     d = randomFromRange(this.d,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.quads = {"0:0:0:0": true};
		 nqn = 0;
	     }
	}
	this.quads[ a + ":" + b + ":" + c + ":" + d] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];
	 coeffn = addCoefficient;
	 numbfn = addNumber;

	 var qmml = mmlelt('math').attr('display','inline');

	 if (coeffn(a * c,qtex,qmml)) {
	     qmml.append(
		 mmlelt('msup').append(
		     tommlelt('x')
		 ).append(
		     tommlelt('2')
		 )
	     );
	     qtex.push('x^2');
	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 if (coeffn(a * d + c * b,qtex,qmml)) {
	     qtex.push(' x ');
	     qmml.append(tommlelt('x'));
	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 numbfn(b * d,qtex,qmml);
	 qdiv.append(qmml);
	 qtex.push('\\)');
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex.push('\\(');

	 coeffn = addCoefficient;
	 numbfn = addNumber;

	 if (b != 0) {
	     atex.push("(");
	     amml.append(tommlelt('('));
	 }
	 
	 if (coeffn(a,atex,amml)) {
	     atex.push(" x ");
	     amml.append(tommlelt('x'));
	     numbfn = addSignedNumber;
	 }

	 if (numbfn(b,atex,amml)) {
	     atex.push(")");
	     amml.append(tommlelt(')'));
	 }

	 numbfn = addNumber;

	 if (d != 0) {
	     atex.push("(");
	     amml.append(tommlelt('('));
	 }
	 
	 if (coeffn(c,atex,amml)) {
	     atex.push(" x ");
	     amml.append(tommlelt('x'));
	     numbfn = addSignedNumber;
	 }

	 if (numbfn(d,atex,amml)) {
	     atex.push(")");
	     amml.append(tommlelt(')'));
	 }
	 
	 adiv.append(amml);
	 atex.push('\\)');
	
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
   
    
    return this;
}

/*
Question type: Solve a quadratic using factorisation
*/

