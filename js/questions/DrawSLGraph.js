
// Straight line graphs

DrawSLGraph = new QuestionGenerator(
    "Graphs",
    "Straight Line Graphs",
    "graph0",
    "DrawSLGraph",
    ["0:0"]
);

DrawSLGraph.explanation = function() {
    return 'Draw each graph with the given range on the <math xmlns=\'http://www.w3.org/1998/Math/MathML\' display=\'inline\'><mi>x</mi></math>-axis';
}
DrawSLGraph.shortexp = function() {
    return 'Draw ';
}

DrawSLGraph.addOption("m","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>","m","string","-5:5");
DrawSLGraph.addOption("c","Range for <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>c</mi></math> in <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>m</mi><mi>x</mi><mo>+</mo><mi>c</mi></math>","c","string","-5:5");
DrawSLGraph.addOption("minx","Range for lower end of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> axis","mx","string","-5");
DrawSLGraph.addOption("lenx","Range for width of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>x</mi></math> axis","lx","string","10");
DrawSLGraph.addOption("miny","Range for lower end of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> axis","my","string","-5");
DrawSLGraph.addOption("leny","Range for width of <math xmlns='http://www.w3.org/1998/Math/MathML' display='inline'><mi>y</mi></math> axis","ly","string","10");

DrawSLGraph.createQuestion = function(question) {

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
	if (nqn > 10) {
	    this.resetSaved();
	    nqn = 0;
	}
    } while ( m == 0 || this.checkQn([ m , c ]))

    this.registerQn([ m , c ]);
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
    
    question.qdiv.append(qmml);
    question.qdiv.append($('<span>').append(' with '));
    qmml = mmlelt('math').attr('display', 'inline');
    qmml.append(tommlelt(minx));
    qmml.append(tommlelt('&le;'));
    qmml.append(tommlelt('x'));
    qmml.append(tommlelt('&le;'));
    qmml.append(tommlelt(maxx));
    question.qdiv.append(qmml);
    question.qdiv.append($('<span>').append(', '));
    qmml = mmlelt('math').attr('display', 'inline');
    qmml.append(tommlelt(miny));
    qmml.append(tommlelt('&le;'));
    qmml.append(tommlelt('y'));
    qmml.append(tommlelt('&le;'));
    qmml.append(tommlelt(maxy));
    question.qdiv.append(qmml);
    
    qtexa.push('\\)');
    qtexa.push(' with ');
    qtexa.push('\\(');
    qtexa.push(minx);
    qtexa.push(' \\le x \\le ');
    qtexa.push(maxx);
    qtexa.push('\\)');
    qtexa.push(', ');
    qtexa.push('\\(');
    qtexa.push(miny);
    qtexa.push(' \\le y \\le ');
    qtexa.push(maxy);
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

    
    question.adiv.append(graph.svg);


    question.qtex = qtexa.join('');
    question.atex = atexa.join('');
    
    return this;
}
