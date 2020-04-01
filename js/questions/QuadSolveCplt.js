function QuadSolveCplt() {
    var self = this;
    this.title = "Quadratics";
    this.storage = "QuadSolveCplt";
    this.qn = 0;
    this.quads = {"0:0:0": true};

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
	    name: "p",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>",
	    shortcut: "p",
	    type: "string",
	    default: "1"
	},
	{
	    name: "q",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>q</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>",
	    shortcut: "q",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "r",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>r</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>p</mi><mo stretchy=\"false\">(</mo><mi>x</mi><mo>+</mo><mi>q</mi><msup><mo stretchy=\"false\">)</mo> <mn>2</mn></msup><mo>+</mo><mi>r</mi></math>",
	    shortcut: "r",
	    type: "string",
	    default: "-5:5"
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
	this.explanation = 'Solve the following quadratic equations by completing the square.';
	this.shortexp = 'Solve by completing the square ';
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var p = 0,q = 0, r = 0;
	 var qdiv,adiv,a,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while (p == 0 || this.quads[ p + ":" + q + ":" + r]) {
	     p = randomFromRange(this.p,this.prng());
	     q = randomFromRange(this.q,this.prng());
	     r = randomFromRange(this.r,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.quads = {"0:0:0": true};
		 nqn = 0;
	     }
	}
	this.quads[ p + ":" + q + ":" + r] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];
	 coeffn = addCoefficient;
	 numbfn = addNumber;

	 var qmml = mmlelt('math').attr('display','inline');
	 if (coeffn(p,qtex,qmml)) {
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
	 if (coeffn(2*p*q,qtex,qmml)) {
	     qtex.push(' x ');
	     qmml.append(tommlelt('x'));

	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 numbfn(p * q**2 + r,qtex,qmml);
	 qmml.append(tommlelt('='));
	 qmml.append(tommlelt(0));

	 qdiv.append(qmml);
	 qtex.push(' = 0\\)');

	 var amml;
	 
	 if (p < 0) {
	     p = - p;
	     r = - r;
	 }
	 
	 if (r > 0) {
	     adiv.append($('<span>').html("No solution."));
	     atex = ['No solution.'];
	 } else {
	     r = - r;
	     q = - q;
	     amml = mmlelt('math').attr('display','inline');
	     amml.append(tommlelt('x'));
	     amml.append(tommlelt('='));
	     atex = ['\\( x = '];

	     var a = math.fraction(math.divide(r,p));
	     if (hasSquareRoot(a)) {
		 var b = math.fraction(math.add(q,a));
		 amml.append(tommlelt(b));
		 atex.push(texnum(b));

		 atex.push('\\)');

		 adiv.append(amml);
		 if (a == 0) {
		     adiv.append(amml);
		     adiv.append($('<span>').html(" repeated."));
		     atex.push(' repeated.');
		 } else {
		     adiv.append($('<span>').addClass("separator").html(", "));
		 
		     amml = mmlelt('math').attr('display','inline');
		     amml.append(tommlelt('x'));
		     amml.append(tommlelt('='));
		 
		     var b = math.fraction(math.subtract(q,a));
		     amml.append(tommlelt(b));
		     atex.push(', \\(x = ');
		     atex.push(texnum(b));
		     atex.push('\\)');
		     adiv.append(amml);
		 }

	     } else {
		 
		 if (q != 0) {
		     amml.append(tommlelt(q));
		     atex.push(q);
		 }

		 
		 if (r != 0) {
		     var b = math.fraction(math.divide(r,p));
		     amml.append(tommlelt('&plusmn;'));
		     amml.append(
			 mmlelt('msqrt').append(tommlelt(b))
		     );
		     atex.push('\\pm \\sqrt{' + texnum(b) + '}');
		 }
		 atex.push('\\)');
		 adiv.append(amml);
	     }
	 }
	 
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
    
    return this;
}


/*
Question type: Solve a quadratic using the formula
*/

