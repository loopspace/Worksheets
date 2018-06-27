"use strict";

var px_per_mm;
var svgs = [];
var axParams = [];
var caxes = 0;
var defaults = {
    "fs": 16,
    "asp": true,
    "gd": true,
    "lw": 1,
    "mw": 1,
    "ml": 1,
    "xmn": -5,
    "xmx": 5,
    "xmk": 1,
    "xlb": 1,
    "xal": "_x_",
    "ymn": -7,
    "ymx": 8,
    "ymk": 1,
    "ylb": 1,
    "yal": "_y_",
};
var paramNames = [
    "fs","asp","gd","lw","mw","ml","xmn","xmx","xmk","xlb","xal","ymn","ymx","ymk","ylb","yal"
]

window.addEventListener('load',make_px2cm,false);

function createAxesSvg (
    width,
    height,
    border,
    xmin,
    xmax,
    xmark,
    xlabel,
    xaxlabel,
    ymin,
    ymax,
    ymark,
    ylabel,
    yaxlabel,
    aspect,
    fontsize,
    linewidth,
    gridbl,
    markwidth,
    marklength
) {
    var	xwidth,
	ywidth,
    	xscale,
	yscale,
	xmark,
	xlabel,
	ymark,
	ylabel,
	xborder,
	yborder
    ;

    xwidth = xmax - xmin;
    ywidth = ymax - ymin;
    xborder = border;
    yborder = border;
    if (aspect) {
	xscale = Math.min((width - 2*xborder)/xwidth,(height - 2*yborder)/ywidth);
	yscale = xscale;
	xborder = (width - xscale*xwidth)/2;
	yborder = (height - yscale*ywidth)/2;
    } else {
	xscale = (width - 2*xborder)/xwidth;
	yscale = (height - 2*yborder)/ywidth;
    }
    
    var transformX = function(x) {
        return (x - xmin)*xscale + xborder;
    };
    var transformDX = function(x) {
        return x*xscale;
    };
    var transformY = function (y) {
        return height - (y - ymin)*yscale - yborder;
    };
    var transformDY = function (y) {
        return - y*yscale;
    };
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");

    var nmin,nmax,notch,i;
    if (gridbl) {
	var grid = document.createElementNS("http://www.w3.org/2000/svg",'path');
	var gridstr = '';
	
	nmin = Math.ceil(xmin/xmark);
	nmax = Math.floor(xmax/xmark);
	for ( i=nmin;i<=nmax;i++) {
            gridstr += 'M ' + transformX(i*xmark) + ' ' + transformY(ymin) + ' L ' + transformX(i*xmark) + ' ' +  transformY(ymax) + ' ';
	}

	nmin = Math.ceil(ymin/ymark);
	nmax = Math.floor(ymax/ymark);
	for ( i=nmin;i<=nmax;i++) {
            gridstr += 'M ' + transformX(xmin) + ' ' + transformY(i*ymark) + ' L ' + transformX(xmax) + ' ' +  transformY(i*ymark) + ' ';
	}

	grid.setAttribute('d',gridstr);
	grid.setAttribute('stroke','gray');
	grid.setAttribute('stroke-width',.5*linewidth);
	svg.appendChild(grid);
    }
    var xaxis = document.createElementNS("http://www.w3.org/2000/svg",'path');
    xaxis.setAttribute('d','M ' + transformX(xmin) + ' ' + transformY(0) + ' L ' + transformX(xmax) + ' ' + transformY(0));
    xaxis.setAttribute('stroke','black');
    xaxis.setAttribute('stroke-width',linewidth);
    xaxis.setAttribute('marker-end','url(#dart)');
    svg.appendChild(xaxis);
    var yaxis = document.createElementNS("http://www.w3.org/2000/svg",'path');
    yaxis.setAttribute('d','M ' + transformX(0) + ' ' + transformY(ymin) + ' L ' + transformX(0) + ' ' + transformY(ymax));
    yaxis.setAttribute('stroke','black');
    yaxis.setAttribute('stroke-width',linewidth);
    yaxis.setAttribute('marker-end','url(#dart)');
    svg.appendChild(yaxis);
    var tick,tlbl;
    nmin = Math.ceil(xmin/xmark);
    nmax = Math.floor(xmax/xmark);
    for ( i=nmin;i<=nmax;i++) {
	if (i != 0) {
	    notch = document.createElementNS("http://www.w3.org/2000/svg",'path');
            notch.setAttribute('d','M ' + transformX(i*xmark) + ' ' + transformY(0) + ' l 0 ' + marklength );
            notch.setAttribute('stroke','black');
            notch.setAttribute('stroke-width', markwidth);
            svg.appendChild(notch);
	}
    }
    xlabel *= xmark;
    nmin = Math.ceil(xmin/xlabel);
    nmax = Math.floor(xmax/xlabel);
    for ( i=nmin;i<=nmax;i++) {
	if (i != 0) {
            tick = document.createElementNS("http://www.w3.org/2000/svg",'text');
            tick.setAttribute('x',transformX(i*xlabel) + fontsize/4);
            tick.setAttribute('y',transformY(0) + marklength);
	    tick.setAttribute('font-size',fontsize);
            tick.setAttribute('text-anchor','end');
            tick.setAttribute('style','dominant-baseline: hanging');
            tlbl = document.createTextNode(i*xlabel);
            tick.appendChild(tlbl);
            svg.appendChild(tick);
	}
    }
    var alabel, alabeltxt, alabeltsp, alabelarr, alabelret;
    // TODO: parse xaxlabel for formatting a la Markdown
    if (xaxlabel != '') {
	alabel = document.createElementNS("http://www.w3.org/2000/svg",'text');
        alabel.setAttribute('x',transformX(xmax) + 15*linewidth);
        alabel.setAttribute('y',transformY(0));
	alabel.setAttribute('font-size',fontsize);
        alabel.setAttribute('text-anchor','start');
        alabel.setAttribute('style','dominant-baseline: hanging');
	alabelarr = xaxlabel.split(/ +/);
	for (i = 0; i < alabelarr.length; i++) {
	    if (i > 0) {
		alabeltsp = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
		alabeltxt = document.createTextNode(' ');
		alabeltsp.appendChild(alabeltxt);
		alabel.appendChild(alabeltsp);
	    }
	    alabeltsp = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
	    alabelret = getFormat(alabelarr[i]);
	    if (alabelret[1]) {
		alabeltsp.setAttribute('class',alabelret[1]);
		alabelarr[i] = alabelret[0];
	    }
	    alabelret = getFormat(alabelarr[i]);
	    if (alabelret[1]) {
		alabeltsp.setAttribute('class',alabeltsp.getAttribute('class') + ' ' + alabelret[1]);
		alabelarr[i] = alabelret[0];
	    }
	    alabeltxt = document.createTextNode(alabelarr[i]);
	    alabeltsp.appendChild(alabeltxt);
            alabel.appendChild(alabeltsp);
	}
        svg.appendChild(alabel);
    }
    nmin = Math.ceil(ymin/ymark);
    nmax = Math.floor(ymax/ymark);
    for ( i=nmin;i<=nmax;i++) {
	if (i != 0) {
	    notch = document.createElementNS("http://www.w3.org/2000/svg",'path');
            notch.setAttribute('d','M ' + transformX(0) + ' ' + transformY(i*ymark) + ' l ' +  -marklength + ' 0');
            notch.setAttribute('stroke','black');
            notch.setAttribute('stroke-width', markwidth);
            svg.appendChild(notch);
	}
    }
    ylabel *= ymark;
    nmin = Math.ceil(ymin/ylabel);
    nmax = Math.floor(ymax/ylabel);
    for ( i=nmin;i<=nmax;i++) {
	if (i != 0) {
            tick = document.createElementNS("http://www.w3.org/2000/svg",'text');
            tick.setAttribute('x',transformX(0) - marklength);
            tick.setAttribute('y',transformY(i*ylabel) + fontsize/3);
	    tick.setAttribute('font-size',fontsize);
            tick.setAttribute('text-anchor','end');
            tick.setAttribute('style','dominant-baseline: alphabetic');
            tlbl = document.createTextNode(i*ylabel);
            tick.appendChild(tlbl);
            svg.appendChild(tick);
	}
    }
    if (yaxlabel != '') {
	alabel = document.createElementNS("http://www.w3.org/2000/svg",'text');
        alabel.setAttribute('x',transformX(0));
        alabel.setAttribute('y',transformY(ymax) - 15*linewidth);
	alabel.setAttribute('font-size',fontsize);
        alabel.setAttribute('text-anchor','start');
        alabel.setAttribute('style','dominant-baseline: alphabetic');
	alabelarr = yaxlabel.split(/ +/);
	for (i = 0; i < alabelarr.length; i++) {
	    if (i > 0) {
		alabeltsp = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
		alabeltxt = document.createTextNode(' ');
		alabeltsp.appendChild(alabeltxt);
		alabel.appendChild(alabeltsp);
	    }
	    alabeltsp = document.createElementNS("http://www.w3.org/2000/svg",'tspan');
	    alabelret = getFormat(alabelarr[i]);
	    if (alabelret[1]) {
		alabeltsp.setAttribute('class',alabelret[1]);
		alabelarr[i] = alabelret[0];
	    }
	    alabelret = getFormat(alabelarr[i]);
	    if (alabelret[1]) {
		alabeltsp.setAttribute('class',alabeltsp.getAttribute('class') + ' ' + alabelret[1]);
		alabelarr[i] = alabelret[0];
	    }
	    alabeltxt = document.createTextNode(alabelarr[i]);
	    alabeltsp.appendChild(alabeltxt);
            alabel.appendChild(alabeltsp);
	}
        svg.appendChild(alabel);
    }
    if (yaxlabel != '') {
    }
    if ((ymin < 0 && ymax > 0) || (xmin < 0 && xmax > 0)) {
        tick = document.createElementNS("http://www.w3.org/2000/svg",'text');
        tick.setAttribute('x',transformX(-.15));
        tick.setAttribute('y',transformY(-.15));
	tick.setAttribute('font-size',fontsize);
        tick.setAttribute('text-anchor','end');
        tick.setAttribute('style','dominant-baseline: hanging');
        tlbl = document.createTextNode("0");
        tick.appendChild(tlbl);
        svg.appendChild(tick);
    }
    return {
	svg: svg,
	transformX: transformX,
	transformDX: transformDX,
	transformY: transformY,
	transformDY: transformDY
    };
}

function make_px2cm() {
    var d = document.createElement('div');
    var body = document.querySelector('body');
    d.style.position = 'absolute';
    d.style.top = '-1000cm';
    d.style.left = '-1000cm';
    d.style.height = '1000cm';
    d.style.width = '1000cm';
    body.appendChild(d);
    px_per_mm = d.offsetHeight / 10000;
    body.removeChild(d);
}

function px2mm (px) {
    return px / px_per_mm;
}

function mm2px (mm) {
    return mm * px_per_mm;
}

function px2cm (px) {
    return px / px_per_mm / 10;
}

function cm2px (cm) {
    return cm * px_per_mm * 10;
}

function getFormat (s) {
    var rt,cl,bl;
    if (s.charAt(0) == s.charAt(s.length - 1)) {
	if (s.charAt(0) == "_") {
	    rt = s.substring(1,s.length-1);
	    return [rt,'italic'];
	} else if (s.charAt(0) == "*") {
	    rt = s.substring(1,s.length-1);
	    return [rt,'bold'];
	}	    
    }
    return [rt,''];
}
