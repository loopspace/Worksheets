function makeTriangle(a) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "100%");
    var triangle = document.createElementNS("http://www.w3.org/2000/svg",'path');

    var lx = 0;
    var ly = 0;
    var ux = 0;
    var uy = 0;

    var r = math.random()*a[0];
    
    var ts = ['M'];
    ts.push(0);
    ts.push(0);
    
    ts.push('L');

    var x = a[3] * Math.cos(r/180*Math.PI);
    var y = a[3] * Math.sin(r/180*Math.PI);

    lx = Math.min(lx,x);
    ly = Math.min(ly,y);
    ux = Math.max(ux,x);
    uy = Math.max(uy,y);
    
    ts.push(x);
    ts.push(y);
    
    ts.push('L');

    x += a[4] * Math.cos( (r + a[1])/180 * Math.PI);
    y += a[4] * Math.sin( (r + a[1])/180 * Math.PI);
    
    lx = Math.min(lx,x);
    ly = Math.min(ly,y);
    ux = Math.max(ux,x);
    uy = Math.max(uy,y);
    
    ts.push(x);
    ts.push(y);

    ts.push('Z');

    triangle.setAttribute('d', ts.join(' '));
    triangle.setAttribute('stroke', '#000');
    triangle.setAttribute('fill', 'none');

    ux -= lx;
    uy -= ly;
    if (uy > ux) {
	lx -= (uy - ux)/2;
	ux = uy;
    }
    var lw = ux/100;
    triangle.setAttribute('stroke-width', lw);
    lx -= lw;
    ly -= lw;
    ux += 2*lw;
    uy += 2*lw;
    svg.setAttribute('viewBox', lx + ' ' + ly + ' ' + ux + ' ' + uy);
    svg.appendChild(triangle);

    return svg;
}
