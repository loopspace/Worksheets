// Seedable PRNG from https://github.com/davidbau/seedrandom

var questions;
var worksheet;

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
    init_px2cm();

    var typesel = $('#typeSelect');
    if (qs.type) {
	typesel.val(qs.type);
    } else {
	typesel.val('seq0');
    }
    var opt = typesel.val() || 'seq0';

    var opts = $('#options');
    var qns = $('#qns');
    var ans = $('#ans');
    
    typesel.on('change',
	function() {
	    setOptions(opts,qns,ans,generators[$(this).val()],qs);
	}
    );

    setOptions(opts,qns,ans,generators[opt],qs);

    math.config({
	number: 'Fraction'
    });

    $('#swtoqns').on('click', function(e) {
	e.preventDefault();
	MathJaxOrNot(function() {
	    $('#worksheet').hide();
	    $('#questions').show();
	});
	$('#swtoqns').addClass('current');
	$('#swtowks').removeClass('current');
    });
    $('#swtowks').on('click', function(e) {
	e.preventDefault();
	MathJaxOrNot(function() {
		$('#worksheet').show();
		$('#questions').hide();
	});
	$('#swtowks').addClass('current');
	$('#swtoqns').removeClass('current');
    });

    $('#togglePrintable').on('click', function(e) {
	e.preventDefault();
	cleanDisplay();
    });
    $('#wkcpyqns').click(function() {
	copyToClipboard($('#wkextex')[0]);
    });

    $('#wkcpysol').click(function() {
	copyToClipboard($('#wksoltex')[0]);
    });

// From https://stackoverflow.com/questions/20668560/using-jquery-ui-sortable-to-sort-2-list-at-once
    var pre;
    var lists = ['wksollist', 'wkextex', 'wksoltex'];
    $('#wkexlist').sortable({
	start:function(event, ui){
            pre = ui.item.index();
	},
	stop: function(event, ui) {
            post = ui.item.index();
	    for (var i = 0; i < 3; i++ ){
            //Use insertBefore if moving UP, or insertAfter if moving DOWN
		if (post > pre) {
		    $('#'+ lists[i] + ' li:eq(' +pre+ ')').insertAfter('#'+ lists[i] + ' li:eq(' +post+ ')');
		}else{
		    $('#'+ lists[i] + ' li:eq(' +pre+ ')').insertBefore('#'+ lists[i] + ' li:eq(' +post+ ')');
		}
	    }
	}
    });
}

function setOptions (formdiv,workdiv,ansdiv,obj,params) {
    var form = obj.renderOptions(params);
    formdiv.html('');
    workdiv.html('');
    ansdiv.html('');
    formdiv.append($('<h1>').html(obj.title + " Options"));
    MathJaxOrNot(function() {
	formdiv.append(form);
	var btn = $('#createqns');
	btn.click(function() {
	    MathJaxOrNot(function() {generateQuestions(obj,workdiv,ansdiv);});
	});
    });
}

function generateQuestions(obj,workdiv,ansdiv) {
    var hdr = obj.renderHeader();
    var exlist = $('<ol>').addClass('exlist');
    var sollist = $('<ol>').addClass('sollist').attr('id','sollist');

    // Create the LaTeX segments
    var soltex = $('<div>').addClass('LaTeX').attr('id','soltex');
    var extex = $('<div>').addClass('LaTeX').attr('id','extex');

    // Create the copying buttons
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

    // Put the copying &c stuff together
    hdr[3].append(extex);
    hdr[3].append(soltex);
    hdr[3].append(cpyform);
    hdr[3].append($('<a>').attr('href',hdr[4]).text(hdr[4]).addClass('srcURL'));

    obj.generateQuestions(exlist, sollist, extex, soltex);
    
    workdiv.html('');

    workdiv.append(hdr[0].clone());
    workdiv.append(hdr[2].clone());
    workdiv.append($('<div>').addClass('columns').addClass('questions').append(exlist.addClass('first')));
    
    ansdiv.html('');
    ansdiv.append(hdr[1]);
    ansdiv.append($('<div>').addClass('columns').addClass('answers').append(sollist));
    ansdiv.append(hdr[3]);
}

function addQuestionToWorksheet(e,obj) {
    $(e.target).addClass('fadeOutIn').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){ $(e.target).removeClass('fadeOutIn') });
    var item = e.target.parentElement.parentElement;
    var list = item.parentElement;
    var shextxt = $('<span>').addClass('shortexplanation');
    shextxt.html(obj.shortexp);

    var rmfromwks = $('<div>').text('-').addClass('remove');
    var rmfromwksfn;
    rmfromksfn = function(e) {
	MathJaxOrNot(function() {removeQuestionFromWorksheet(e,obj);});
    };
    rmfromwks.click(rmfromwksfn);
    
    var n;
    for (var i = 0; i < list.childNodes.length; i++) {
	if (list.childNodes[i] == item) {
	    n = i;
	}
    }
    n++;
    var qn = questions[n];
    worksheet.push(qn);

    $('#wkexlist').append(
	    $('<li>').append(
		shextxt.clone(true,true)
	    ).append(
		qn[0].clone().append(rmfromwks.clone(true,true))
	    )
    );

    $('#wksollist').append(
	$('<li>').append(qn[1].clone(true,true))
    );

    $('#wkextex').append(
	$('<div>').text('\n\\item ' + qn[2])
    );

    $('#wksoltex').append(
	$('<div>').text('\n\\item ' + qn[3])	
    );
}

function removeQuestionFromWorksheet(e,obj) {
    var item = e.target.parentElement.parentElement;
    var list = item.parentElement;
    var n;
    for (var i = 0; i < list.childNodes.length; i++) {
	if (list.childNodes[i] == item) {
	    n = i;
	}
    }
    worksheet.splice(n,1);
    $(item).remove();
    $('#wksollist').find('li:nth-child(' + n + ')').remove();
    $('#wkextex').find('div:nth-child(' + n + ')').remove();
    $('#wksoltex').find('div:nth-child(' + n + ')').remove();
}

function cleanDisplay() {
    var b;
    if ($('body').hasClass('printable')) {
	b = false;
    } else {
	b = true;
    }
    
    var hide = ['#options', '#type', '.LaTeXbtn', '.srcURL', '#tabsdiv', '.reload', '.remove', '.configuration'];

    for (const h of hide) {
	if (b) {
	    $(h).hide();
	} else {
	    $(h).show();
	}
    }

    var classes = ['body', '#content', '#questions', '#wkqns', '#togglePrintable'];

    for (const h of classes) {
	if (b) {
	    $(h).addClass('printable');
	} else {
	    $(h).removeClass('printable');
	}
    }

    if (b) {
	var qdiv = $('#qns');
	var wdiv = $('#questions');
	var lq;
	while (wdiv.outerHeight(true) < cm2px(29.7)) {
	    lq = qdiv.clone().addClass('removeable');
	    qdiv.after(lq);
	}
	if (lq) {
	    lq.remove();
	}
    } else {
	$('.removeable').remove();
    }
}

$(window).on('load',init);
