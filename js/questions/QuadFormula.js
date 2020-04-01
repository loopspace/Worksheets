function QuadFormula() {
    var self = this;
    this.title = "Quadratics";
    this.storage = "QuadFormula";
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
	    name: "a",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "a",
	    type: "string",
	    default: "1"
	},
	{
	    name: "b",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "b",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "c",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><msup><mi>x</mi> <mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "c",
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
	this.explanation = 'Solve the following quadratic equations.';
	this.shortexp = 'Solve ';
    }

    this.reset = function() {
	this.qn = 0;
	this.quads = {"0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var a = 0,b = 0, c = 0;
	 var qdiv,adiv,p,q,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while (a == 0 || this.quads[ a + ":" + b + ":" + c]) {
	     a = randomFromRange(this.a,this.prng());
	     b = randomFromRange(this.b,this.prng());
	     c = randomFromRange(this.c,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.quads = {"0:0:0": true};
		 nqn = 0;
	     }
	}
	this.quads[ a + ":" + b + ":" + c] = true;
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];

	 coeffn = addCoefficient;
	 numbfn = addNumber;

	 var qmml = mmlelt('math').attr('display','inline');
	 if (coeffn(a,qtex,qmml)) {
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

	 if (coeffn(b,qtex,qmml)) {
	     qtex.push(' x ');
	     qmml.append(tommlelt('x'));

	     coeffn = addSignedCoefficient;
	     numbfn = addSignedNumber;
	 }

	 numbfn(c,qtex,qmml);

	 qmml.append(tommlelt('='));
	 qmml.append(tommlelt('0'));
	 
	 qdiv.append(qmml);
	 qtex.push('= 0 \\)');

	 var amml;
	 numbfn = addNumber;
	 coeffn = addCoefficient;

	 p = b**2 - 4*a*c;

	 if (p < 0) {
	     adiv.append($('<span>').html("No solution: "));
	     amml = mmlelt('math').attr('display','inline');
	     amml.append(
		 mmlelt('msup').append(
		     tommlelt('b')
		 ).append(
		     tommlelt('2')
		 )
	     );
	     amml.append(tommlelt('-'));
	     amml.append(tommlelt(4));
	     amml.append(tommlelt('a'));
	     amml.append(tommlelt('c'));
	     amml.append(tommlelt('='));
	     amml.append(tommlelt(p));
	     adiv.append(amml);

	     atex.push('No solution: \\(b^2 - 4 a c = ' + texnum(p) + '\\).');
	 } else {
	     amml = mmlelt('math').attr('display','inline');
	     amml.append(tommlelt('x'));
	     amml.append(tommlelt('='));
	     atex.push('\\( x = ');

	     if (p != 0) {

		 var pd = primeDecomposition(p);
		 var nsq = 1;
		 var sq = 1;

		 var l;
		 for (var i = 0; i < pd.length; i++) {
		     l = pd[i][1];
		     if (l%2 == 1) {
			 sq *= pd[i][0];
			 l--;
		     }
		     l /= 2;
		     for (var j = 0; j < l; j++) {
			 nsq *= pd[i][0];
		     }
		 }

		 if (sq == 1) {
		     q = math.fraction(math.divide(-b + nsq,2*a));
		     amml.append(tommlelt(q));
		     atex.push(texnum(q));


		     atex.push('\\), \\(x = ');
		     adiv.append(amml);
		     adiv.append($('<span>').addClass("separator").html(", "));
		 
		     amml = mmlelt('math').attr('display','inline');
		     amml.append(tommlelt('x'));
		     amml.append(tommlelt('='));
		     
		     q = math.fraction(math.divide(-b - nsq,2*a));
		     amml.append(tommlelt(q));
		     atex.push(texnum(q));
		 } else {
		     q = math.fraction(math.divide(-b,2*a));
		     numbfn(q,atex,amml);
		     
		     amml.append(tommlelt('&plusmn;'));
		     atex.push(' \\pm ');

		     q = math.fraction(math.divide(nsq,math.abs(2*a)));
		     coeffn(q,atex,amml);
		 
		     amml.append(
			 mmlelt('msqrt')
			     .append(mmlelt('mrow')
				     .append(tommlelt(sq))
				    )
		     );

		     atex.push('\\sqrt{');
		     atex.push(sq);
		     atex.push('}');
		 }
		 atex.push('\\)');
		 adiv.append(amml);
	     } else {
		 q = math.fraction(math.divide(-b,2*a));
		 amml.append(tommlelt(q));
		 atex.push(texnum(q));

		 adiv.append(amml);
		 adiv.append($('<span>').html(" repeated."));
		 atex.push('\\)');
		 atex.push(' repeated.');
		 
	     }
	 }
	 
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
    
    return this;
}

/*
  Arithmetic
*/

/*
  Question Type: Multiple add and subtracts
*/

