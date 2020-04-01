function SimEqSolve () {
    var self = this;
    this.title = "Simultaneous Equations";
    this.storage = "SimEqSolve";
    this.qn = 0;
    this.eqns = {"0:0:0:0:0:0": true};

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
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mi>y</mi><mo>=</mo><mi>c</mi></math>",
	    shortcut: "a",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "b",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>b</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mi>y</mi><mo>=</mo><mi>c</mi></math>",
	    shortcut: "b",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "x",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> and <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>a</mi><mi>x</mi><mo>+</mo><mi>b</mi><mi>y</mi><mo>=</mo><mi>c</mi></math>",
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
	this.explanation = 'Solve each pair of equations';
	this.shortexp = 'Solve ';
    }

    this.reset = function() {
	this.qn = 0;
	this.eqns = {"0:0:0:0:0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var a = 0, b = 0, c = 0, d = 0, x = 0, y = 0, u = "", v = "";
	 var e, f;
	 var qdiv,adiv,p,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while ( a*b*c*d == 0 || a*d - b*c == 0 || this.eqns[ a + ":" + b + ":" + c + ":" + d + ":" + x + ":" + y ]) {
	     a = randomFromRange(this.a,this.prng());
	     b = randomFromRange(this.b,this.prng());
	     c = randomFromRange(this.a,this.prng());
	     d = randomFromRange(this.b,this.prng());
	     x = randomFromRange(this.x,this.prng());
	     y = randomFromRange(this.x,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.eqns = {"0:0:0:0:0:0": true};
		 nqn = 0;
	     }
	}
	this.eqns[ a + ":" + b + ":" + c + ":" + d + ":" + x + ":" + y ] = true;

	 u = randomLetterFromRange(this.v, this.prng());
	 v = u;

	 while (v == u) {
	     v = randomLetterFromRange(this.v, this.prng());
	 }
	 e = a * x + b * y;
	 f = c * x + d * y;
	
	 qdiv = $('<div>').addClass('question');
	 adiv = $('<div>').addClass('answer');
	 qtex = ['\\begin{align*}'];
	 atex = [];

	 var qmml = mmlelt('math').attr('display','inline');
	 var mtable = mmlelt('mtable').attr('displaystyle','true')
		 .attr('columnalign','right left right left right left')
		 .attr('columnspacing','verythinmathspace')
	 qmml.append(mtable);

	 var mtd, mrow;

	 mrow = mmlelt('mtr');
	 mtable.append(mrow);
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);

	 addCoefficient(a, qtex, mtd);
	 mtd.append(tommlelt(u));
	 qtex.push(u);
	 
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 qtex.push('&');
	 addSignofCoefficient(b, qtex, mtd);

	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 qtex.push('&');
	 addUnsignedCoefficient(b, qtex, mtd);
	 mtd.append(tommlelt(v));
	 qtex.push(v);
	 
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 mtd.append(tommlelt('='));
	 mtd.append(tommlelt(e));
	 qtex.push('&=');
	 qtex.push(texnum(e));
	 qtex.push('\\\\');

	 mrow = mmlelt('mtr');
	 mtable.append(mrow);
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);

	 addCoefficient(c, qtex, mtd);
	 mtd.append(tommlelt(u));
	 qtex.push(u);
	 
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 qtex.push('&');
	 addSignofCoefficient(d, qtex, mtd);

	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 qtex.push('&');
	 addUnsignedCoefficient(d, qtex, mtd);
	 mtd.append(tommlelt(v));
	 qtex.push(v);
	 
	 mtd = mmlelt('mtd');
	 mrow.append(mtd);
	 mtd.append(tommlelt('='));
	 mtd.append(tommlelt(f));
	 qtex.push('&=');
	 qtex.push(texnum(f));
	 
	 qdiv.append(qmml);
	 qtex.push('\\end{align*}');
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex.push('\\(');

	 amml.append(tommlelt(u));
	 atex.push(u);
	 
	 amml.append(tommlelt('='));
	 atex.push('=');
	 
	 amml.append(tommlelt(x));
	 atex.push(x);
	 
	 adiv.append(amml);
	 adiv.append($('<span>').addClass("separator").html(','));
	 atex.push('\\), ');

	 amml = mmlelt('math').attr('display','inline');
	 atex.push('\\(');

	 amml.append(tommlelt(v));
	 atex.push(v);
	 
	 amml.append(tommlelt('='));
	 atex.push('=');
	 
	 amml.append(tommlelt(y));
	 atex.push(y);
	 
	 adiv.append(amml);
	 atex.push('\\)');
	
	this.qn++;
	 return [qdiv, adiv, qtex.join(''), atex.join('')];
    }
   
    
    return this;
}

// Straight line graphs

