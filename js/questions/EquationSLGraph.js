function EquationSLGraph() {
    var self = this;
    this.title = "Straight Line Graphs";
    this.storage = "EquationSLGraph";
    this.qn = 0;
    this.graphs = {"0:0": true};

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
	    name: "m",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "m",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "c",
	    text: "Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>",
	    shortcut: "c",
	    type: "string",
	    default: "-5:5"
	},
	{
	    name: "minx",
	    text: "Range for lower end of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> axis",
	    shortcut: "mx",
	    type: "string",
	    default: "-5"
	},
	{
	    name: "lenx",
	    text: "Range for width of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> axis",
	    shortcut: "lx",
	    type: "string",
	    default: "10"
	},
	{
	    name: "miny",
	    text: "Range for lower end of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> axis",
	    shortcut: "my",
	    type: "string",
	    default: "-5"
	},
	{
	    name: "leny",
	    text: "Range for width of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> axis",
	    shortcut: "ly",
	    type: "string",
	    default: "10"
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
	this.explanation = 'Find the equation of each graph';
	this.shortexp = 'Find the equation of ';
    }

    this.reset = function() {
	this.qn = 0;
	this.graphs = {"0:0": true};
    }

     this.makeQuestion = function(force) {
	if (this.qn >= this.size && !force) return false;

	 var m = 0, c = 0, minx, miny, maxx, maxy, lenx, leny;
	 var qdiv,adiv,p,sep,qtex,atex,coeffn,numbfn;
	 var nqn = 0;

	 while ( m == 0 || this.graphs[ m + ":" + c ]) {
	     m = randomFromRange(this.m,this.prng());
	     c = randomFromRange(this.c,this.prng());
	     minx = randomFromRange(this.minx,this.prng());
	     lenx = randomFromRange(this.lenx,this.prng());
	     miny = randomFromRange(this.miny,this.prng());
	     leny = randomFromRange(this.leny,this.prng());
	     nqn++;
	     if (nqn > 10) {
		 this.graphs = {"0:0": true};
		 nqn = 0;
	     }
	}
	this.graphs[ m + ":" + c ] = true;
	 // axis limits
	 maxx = minx + lenx;
	 maxy = miny + leny;	
	
	qdiv = $('<div>').addClass('question');
	adiv = $('<div>').addClass('answer');
	qtex = ['\\('];
	 atex = [];

	 var qmml = mmlelt('math').attr('display','inline');

	 qmml.append(tommlelt('y'));
	 qtex.push('y');
	 qmml.append(tommlelt('='));
	 qtex.push('=');

	 addCoefficient(m, qtex, qmml);
	 qmml.append(tommlelt('x'));
	 qtex.push('x');
	 addSignedNumber(c, qtex, qmml);
	 	 
	 qdiv.append(qmml);
	 
	 qtex.push('\\)');
	 
	 
	 var amml = mmlelt('math').attr('display','inline');
	 atex.push('\\begin{tikzpicture}[baseline=0pt]');
	 atex.push('\\draw[help lines] (' + minx + ',' + miny + ') grid (' + maxx + ',' + maxy + ');');
	 atex.push('\\draw[->,axis/.try] (' + (minx - .5) + ',0) -- (' + (maxx + .5) + ',0);');
	 atex.push('\\draw[->,axis/.try] (0,' + (miny - .5) + ') -- (0,' + (maxy + .5) + ');');
	 atex.push('\\foreach \\k in {' + minx + ',...,' + maxx + '} { \\draw (\\k,0) -- ++(0,-.2) node[below] {\\(\\k\\)};}');
	 atex.push('\\foreach \\k in {' + miny + ',...,' + maxy + '} { \\draw (0,\\k) -- ++(-.2,0) node[anchor=base east] {\\(\\k\\)};}');
	 atex.push('\\clip (' + minx + ',' + miny + ') rectangle (' + maxx + ',' + maxy + ');');
 	 atex.push('\\draw[graph line/.try] (' + minx + ',' + (m*minx + c) + ') -- (' + maxx + ',' + (m*maxx + c) + ');');
	 atex.push('\\end{tikzpicture}');

	 var w = $('#qns').width()/2 - 100;
	 
	 var graph =  createAxesSvg (
	     w, //width,
	     w, //height,
	     10, //border,
	     minx,
	     maxx,
	     1, //xmark,
	     1, //xlabel,
	     "_x_", //xaxlabel,
	     miny,
	     maxy,
	     1, //ymark,
	     1, //ylabel,
	     "_y_", //yaxlabel,
	     true, //aspect,
	     16, //fontsize,
	     1, //linewidth,
	     true, //gridbl,
	     1, //markwidth,
	     1, //marklength
	 );

	 var ax, ay, bx, by;
	 
	 if (m * minx + c < miny) {
	     ax = (miny - c) / m;
	     ay = miny;
	 } else if (m * minx + c > maxy) {
	     ax = (maxy - c) / m;
	     ay = maxy
	 } else {
	     ax = minx;
	     ay = m * minx + c;
	 }

	 if (m * maxx + c > maxy) {
	     bx = (maxy - c)/m;
	     by = maxy;
	 } else if (m * maxx + c < miny) {
	     bx = (minx - c)/m;
	     by = miny;
	 } else {
	     bx = maxx;
	     by = m * maxx + c;
	 }
	 
	 var sline = document.createElementNS("http://www.w3.org/2000/svg",'path');
	 sline.setAttribute('d','M ' + graph.transformX(ax) + ' ' + graph.transformY(ay) + ' L ' + graph.transformX(bx) + ' ' + graph.transformY(by));
	 sline.setAttribute('stroke','black');
	 sline.setAttribute('stroke-width',1);
	 graph.svg.appendChild(sline);

	 
	 adiv.append(graph.svg);


	 
	this.qn++;
	 return [adiv, qdiv, atex.join(''), qtex.join('')];
    }
   
    
    return this;
}

