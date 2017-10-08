// Seedable PRNG from https://github.com/davidbau/seedrandom

// Parse query string
var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

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

function init() {
    init_px2cm();

    var types = {
	seq0: new SeqNextTerms(),
	seq1: new SeqTermToTerm(),
	seq2: new SeqnthTerm(),
	seq3: new SeqArithSeq(),
	seq4: new SeqArithTerm(),
	seq5: new SeqSumSeries(),
	quad0: new QuadFact(),
	quad1: new QuadSolveFact(),
	quad2: new QuadCplt(),
	quad3: new QuadSolveCplt(),
	quad4: new QuadFormula(),
	arith0: new ArithSums(),
	arith1: new ToStdForm(),
	arith2: new FromStdForm(),
	arith3: new RoundDP(),
	arith4: new RoundSF(),
    };

    var typesel = $('#typeSelect');
    if (qs.type) {
	typesel.val(qs.type);
    } else {
	typesel.val('seq0');
    }
    var opt = typesel.val() || 'seq0';
    
    typesel.on('change',
	function() {
	    setOptions($('#options'),$('#worksheet'), $('#answers'),$(this).val(),types[$(this).val()],qs);
	}
    );

    setOptions($('#options'),$('#worksheet'), $('#answers'),opt,types[opt],qs);

    math.config({
	number: 'Fraction'
    });

}

function setOptions (formdiv,workdiv,ansdiv,type,obj,params) {
    var table,tr,td,opt,val;
    var form = $('<form>');
    var options = obj.options;

    table = $('<table>');
    
    for (var i = 0; i < options.length; i++) {
	opt = $('<input>');
	if (typeof(params[options[i].shortcut]) !== "undefined") {
	    val = params[options[i].shortcut];
	    if (options[i].type == "boolean") {
		if (val == "true") {
		    val = true;
		} else {
		    val = false;
		}
	    }
	} else if (typeof(localStorage.getItem(obj.storage + ':' + options[i].shortcut))) {
	    val = localStorage.getItem(obj.storage + ':' + options[i].shortcut);
	    if (options[i].type == "boolean") {
		if (val == "true") {
		    val = true;
		} else {
		    val = false;
		}
	    }
	} else {
	    val = options[i].default;
	}
	if (options[i].type == "boolean") {
	    opt.attr('type','checkbox').attr('checked',val);
	} else {
	    opt.val(val);
	}
	options[i].element = opt;
	tr = $('<tr>');
	tr.append($('<td>').html(options[i].text + ":"));
	tr.append(
	    $('<td>').append(opt)
	);
	table.append(tr);
    }

    // Generation
    tr = $('<tr>');
    var btn = $('<button>').html('Create questions').attr('type', 'button');
    tr.append($('<td>').append(btn));
    btn.click(function() {
	obj.setOptions();
	if (typeof MathJax !== 'undefined') {
            MathJax.Hub.Queue(function() {addQuestions(workdiv,ansdiv,type,obj);});
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	} else {
	    addQuestions(workdiv,ansdiv,type,obj);
	}

    });
    table.append(tr);
	
    form.append(table);
    formdiv.html('');
    workdiv.html('');
    ansdiv.html('');
    formdiv.append($('<h1>').html(obj.title + " Options"));
    formdiv.append(form);
}

function addQuestions(workdiv,ansdiv,type,obj) {
    var exhdr = $('<h1>').html(obj.title + ' Questions');
    var solhdr = $('<h1>').html(obj.title + ' Answers');
    var extxt = $('<div>').addClass('explanation');
    extxt.html(obj.explanation);
    
    var soltxt = $('<div>').addClass('configuration');
    var solul = $('<ul>');
    var solurl = [location.protocol, '//', location.host, location.pathname].join('') + '?type=' + type;

    for (var i = 0; i < obj.options.length; i++) {
	solul.append($('<li>').html(obj.options[i].text + ': ' + obj.options[i].value));
	solurl += '&' + obj.options[i].shortcut + '=' + obj.options[i].value;
    }
    soltxt.append(solul);

    var soltex = $('<div>').addClass('LaTeX').attr('id','soltex');
    var extex = $('<div>').addClass('LaTeX').attr('id','extex');
    var cpyform = $('<form>');
    var cpysolbtn = $('<button>').attr('type','button').addClass('LaTeXbtn');
    var cpyexbtn = $('<button>').attr('type','button').addClass('LaTeXbtn');
    cpyform.append(cpyexbtn);
    cpyform.append(cpysolbtn);
    cpysolbtn.html('Copy answers to clipboard as LaTeX');
    cpysolbtn.click(function() {
	copyToClipboard(soltex[0]);
    });
    cpyexbtn.html('Copy questions to clipboard as LaTeX');
    cpyexbtn.click(function() {
	copyToClipboard(extex[0]);
    });
    soltxt.append(extex);
    soltxt.append(soltex);
    soltxt.append(cpyform);
    soltxt.append($('<a>').attr('href',solurl).text(solurl).addClass('srcURL'));
    
    var exlist = $('<ol>').addClass('exlist');
    var sollist = $('<ol>').addClass('sollist').attr('id','sollist');
    var item;
    
    obj.reset();
    var qn = obj.makeQuestion(false);
    var reload = $('<div>').text('⟳').addClass('reload');
    var reloadfn;
    if (typeof MathJax !== 'undefined') {
	reloadfn = function(e) {
            MathJax.Hub.Queue(function() {reloadQuestion(e,obj);});
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	}
    } else {
	reloadfn = function(e) {
	    reloadQuestion(e,obj);
	}
    }
    reload.click(reloadfn);


    do {
	exlist.append(
	    $('<li>').append(qn[0].append(reload.clone(true,true)))
	);
	sollist.append(
	    $('<li>').append(qn[1])
	);
	extex.append(
	    $('<div>').text('\n\\item ' + qn[2])
	);
	soltex.append(
	    $('<div>').text('\n\\item ' + qn[3])
	);
	qn = obj.makeQuestion(false);
    } while (qn);

    workdiv.html('');

    workdiv.append(exhdr.clone());
    workdiv.append(extxt.clone());
    workdiv.append($('<div>').addClass('columns').addClass('questions').append(exlist.clone(true,true).addClass('first')));
    
    if (obj.repeat) {
	var h = workdiv.outerHeight(true);
	var hdrelt, txtelt, colelt;
	while (workdiv.outerHeight(true) < cm2px(29.7)) {
	    hdrelt = exhdr.clone();
	    txtelt = extxt.clone();
	    colelt = $('<div>').addClass('columns').addClass('questions').append(exlist.clone());
	    workdiv.append(hdrelt);
	    workdiv.append(txtelt);
	    workdiv.append(colelt);
	}
	hdrelt.remove();
	txtelt.remove();
	colelt.remove();
    }
    ansdiv.html('');
    ansdiv.append(solhdr);
    ansdiv.append($('<div>').addClass('columns').addClass('answers').append(sollist));
    ansdiv.append(soltxt);
}

function reloadQuestion(e,obj) {
    var item = e.target.parentElement.parentElement;
    var list = item.parentElement;
    var n;
    for (var i = 0; i < list.childNodes.length; i++) {
	if (list.childNodes[i] == item) {
	    n = i;
	}
    }
    n++;
    var qn = obj.makeQuestion(true);
    var reload = $('<div>').text('⟳').addClass('reload');
    var reloadfn;
    if (typeof MathJax !== 'undefined') {
	reloadfn = function(e) {
            MathJax.Hub.Queue(function() {reloadQuestion(e,obj);});
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	}
    } else {
	reloadfn = function(e) {
	    reloadQuestion(e,obj);
	}
    }
    reload.click(reloadfn);
    var newitem = $('<li>').append(qn[0].append(reload.clone(true,true)));
    $(item).replaceWith(newitem.clone(true,true));

    $('.questions').each(function(i,elt) {
	$(elt).find('li:nth-child(' + n + ')').replaceWith(newitem.clone(true,true))
    });

    $('#sollist').find('li:nth-child(' + n + ')').replaceWith($('<li>').append(qn[1]));
    $('#extex').find('div:nth-child(' + n + ')').replaceWith($('<div>').text('\n\\item ' + qn[2]));
    $('#soltex').find('div:nth-child(' + n + ')').replaceWith($('<div>').text('\n\\item ' + qn[3]));
}

$(window).on('load',init);

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
	    tex.push(p);
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
	    tex.push( p);
	    mml.append(tommlelt(p));
	}
	return true;
    } else {
	return false;
    }
}

function addNumber(p,tex,mml) {
    if (p != 0) {
	tex.push(p);
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
	    p = - p;
	} else {
	    tex.push(' + ');
	    mml.append(tommlelt('+'));
	}
	tex.push( p);
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
