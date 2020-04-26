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

    worksheet = new Worksheet(
	$('#wkexlist'),
	$('#wksollist'),
	$('#wkextex'),
	$('#wksoltex'),
	$('#wkexmkd'),
	$('#wksolmkd')
    );
    
    $('#wkcpyqnstex').click(function() {
	copyToClipboard($('#wkextex')[0]);
    });

    $('#wkcpysoltex').click(function() {
	copyToClipboard($('#wksoltex')[0]);
    });

    $('#wkcpyqnsmkd').click(function() {
	copyToClipboard($('#wkexmkd')[0]);
    });

    $('#wkcpysolmkd').click(function() {
	copyToClipboard($('#wksolmkd')[0]);
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

    // Create the Markdown segments
    var solmkd = $('<div>').addClass('Markdown').attr('id','solmkd');
    var exmkd = $('<div>').addClass('Markdown').attr('id','exmkd');

    // Create the copying buttons
    var cpyform = $('<form>');
    var cpysolbtn = $('<button>')
	.attr('type','button')
	.addClass('LaTeXbtn')
	.html('LaTeX')
	.click(function() {
	    copyToClipboard(soltex[0]);
	});

    
    var cpyexbtn = $('<button>')
	.attr('type','button')
	.addClass('LaTeXbtn')
	.html('LaTeX')
	.click(function() {
	    copyToClipboard(extex[0]);
	});

    var cpysolmbtn = $('<button>')
	.attr('type','button')
	.addClass('LaTeXbtn')
	.html('Markdown')
	.click(function() {
	    copyToClipboard(solmkd[0]);
	});

    var cpyexmbtn = $('<button>')
	.attr('type','button')
	.addClass('LaTeXbtn')
	.html('Markdown')
	.click(function() {
	    copyToClipboard(exmkd[0]);
	});


    cpyform.append($('<span>').html('Copy questions to clipboard as '));
    cpyform.append(cpyexbtn);
    cpyform.append(cpyexmbtn);
    cpyform.append($('<br>'));
    cpyform.append($('<span>').html('Copy answers to clipboard as '));
    cpyform.append(cpysolbtn);
    cpyform.append(cpysolmbtn);
    

    // Put the copying &c stuff together
    hdr[3].append(extex);
    hdr[3].append(soltex);
    hdr[3].append(exmkd);
    hdr[3].append(solmkd);
    hdr[3].append(cpyform);
    hdr[3].append($('<a>').attr('href',hdr[4]).text(hdr[4]).addClass('srcURL'));

    obj.resetAll();
    obj.generateQuestions(exlist, sollist, extex, soltex, exmkd, solmkd);
    
    workdiv.html('');

    workdiv.append(hdr[0].clone());
    workdiv.append(hdr[2].clone());
    workdiv.append($('<div>').addClass('columns').addClass('questions').append(exlist.addClass('first')));
    
    ansdiv.html('');
    ansdiv.append(hdr[1]);
    ansdiv.append($('<div>').addClass('columns').addClass('answers').append(sollist));
    ansdiv.append(hdr[3]);

    // make them sortable
    var lists = ['sollist', 'extex', 'soltex', 'exmkd', 'solmkd'];
    var elts = ['li', 'div', 'div'];
    var pre;
    exlist.sortable({
	start:function(event, ui){
            pre = ui.item.index();
	},
	stop: function(event, ui) {
            var post = ui.item.index();
	    for (var i = 0; i < 3; i++ ){
            //Use insertBefore if moving UP, or insertAfter if moving DOWN
		if (post > pre) {
		    $('#'+ lists[i] + ' ' + elts[i] + ':eq(' +pre+ ')').insertAfter('#'+ lists[i] + ' ' + elts[i] + ':eq(' +post+ ')');
		}else{
		    $('#'+ lists[i] + ' ' + elts[i] + ':eq(' +pre+ ')').insertBefore('#'+ lists[i] + ' ' + elts[i] + ':eq(' +post+ ')');
		}
	    }
	}
    });

}

function addToWorksheet(qn) {
    worksheet.addQuestion(qn);
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
