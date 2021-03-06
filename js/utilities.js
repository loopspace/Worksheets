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
    if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue(f);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    } else {
	f();
    }
}


function tomml(s) {
    var mml = mmlelt('math').attr('display','inline');
    mml.append(tommlelt(s));
    return mml;
}

function tommlelt(s) {
    var melt;
    if (typeof(s) == "number") {
	if (s < 0) {
	    melt = mmlelt('mrow');
	    var mselt = mmlelt('mo').attr('lspace',"verythinmathspace").attr('rspace',"0em");
	    mselt.html('&minus;');
	    melt.append(mselt)
	    mselt = mmlelt('mn');
	    mselt.html(-s);
	    melt.append(mselt);
	} else {
	    melt = mmlelt('mn');
	    melt.html(s);
	}
    } else if (s.isFraction) {
	if (s.d == 1) {
	    melt = mmlelt('mn');
	    melt.html(s.s * s.n);
	} else {
	    melt = mmlelt('mrow');
	    var mselt;
	    if (s.s == -1) {
		mselt = mmlelt('mo').attr('lspace',"verythinmathspace").attr('rspace',"0em");
		mselt.html('&minus;');
		melt.append(mselt);
	    }
	    mselt = mmlelt('mfrac');
	    mselt.append(mmlelt('mn').html(s.n));
	    mselt.append(mmlelt('mn').html(s.d));
	    melt.append(mselt);
	}
    } else if (s.search(/^&?[a-zA-Z]+;?$/) != -1) {
	melt = mmlelt('mi');
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

function texnum(s) {
    var tex = '';
    if (s.isFraction) {
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
    if (p != 0) {
	if (p < 0 ) {
	    tex.push(' - ');
	    mml.append(tommlelt('-'));
	    p = - p;
	} else {
	    tex.push(' + ');
	    mml.append(tommlelt('+'));
	}
	if (p != 1) {
	    tex.push(texnum(p));
	    mml.append(tommlelt(p));
	}
	return true;
    } else {
	return false;
    }
}

function addSignofCoefficient(p,tex,mml) {
    if (p != 0) {
	if (p < 0 ) {
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
    if (p != 0) {
	if (p < 0 ) {
	    p = - p;
	}
	if (p != 1) {
	    tex.push(texnum(p));
	    mml.append(tommlelt(p));
	}
	return true;
    } else {
	return false;
    }
}

function addCoefficient(p,tex,mml) {
    if (p != 0) {
	if (p < 0 ) {
	    tex.push(' - ');
	    mml.append(tommlelt('-'));
	    p = - p;
	}
	if (p != 1) {
	    tex.push( texnum(p));
	    mml.append(tommlelt(p));
	}
	return true;
    } else {
	return false;
    }
}

function addNumber(p,tex,mml) {
    if (p != 0) {
	tex.push(texnum(p));
	mml.append(tommlelt(p));
	return true;
    } else {
	return false;
    }
}

function addSignedNumber(p,tex,mml) {
    if (p != 0) {
	if (p < 0 ) {
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
    var total = 0;
    var range;
    var mult;
    var matches;
    var start;
    var end;
    var chosen;
    for (var i = 0; i < sel.length; i++) {
	if (sel[i].search('x') != -1) {
	    matches = sel[i].match(/(.*)x\s*(\d+)/);
	    range = matches[1];
	    mult = parseInt(matches[2]);
	} else {
	    range = sel[i];
	    mult = 1;
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

    return p;
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
	    start = matches[1].charCodeAt(0);
	    end = matches[2].charCodeAt(0);
	} else {
	    start = range.charCodeAt(0);
	    end = range.charCodeAt(0);
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

    return String.fromCharCode(p);
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

