var precision = 4;

// Based on http://stackoverflow.com/a/21059677

var px_per_cm;
function init_px2cm() {
    var d = $("<div/>").css({ position: 'absolute', top : '-1000cm', left : '-1000cm', height : '1000cm', width : '1000cm' }).appendTo('body');
    px_per_cm = d.height() / 1000;
    d.remove();
}

function px2cm(px) {
    return px / px_per_cm;
}

function cm2px(cm) {
    return cm * px_per_cm;
}

function MathJaxOrNot(f) {
    f();
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise();
    }
}


function tomml(s) {
    var mml = mmlelt('math').attr('display','inline');
    mml.append(tommlelt(s));
    return mml;
}

var moelts = [
    'le', 'lt', 'ge', 'gt', 'plusmn', 'colon', 'map', 'Element', 'ne', 'times'
];

function tommlelt(s) {
    var melt;
    var mselt;
    if (typeof(s) == "number") {
	if (s < 0) {
	    melt = mmlelt('mrow');
	    mselt = mmlelt('mo').attr('lspace',"0.1111111111111111em").attr('rspace',"0em");
	    mselt.html('&minus;');
	    melt.append(mselt)
	    mselt = mmlelt('mn');
	    mselt.html(math.format(-s,precision));
	    melt.append(mselt);
	} else {
	    melt = mmlelt('mn');
	    melt.html(math.format(s,precision));
	}
    } else if (s.isFraction) {
	if (s.d == 1) {
	    melt = mmlelt('mn');
	    melt.html(s.s * s.n);
	} else {
	    melt = mmlelt('mrow');
	    if (s.s == -1) {
		mselt = mmlelt('mo').attr('lspace',"0.1111111111111111em").attr('rspace',"0em");
		mselt.html('&minus;');
		melt.append(mselt);
	    }
	    mselt = mmlelt('mfrac');
	    mselt.append(mmlelt('mn').html(s.n));
	    mselt.append(mmlelt('mn').html(s.d));
	    melt.append(mselt);
	}
    } else if (s.isComplex) {
	melt = mmlelt('mrow');
	if (s.re != 0) {
	    melt.append(mmlelt('mn').html(math.format(s.re,precision)));
	    if (s.im > 0) {
		melt.append(mmlelt('mo').html('&plus;'));
	    }
	}
	if (s.im != 0) {
	    melt.append(mmlelt('mn').html(math.format(s.im,precision)));
	    melt.append(mmlelt('mn').html('i'));
	}
    } else if (typeof(s) == "string" && s.search(/^&?[a-zA-Z]+;?$/) != -1) {
	var entity = s.match(/^&?([a-zA-Z]+);?$/);
	if (moelts.includes(entity[1])) {
	    melt = mmlelt('mo');
	} else {
	    melt = mmlelt('mi');
	}
	melt.html(s);
    } else {
	melt = mmlelt('mo');
	melt.html(s);
    }
    return melt;
}

function totex(s) {
    return texwrap(texnum(s));
}

function texwrap(s) {
    return '\\(' + s + '\\)';
}

function tomkd(s) {
    return mkdwrap(texnum(s));
}

function mkdwrap(s) {
    return '[m]' + s + '[/m]';
}

function textomkda(a) {
    var qmkda = [];
    for (var i = 0; i < a.length; i++) {
	if (a[i] == '\\(') {
	    qmkda.push('[m]');
	} else if (a[i] == '\\)') {
	    qmkda.push('[/m]');
	} else {
	    qmkda.push(a[i]);
	}
    }
    return qmkda
}

function textomkds(s) {
    return s.replaceAll('\\(', '[m]').replaceAll('\\)', '[/m]');
}

function texnum(s) {
    var tex = '';
    if (math.isNumeric(s) && s.isFraction) {
	if (s.d == 1) {
	    tex = (s.s * s.n);
	} else {
	    if (s.s == -1) {
		tex = '-';
	    }
	    tex += '\\frac{' + s.n + '}{' + s.d + '}';
	}
    } else {
	tex = s;
    }
    return tex;
}

function addSignedCoefficient(p,tex,mml) {
    if (!math.equal(p, 0)) {
	if (math.compare(p, 0) == -1 ) {
	    tex.push(' - ');
	    mml.append(tommlelt('-'));
	    p = math.unaryMinus(p);
	} else {
	    tex.push(' + ');
	    mml.append(tommlelt('+'));
	}
	if (!math.equal(p, 1)) {
	    tex.push(texnum(p));
	    mml.append(tommlelt(p));
	}
	return true;
    } else {
	return false;
    }
}

function addSignofCoefficient(p,tex,mml) {
    if (!math.equal(p, 0)) {
	if (math.compare(p, 0) == -1 ) {
	    tex.push(' - ');
	    mml.append(tommlelt('-'));
	} else {
	    tex.push(' + ');
	    mml.append(tommlelt('+'));
	}
	return true;
    } else {
	return false;
    }
}

function addUnsignedCoefficient(p,tex,mml) {
    if (!math.equal(p, 0)) {
	if (math.compare(p, 0) == -1 ) {
	    p = math.unaryMinus(p);
	}
	if (!math.equal(p, 1)) {
	    tex.push(texnum(p));
	    mml.append(tommlelt(p));
	}
	return true;
    } else {
	return false;
    }
}

function addCoefficient(p,tex,mml) {
    if (!math.equal(p, 0)) {
	if (math.compare(p, 0) == -1 ) {
	    tex.push(' - ');
	    mml.append(tommlelt('-'));
	    p = math.unaryMinus(p);
	}
	if (!math.equal(p, 1)) {
	    tex.push( texnum(p));
	    mml.append(tommlelt(p));
	}
	return true;
    } else {
	return false;
    }
}

function addNumber(p,tex,mml) {
    if (!math.equal(p, 0)) {
	tex.push(texnum(p));
	mml.append(tommlelt(p));
	return true;
    } else {
	return false;
    }
}

function addSignedNumber(p,tex,mml) {
    if (!math.equal(p, 0)) {
	if (math.compare(p, 0) == -1 ) {
	    tex.push(' - ');
	    mml.append(tommlelt('-'));
	    p = math.unaryMinus(p);
	} else {
	    tex.push(' + ');
	    mml.append(tommlelt('+'));
	}
	tex.push( texnum(p));
	mml.append(tommlelt(p));
	return true;
    } else {
	return false;
    }
}

function addPower(b,p,tex,mml,roots) {
    var d,n;
    if (roots && p.isFraction && !math.equal(p.d,1)) {
	if (math.compare(p,1) == 1 || math.compare(p,0) == -1) {
	    addPower(b,math.floor(p),tex,mml,roots);
	    p = math.subtract(p, math.floor(p));
	}
	d = p.d;
	n = p.n;
	tex.push("\\sqrt")
	if (!math.equal(d,2)) {
	    tex.push("[" + d + "]");
	}
	tex.push("{");
    } else {
	n = p;
    }
    if (!(math.isNumeric(n) && math.equal(n,1))) {
	var bmml;
	if (math.isNumeric(b) && math.compare(b,0) == -1) {
	    tex.push("{\\left(" + texnum(b) + "\\right)}^{" + texnum(n) + "}");
	    bmml = tommlelt('(').append(
		tommlelt(b)
	    ).append(tommlelt(')'));
	} else {
	    tex.push("{" + texnum(b) + "}^{" + texnum(n) + "}");
	    bmml = tommlelt(b);
	}
	var pmml = tommlelt(n);
	var mrow = mmlelt('mrow');
	var msup = mmlelt('msup');
	msup.append(bmml);
	msup.append(pmml);
	mrow.append(msup);
    } else {
	var mrow = tommlelt(b);
	tex.push("{" + texnum(b) + "}");
    }
    if (roots && p.isFraction && !math.equal(p.d,1)) {
	tex.push("}");
	var mroot;
	if (math.equal(d,2)) {
	    mroot = mmlelt("msqrt");
	} else {
	    mroot = mmlelt("mroot");
	}
	mroot.append(mrow);
	if (!math.equal(d,2)) {
	    mroot.append(tommlelt(d));
	}
	mml.append(mroot);
    } else {
	mml.append(mrow);
    }
    return true;
}

function addMonomial(q, tex, mml, v, fractions, roots) {
    var n,d;
    if (math.isNumeric(q[1]) && math.equal(q[1],0)) {
	addNumber(q[0], tex, mml);
	return true;
    }
    if (fractions) {
	if (math.compare(q[0], 0) == -1) {
	    tex.push(' - ');
	    mml.append(tommlelt('-'));
	    n = math.unaryMinus(q[0]);
	} else {
	    n = q[0];
	}
	if (math.isNumeric(q[1]) && (math.compare(q[1], 0) == -1 || (n.isFraction && n.d != 1))) {
	    if (n.isFraction) {
		d = n.d;
		n = n.n;
	    } else {
		d = 1;
	    }
	    var qfrac = mmlelt('mfrac');
	    var qrow = mmlelt('mrow');
	    qfrac.append(qrow);
	    tex.push('\\frac{');
	    
	    if (math.isNumeric(q[1]) && math.compare(q[1], 0) == 1) {
		addCoefficient(n,tex,qrow);
		if (math.isNumeric(v) && math.unequal(math.abs(n),1)) {
		    tex.push('\\times');
		    qrow.append(tommlelt('&times;'));
		}
		addPower(v,q[1],tex,qrow,roots);
	    } else {
		addNumber(n,tex,qrow);
	    }
	    tex.push('}{');
	    qrow = mmlelt('mrow');
	    if (math.isNumeric(q[1]) && math.compare(q[1], 0) == -1) {
		addCoefficient(d,tex,qrow);
		if (math.isNumeric(v) && math.unequal(math.abs(d),1)) {
		    tex.push('\\times');
		    qrow.append(tommlelt('&times;'));
		}
		addPower(v,math.unaryMinus(q[1]),tex,qrow,roots);
	    } else {
		addNumber(d,tex,qrow);
	    }
	    qfrac.append(qrow);
		mml.append(qfrac);
	    tex.push('}');
	} else {
	    addCoefficient(n, tex, mml);
	    if (math.isNumeric(v) && math.unequal(math.abs(n),1)) {
		tex.push('\\times');
		mml.append(tommlelt('&times;'));
	    }
	    addPower(v, q[1], tex, mml, roots);
	}
    } else {
	addCoefficient(q[0], tex, mml);
	if (math.isNumeric(v) && math.unequal(math.abs(q[0]),1)) {
	    tex.push('\\times');
	    mml.append(tommlelt('&times;'));
	}
	if (math.isNumeric(q[1]) && math.equal(q[1], 1)) {
	    mml.append(tommlelt(v));
	    tex.push(v);
	} else {
	    addPower(v, q[1], tex, mml, roots);
	}
    }
    return true;
}

function addSignedMonomial(q, tex, mml, v, fractions, roots) {
    if (math.equal(q[0], 0)) {
	return;
    }
    var c = q[0];
    if (math.compare(q[0], 0) == 1) {
	tex.push(" + ");
	mml.append(tommlelt("+"));
    }
    if (math.compare(q[0], 0) == -1) {
	tex.push(" - ");
	mml.append(tommlelt("-"));
	c = math.unaryMinus(q[0]);
    }
    addMonomial([c, q[1] ], tex, mml, v, fractions, roots);
}

function addPolynomial(q, tex, mml, v, fractions, roots) {
    var st = true;
    var nz = false;
    
    for (var i = 0; i < q.length; i++) {
	if (!math.equal(q[i][0], 0)) {
	    nz = true;
	    if (st) {
		addMonomial(q[i], tex, mml, v, fractions, roots);
		st = false;
	    } else {
		addSignedMonomial(q[i], tex, mml, v, fractions, roots);
	    }
	}
    }
    return nz;
}

function evaluatePolynomial(q, x) {
    var useFractions = true;
    for (var i = 0; i < q.length; i++) {
	if (q[i][1].d > 1) {
	    useFractions = false;
	    break;
	}
    }

    var convert;

    var t = 0;
    
    if (!useFractions) {
	convert = math.number
    } else {
	convert = function(y) {return y};
    }
    x = convert(x);

    for (var i = 0; i < q.length; i++) {
	t = math.add(t,
		     math.multiply(
			 convert(q[i][0]),
			 math.pow(x,convert(q[i][1]))
		     )
		    );
    }
    return t;
}

function hasSquareRoot(a) {
    if (a.isFraction) {
	var b = math.sqrt(a.n);
	var c = math.sqrt(a.d);
	return (math.floor(b) == b) && (math.floor(c) == c);
    } else {
	var b = math.sqrt(a);
	return math.floor(b) == b;
    }
}

function squareRoot(a) {
    if (a.isFraction) {
	var b = math.sqrt(a.n);
	var c = math.sqrt(a.d);
	return math.fraction(math.divide(b,c));
    } else {
	var b = math.sqrt(a);
	return b;
    }
}

function primeDecomposition(n) {
    var p = [];
    var pr;
    if (n%2 == 0) {
	pr = [2,0];
	while (n%2 == 0) {
	    pr[1]++;
	    n /= 2;
	}
	p.push(pr);
    }
    for (var i = 3; i <= n; i += 2) {
	if (math.isPrime(i)) {
	    if (n%i == 0) {
		pr = [i,0];
		while (n%i == 0) {
		    pr[1]++;
		    n /= i;
		}
		p.push(pr);
	    }
	}
    }
    return p;
}

function commonTerms() {
    var numerators = [];
    var denominators = [];
    var n,d;
    
    for (var i = 0; i < arguments.length; i++) {
	if (arguments[i].isFraction) {
	    numerators.push(arguments[i].n);
	    denominators.push(arguments[i].d);
	} else {
	    numerators.push(arguments[i]);
	}
    }
    n = math.gcd(...numerators);
    if (denominators.length > 0) {
	d = math.gcd(...denominators);
    } else {
	d = 1;
    }
    return math.fraction(math.divide(n,d));
	
}

function powerOfTen(n) {
    switch (n) {
    case 1:
	return "ten";
	break;
    case 2:
	return "hundred";
	break;
    case 3:
	return "thousand";
	break;
    case 4:
	return "ten thousand";
	break;
    case 5:
	return "hundred thousand";
	break;
    case 6:
	return "million";
	break;
    case 7:
	return "ten million";
	break;
    case 8:
	return "hundred million";
	break;
    case 9:
	return "billion";
	break;
    default:
	return "1" + "0".repeat(n);
	break;
    }
    return "";
}

// From http://stackoverflow.com/q/13621545

var mmlelt = function(el) {
    return $(document.createElementNS("http://www.w3.org/1998/Math/MathML", el));
};


// From http://stackoverflow.com/a/34235465

function int_to_words(int) {
  if (int === 0) return 'zero';

  var ONES  = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var TENS  = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  var SCALE = ['','thousand','million','billion','trillion','quadrillion','quintillion','sextillion','septillion','octillion','nonillion'];

  // Return string of first three digits, padded with zeros if needed
  function get_first(str) {
    return ('000' + str).substr(-3);
  }

  // Return string of digits with first three digits chopped off
  function get_rest(str) {
    return str.substr(0, str.length - 3);
  }

  // Return string of triplet convereted to words
  function triplet_to_words(_3rd, _2nd, _1st) {
    return (_3rd == '0' ? '' : ONES[_3rd] + ' hundred ') + (_1st == '0' ? TENS[_2nd] : TENS[_2nd] && TENS[_2nd] + '-' || '') + (ONES[_2nd + _1st] || ONES[_1st]);
  }

  // Add to words, triplet words with scale word
  function add_to_words(words, triplet_words, scale_word) {
    return triplet_words ? triplet_words + (scale_word && ' ' + scale_word || '') + ' ' + words : words;
  }

  function iter(words, i, first, rest) {
    if (first == '000' && rest.length === 0) return words;
    return iter(add_to_words(words, triplet_to_words(first[0], first[1], first[2]), SCALE[i]), ++i, get_first(rest), get_rest(rest));
  }

  return iter('', 0, get_first(String(int)), get_rest(String(int)));
}


// From http://stackoverflow.com/a/22581382

function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

function makeInt(s,d) {
    return parseInt(s,10) || d;
}

/*
Select a random number from a list.
The list is comma separated, each entry is either a number or a range.
Ranges are denoted by a:b and are inclusive.
Optionally, an entry can end in 'xN' to denote that that entry should be considered to be copied N times.
*/

function randomFromRange(s,p) {
    var sel = s.split(',');
    var len = [];
    var ranges = [];
    var denominators = [];
    var numerators = [];
    var total = 0;
    var range;
    var divider;
    var multiplier;
    var mult;
    var matches;
    var start;
    var end;
    var chosen;
    for (var i = 0; i < sel.length; i++) {
	if (sel[i].search(/x\s*\d+/) != -1) {
	    matches = sel[i].match(/x\s*(\d+)/);
	    mult = parseInt(matches[1]);
	    range = sel[i].replace(/x\s*(\d+)/,'');
	} else {
	    range = sel[i];
	    mult = 1;
	}
	if (range.search(/\/\s*\d+/) !== -1) {
	    matches = range.match(/\/\s*(\d+)/);
	    divider = parseInt(matches[1]);
	    range = range.replace(/\/\s*(\d+)/,'');
	} else {
	    divider = 1;
	}
	if (range.search(/\*\s*\d+/) !== -1) {
	    matches = range.match(/\*\s*(\d+)/);
	    multiplier = parseInt(matches[1]);
	    range = range.replace(/\*\s*(\d+)/,'');
	} else {
	    multiplier = 1;
	}
	if (range.search(':') !== -1) {
	    matches = range.match(/(-?\d+)\s*:\s*(-?\d+)/);
	    start = parseInt(matches[1],10);
	    end = parseInt(matches[2],10);
	} else {
	    start = parseInt(range,10);
	    end = parseInt(range,10);
	}
	ranges.push([start,end - start + 1,mult]);
	denominators.push(divider);
	numerators.push(multiplier);
	total += (end - start + 1)*mult;
	len.push(total);
    }
    p = Math.floor(p*total + 1);

    for (var i = 0; i < len.length; i++) {
	if (len[i] >= p) {
	    chosen = i;
	    break;
	}
    }

    p -= len[chosen-1] || 0;
    p = p%ranges[chosen][1];
    p += ranges[chosen][0];

    return math.fraction(
	math.divide(
	    math.multiply(
		p,
		numerators[chosen]
	    ),
	    denominators[chosen]
	)
    );
}

function* generateFromRange(s) {
    var sel = s.split(',');
    var len = [];
    var ranges = [];
    var denominators = [];
    var numerators = [];
    var total = 0;
    var range;
    var divider;
    var multiplier;
    var mult;
    var matches;
    var start;
    var end;
    var chosen;
    for (var i = 0; i < sel.length; i++) {
	if (sel[i].search(/x\s*\d+/) != -1) {
	    matches = sel[i].match(/x\s*(\d+)/);
	    mult = parseInt(matches[1]);
	    range = sel[i].replace(/x\s*(\d+)/,'');
	} else {
	    range = sel[i];
	    mult = 1;
	}
	if (range.search(/\/\s*\d+/) !== -1) {
	    matches = range.match(/\/\s*(\d+)/);
	    divider = parseInt(matches[1]);
	    range = range.replace(/\/\s*(\d+)/,'');
	} else {
	    divider = 1;
	}
	if (range.search(/\*\s*\d+/) !== -1) {
	    matches = range.match(/\*\s*(\d+)/);
	    multiplier = parseInt(matches[1]);
	    range = range.replace(/\*\s*(\d+)/,'');
	} else {
	    multiplier = 1;
	}
	if (range.search(':') !== -1) {
	    matches = range.match(/(-?\d+)\s*:\s*(-?\d+)/);
	    start = parseInt(matches[1],10);
	    end = parseInt(matches[2],10);
	} else {
	    start = parseInt(range,10);
	    end = parseInt(range,10);
	}
	ranges.push([start,end - start + 1,mult]);
	denominators.push(divider);
	numerators.push(multiplier);
	total += (end - start + 1)*mult;
	len.push(total);
    }

    var p;
    for (var j = 0; j < total; j++) {
	p = j+1;

	for (var i = 0; i < len.length; i++) {
	    if (len[i] >= p) {
		chosen = i;
		break;
	    }
	}

	p -= len[chosen-1] || 0;
	p = p%ranges[chosen][1];
	p += ranges[chosen][0];

	yield math.fraction(
	    math.divide(
		math.multiply(
		    p,
		    numerators[chosen]
		),
		denominators[chosen]
	    )
	);
    }
}

function lengthOfRange(s) {
    var sel = s.split(',');
    var len = [];
    var ranges = [];
    var denominators = [];
    var total = 0;
    var range;
    var divider;
    var mult;
    var matches;
    var start;
    var end;
    var chosen;
    for (var i = 0; i < sel.length; i++) {
	if (sel[i].search(/x\s*\d+/) != -1) {
	    matches = sel[i].match(/x\s*(\d+)/);
	    mult = parseInt(matches[1]);
	    range = sel[i].replace(/x\s*(\d+)/,'');
	} else {
	    range = sel[i];
	    mult = 1;
	}
	if (range.search(/\/\s*\d+/) !== -1) {
	    matches = range.match(/\/\s*(\d+)/);
	    divider = parseInt(matches[1]);
	    range = range.replace(/\/\s*(\d+)/,'');
	} else {
	    divider = 1;
	}
	if (range.search(/\*\s*\d+/) !== -1) {
	    matches = range.match(/\*\s*(\d+)/);
	    multiplier = parseInt(matches[1]);
	    range = range.replace(/\*\s*(\d+)/,'');
	} else {
	    multiplier = 1;
	}
	if (range.search(':') !== -1) {
	    matches = range.match(/(-?\d+)\s*:\s*(-?\d+)/);
	    start = parseInt(matches[1],10);
	    end = parseInt(matches[2],10);
	} else {
	    start = parseInt(range,10);
	    end = parseInt(range,10);
	}
	ranges.push([start,end - start + 1,mult]);
	denominators.push(divider);
	total += (end - start + 1)*mult;
	len.push(total);
    }

    return total;
}


function randomLetterFromRange(s,p) {
    var sel = s.split(',');
    var len = [];
    var ranges = [];
    var total = 0;
    var range;
    var mult;
    var matches;
    var start;
    var end;
    var chosen;
    for (var i = 0; i < sel.length; i++) {
	/*
	if (sel[i].search('x') != -1) {
	    matches = sel[i].match(/(.*)x\s*(\d+)/);
	    range = matches[1];
	    mult = parseInt(matches[2]);
	} else {
	    range = sel[i];
	    mult = 1;
	}
	*/
	range = sel[i];
	mult = 1;
	if (range.search(':') !== -1) {
	    matches = range.match(/(-?\w+)\s*:\s*(-?\w+)/);
//	    start = matches[1].charCodeAt(0);
//	    end = matches[2].charCodeAt(0);
	    start = matches[1].codePointAt(0);
	    end = matches[2].codePointAt(0);
	} else {
//	    start = range.charCodeAt(0);
	    //	    end = range.charCodeAt(0);
	    start = range.codePointAt(0);
	    end = range.codePointAt(0);
	}
	ranges.push([start,end - start + 1,mult]);
	total += (end - start + 1)*mult;
	len.push(total);
    }
    p = Math.floor(p*total + 1);

    for (var i = 0; i < len.length; i++) {
	if (len[i] >= p) {
	    chosen = i;
	    break;
	}
    }

    p -= len[chosen-1] || 0;
    p = p%ranges[chosen][1];
    p += ranges[chosen][0];

    return String.fromCodePoint(p);
}

/*
var rand = [];
for (var i = 0; i < 12; i++) {
    rand[i] = 0;
}
for (var i = 0; i < 10000; i++) {
    rand[randomFromRange('-5:-1,1:5',Math.random())+5]++;
}
console.log(rand);
*/

/*
http://stackoverflow.com/a/13627586
*/

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}

/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
*/

// Closure
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }

    // Significant figures round
  if (!Math.roundsf) {
    Math.roundsf = function(value, exp) {
      return decimalAdjust('round', value, Math.floor(Math.log10(Math.abs(value))) + 1 - exp);
    };
  }
  //  Significant figures floor
  if (!Math.floorsf) {
      Math.floorsf = function(value, exp) {
	return decimalAdjust('floor', value, Math.floor(Math.log10(Math.abs(value))) + 1 - exp);
    };
  }
  //  Significant figures ceil
  if (!Math.ceilsf) {
    Math.ceilsf = function(value, exp) {
      return decimalAdjust('ceil', value, Math.floor(Math.log10(Math.abs(value))) + 1 - exp);
    };
  }
})();



// https://stackoverflow.com/a/40330930/315213
function nextletter(l) {
    if (l == "Z") return "A";
    if (l == "z") return "a";
    
    let codePoint = l.codePointAt(0);
/*
    if (
	(64 < codePoint && codePoint < 90)
	    ||
	    (97 < codePoint && codePoint < 122)
    ) {
*/
	return String.fromCodePoint(codePoint + 1);
//    }

}
