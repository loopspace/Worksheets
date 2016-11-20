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



function init() {

    var types = {
	seq0: new SeqNextTerms(),
	seq1: new SeqTermToTerm(),
	seq2: new SeqnthTerm(),
	seq3: new SeqArithSeq(),
	seq4: new SeqSumSeries()
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
    var solurl = window.location.pathname + '?type=' + type;

    for (var i = 0; i < obj.options.length; i++) {
	solul.append($('<li>').html(obj.options[i].text + ': ' + obj.options[i].value));
	solurl += '&' + obj.options[i].shortcut + '=' + obj.options[i].value;
    }
    soltxt.append(solul);

    var soltex = $('<div>').addClass('LaTeX');
    var cpyform = $('<form>');
    var cpybtn = $('<button>').attr('type','button');
    cpyform.append(cpybtn);
    cpybtn.html('Copy LaTeX to clipboard');
    cpybtn.click(function() {
	copyToClipboard(soltex[0]);
    });
    soltxt.append(soltex);
    soltxt.append(cpyform);
    soltxt.append($('<a>').attr('href',solurl).text(solurl));
    
    var exlist = $('<ol>').addClass('exlist');
    var sollist = $('<ol>').addClass('sollist');
    var item;
    
    obj.reset();
    var qn = obj.makeQuestion();
    do {
	exlist.append(
	    $('<li>').append(qn[0])
	);
	sollist.append(
	    $('<li>').append(qn[1])
	);
	soltex.append(
	    $('<div>').text('\n\\item ' + qn[2])
	);
	qn = obj.makeQuestion();
    } while (qn);

    workdiv.html('');

    for (var i = 0; i < obj.repeat; i++) {
	workdiv.append(exhdr.clone());
	workdiv.append(extxt.clone());
	workdiv.append($('<div>').addClass('columns').append(exlist.clone()));
    }
    ansdiv.html('');
    ansdiv.append(solhdr);
    ansdiv.append($('<div>').addClass('columns').append(sollist));
    ansdiv.append(soltxt);
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
    } else if (s.search(/^[a-zA-Z]+$/) != -1) {
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

// From http://stackoverflow.com/q/13621545

var mmlelt = function(el) {
    return $(document.createElementNS("http://www.w3.org/1998/Math/MathML", el));
};


// From http://stackoverflow.com/a/34235465

function int_to_words(int) {
  if (int === 0) return 'zero';

  var ONES  = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var TENS  = ['','','twenty','thirty','fourty','fifty','sixty','seventy','eighty','ninety'];
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
