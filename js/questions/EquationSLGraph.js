EquationSLGraph = new QuestionGenerator(
    "Graphs",
    "Straight Line Graphs",
    "graph1",
    "EquationSLGraph",
    ["0:0"]
);

EquationSLGraph.explanation = function () {
    return 'Find the equation of each graph';
}
EquationSLGraph.shortexp = function () {
    return 'Find the equation of ';
}

EquationSLGraph.addOption("m","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>","m","string","-5:5");
EquationSLGraph.addOption("c","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>","c","string","-5:5");
EquationSLGraph.addOption("minx","Range for lower end of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> axis","mx","string","-5");
EquationSLGraph.addOption("lenx","Range for width of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> axis","lx","string","10");
EquationSLGraph.addOption("miny","Range for lower end of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> axis","my","string","-5");
EquationSLGraph.addOption("leny","Range for width of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> axis","ly","string","10");

EquationSLGraph.createQuestion = function(question) {

    var m = 0, c = 0, minx, miny, maxx, maxy, lenx, leny;
    var p,sep,qtexa,atexa,coeffn,numbfn;
    var nqn = 0;

    do {
	m = randomFromRange(this.m,this.prng());
	c = randomFromRange(this.c,this.prng());
	minx = randomFromRange(this.minx,this.prng());
	lenx = randomFromRange(this.lenx,this.prng());
	miny = randomFromRange(this.miny,this.prng());
	leny = randomFromRange(this.leny,this.prng());
	nqn++;
	if (nqn == 10) {
	    this.resetSaved();
	}
	if (nqn == 20) {
	    return false;
	}
    } while ( m == 0 || this.checkQn([ m, c ]) )

    this.registerQn([ m, c ]);
    // axis limits
    maxx = minx + lenx;
    maxy = miny + leny;	
    
    qtexa = ['\\('];
    atexa = [];

    var qmml = mmlelt('math').attr('display','inline');

    qmml.append(tommlelt('y'));
    qtexa.push('y');
    qmml.append(tommlelt('='));
    qtexa.push('=');

    addCoefficient(m, qtexa, qmml);
    qmml.append(tommlelt('x'));
    qtexa.push('x');
    addSignedNumber(c, qtexa, qmml);
    
    question.adiv.append(qmml);
    
    qtexa.push('\\)');
    
    
    var amml = mmlelt('math').attr('display','inline');
    atexa.push('\\begin{tikzpicture}[baseline=0pt]');
    atexa.push('\\draw[help lines] (' + minx + ',' + miny + ') grid (' + maxx + ',' + maxy + ');');
    atexa.push('\\draw[->,axis/.try] (' + (minx - .5) + ',0) -- (' + (maxx + .5) + ',0);');
    atexa.push('\\draw[->,axis/.try] (0,' + (miny - .5) + ') -- (0,' + (maxy + .5) + ');');
    atexa.push('\\foreach \\k in {' + minx + ',...,' + maxx + '} { \\draw (\\k,0) -- ++(0,-.2) node[below] {\\(\\k\\)};}');
    atexa.push('\\foreach \\k in {' + miny + ',...,' + maxy + '} { \\draw (0,\\k) -- ++(-.2,0) node[anchor=base east] {\\(\\k\\)};}');
    atexa.push('\\clip (' + minx + ',' + miny + ') rectangle (' + maxx + ',' + maxy + ');');
    atexa.push('\\draw[graph line/.try] (' + minx + ',' + (m*minx + c) + ') -- (' + maxx + ',' + (m*maxx + c) + ');');
    atexa.push('\\end{tikzpicture}');

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

    
    question.qdiv.append(graph.svg);


    
    question.qtex = atexa.join('');
    question.atex = qtexa.join('');
    
    return this;
}

