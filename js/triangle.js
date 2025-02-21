function makeTriangle(a) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute('class', 'triangle');

    const triangle = document.createElementNS("http://www.w3.org/2000/svg",'path');
    const arcs = document.createElementNS("http://www.w3.org/2000/svg",'path');
    var label;
    const vertices = [ [0,0] ];

    const r = math.random()*90;

    var lx,ly,ux,uy,x,y,xx,yy,lw,l,ll,cx,cy,fs;
    
    lx = 0;
    ly = 0;
    ux = 0;
    uy = 0;

    x = a[3] * Math.cos(r/180*Math.PI);
    y = a[3] * Math.sin(r/180*Math.PI);
    vertices.push( [x,y] );

    lx = Math.min(lx,x);
    ly = Math.min(ly,y);
    ux = Math.max(ux,x);
    uy = Math.max(uy,y);

    // The angles are *opposite* the corresponding sides
    x += a[4] * Math.cos( (r + 180 - a[2])/180 * Math.PI);
    y += a[4] * Math.sin( (r + 180 - a[2])/180 * Math.PI);
    vertices.push( [x,y] );
    
    lx = Math.min(lx,x);
    ly = Math.min(ly,y);
    ux = Math.max(ux,x);
    uy = Math.max(uy,y);

    ux -= lx;
    uy -= ly;
    if (uy > ux) {
	lx -= (uy - ux)/2;
	ux = uy;
    }
    sf = 100/ux;
    
    lx *= sf;
    ly *= sf;
    ux *= sf;
    uy *= sf;
    
    lw = 1;
    fs = 10;
    lx -= lw + 1.5*fs;
    ly -= lw + 1.5*fs;
    ux += 2*(lw + 1.5*fs);
    uy += 2*(lw + 1.5*fs);

    for (var i = 0; i < 3; i++) {
	vertices[i][0] *= sf;
	vertices[i][1] *= sf;
    }
    
    const ts = ['M'];
    ts.push(vertices[0].join(" "));

    ts.push('L');
    ts.push(vertices[1].join(" "));
    
    ts.push('L');
    ts.push(vertices[2].join(" "));

    ts.push('Z');

    triangle.setAttribute('d', ts.join(' '));
    triangle.setAttribute('stroke', '#000');
    triangle.setAttribute('fill', 'none');

    triangle.setAttribute('stroke-width', 1);
    svg.setAttribute('viewBox', lx + ' ' + ly + ' ' + ux + ' ' + uy);
    svg.appendChild(triangle);

    const arc = [];

    for (var i = 0; i < 3; i++) {
	
	arc.push("M");

	x = vertices[(i+1)%3][0] - vertices[i][0];
	y = vertices[(i+1)%3][1] - vertices[i][1];
	xx = vertices[(i+2)%3][0] - vertices[i][0];
	yy = vertices[(i+2)%3][1] - vertices[i][1];
	l = Math.sqrt(x*x + y*y);
	ll = Math.sqrt(xx*xx + yy*yy);

	x /= l;
	y /= l;
	xx /= ll;
	yy /= ll;
	l = Math.min(l,ll)/5;
	x *= l;
	y *= l;
	xx *= l;
	yy *= l;
	x += vertices[i][0];
	y += vertices[i][1];
	xx += vertices[i][0];
	yy += vertices[i][1];
	
	arc.push(x);
	arc.push(y);
	arc.push("A");
	arc.push(l);
	arc.push(l);
	arc.push(0);
	arc.push(0);
	arc.push(1);
	arc.push(xx);
	arc.push(yy);
    }
    
    arcs.setAttribute('d', arc.join(' '));
    arcs.setAttribute('stroke', '#000');
    arcs.setAttribute('fill', 'none');
    arcs.setAttribute('stroke-width', lw/2);

    svg.appendChild(arcs);

    cx = 0;
    cy = 0;
    for (var i = 0; i < 3; i++) {
	cx += vertices[i][0];
	cy += vertices[i][1];
    }
    cx /= 3;
    cy /= 3;
    
    for (var i = 0; i < 3; i++) {
	x = (vertices[i][0] - cx);
	y = (vertices[i][1] - cy);
	l = Math.sqrt(x*x + y*y);
	x /= l;
	y /= l;
	label = document.createElementNS("http://www.w3.org/2000/svg",'text');
	label.setAttribute('x', vertices[i][0] + 10*x - 5);
	label.setAttribute('y', vertices[i][1] + 10*y + 5);
	label.setAttribute('class', 'label');
	label.setAttribute('style', 'font-size: ' + fs + 'px; font-style: italic;');
	label.appendChild(document.createTextNode(String.fromCodePoint((i+1)%3 + 65)));
	svg.appendChild(label);
    }

    for (var i = 0; i < 3; i++) {
	x = (vertices[(i+1)%3][0] + vertices[i][0])/2;
	y = (vertices[(i+1)%3][1] + vertices[i][1])/2;
	xx = y - vertices[i][1];
	yy = vertices[i][0] - x;
	if ( xx*(x - cx) + yy*(y - cy) < 0) {
	    xx *= -1;
	    yy *= -1;
	}
	l = Math.sqrt(xx*xx + yy*yy);
	xx /= l;
	yy /= l;
	label = document.createElementNS("http://www.w3.org/2000/svg",'text');
	label.setAttribute('x', x + 10*xx - 5);
	label.setAttribute('y', y + 10*yy + 5);
	label.setAttribute('class', 'label');
	label.setAttribute('style', 'font-size: ' + fs + 'px; font-style: italic;');
	label.appendChild(document.createTextNode(String.fromCodePoint(i + 97)));
	svg.appendChild(label);
    }
    // For debugging: put an origin in the image
    /*
    var origin = document.createElementNS("http://www.w3.org/2000/svg",'path');
    origin.setAttribute('d', 'M 20 0 L 0 0 L 0 10');
    origin.setAttribute('stroke', '#f00');
    origin.setAttribute('fill', 'none');
    origin.setAttribute('stroke-width', lw/2);
    svg.appendChild(origin);
    */
    return svg;
}
