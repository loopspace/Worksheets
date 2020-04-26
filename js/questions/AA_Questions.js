/*
TODO: need suitable defaults and option type checking
*/

/*
  QuestionGenerator class

A question generator generates questions.  It should know how to
configure itself, and it has an internal state so that it doesn't
generate the same question twice (until it runs out of questions, that
is).

Once it is configured, its main purpose is to generate Question objects.
*/

generators = {};

class QuestionGenerator {
    group;
    title;
    storage;
    qn = 0;
    options = [];
    optdict = {};
    qns = {};
    qnsReset = {};
    seedgen = new Math.seedrandom();
    seed;
    prng;
    
    constructor(group, title, alias, storage, qnsReset) {
	this.title = title;
	this.storage = storage;
	this.group = group;
	this.alias = alias;
	
	for (const k of qnsReset) {
	    this.registerQn(k);
	}
	generators[alias] = this;;
	
	this.addOption("seed", "Random seed", "s", "string", "");
	this.addOption("size", "Number of questions", "z", "integer", 10);
	
	return this;
    }

    addOption(name, text, shortcut, type, deflt) {
	this.options.push({
	    name: name,
	    text: text,
	    shortcut: shortcut,
	    type: type,
	    default: deflt
	});
	this.optdict[name] = this.options.length - 1;
	return this;
    }
    
    setOptions() {
	for (var i = 0; i < this.options.length; i++) {
	    if (this.options[i].type == "integer") {
		this.options[i].value = makeInt(this.options[i].element.val(),this.options[i].default);
	    } else if (this.options[i].type == "boolean") {
		this.options[i].value = this.options[i].element.is(':checked');
	    } else {
		if (this.options[i].element.val() == '') {
		    this.options[i].value = this.options[i].default;
		} else {
		    this.options[i].value = this.options[i].element.val();
		}
	    }
	    this[this.options[i].name] = this.options[i].value;
	    localStorage.setItem(this.storage + ':' + this.options[i].shortcut, this.options[i].value);
	}
	if (this.seed == '') {
	    this.seed = Math.abs(this.seedgen.int32()).toString();
	    this.options[this.optdict.seed].value = this.seed;
	    localStorage.removeItem(this.storage + ':' + this.options[this.optdict.seed].shortcut);
	}
	this.prng = new Math.seedrandom(this.seed);

	return this;
    }

    renderOptions(params) {
	var table,tr,td,opt,val;
	var form = $('<form>');

	table = $('<table>');
    
	for (var i = 0; i < this.options.length; i++) {
	    opt = $('<input>');
	    if (typeof(params[this.options[i].shortcut]) !== "undefined") {
		val = params[this.options[i].shortcut];
		if (this.options[i].type == "boolean") {
		    if (val == "true") {
			val = true;
		    } else {
			val = false;
		    }
		}
	    } else if (typeof(localStorage.getItem(this.storage + ':' + this.options[i].shortcut))) {
		val = localStorage.getItem(this.storage + ':' + this.options[i].shortcut);
		if (this.options[i].type == "boolean") {
		    if (val == "true") {
			val = true;
		    } else {
			val = false;
		    }
		}
	    } else {
		val = this.options[i].default;
	    }
	    if (this.options[i].type == "boolean") {
		opt.attr('type','checkbox').attr('checked',val);
	    } else {
		opt.val(val);
	    }
	    this.options[i].element = opt;
	    tr = $('<tr>');
	    tr.append($('<td>').html(this.options[i].text + ":"));
	    tr.append(
		$('<td>').append(opt)
	    );
	    table.append(tr);
	}



	// Generation
	tr = $('<tr>');
	var btn = $('<button>').html('Create questions').attr('type', 'button').attr('id', 'createqns');
	tr.append($('<td>').append(btn));
	table.append(tr);
	
	form.append(table);
	return form;
    }
    
    
    resetAll() {
	this.qn = 0;
	this.resetSaved();
	return this;
    }

    resetSaved() {
	for (const k of Object.keys(this.qnsReset)) {
	    this.registerQn(k);
	}
	return this;
    }

    checkQn(a) {
	var s;
	if (typeof(a) == 'string') {
	    s = "q:" + a;
	} else if (typeof(a) == 'number') {
	    s = "q:" + a.toString();
	} else {
	    s = "q:" + a.join(':');
	}
	if (s in this.qns) {
	    return true;
	} else {
	    return false;
	}
    }

    registerQn(a) {
	var s;
	if (typeof(a) == 'string') {
	    s = "q:" + a;
	} else if (typeof(a) == 'number') {
	    s = "q:" + a.toString();
	} else {
	    s = "q:" + a.join(':');
	}
	this.qns[s] = true;
    }

    makeQuestion(force) {
	if (this.qn >= this.size && !force) return false;

	// Initialise containers (can be overwritten)
	var qn = new Question(this);
	this.createQuestion(qn);
	this.qn++;
	
	return qn;
    }

    renderHeader() {
    	this.setOptions();

	// Create the headers
	var exhdr = $('<h1>').html(this.title + ' Questions');
	var solhdr = $('<h1>').html(this.title + ' Answers');
	var extxt = $('<div>').addClass('explanation');
	extxt.html(this.explanation());

	// Create the URL &c
	var soltxt = $('<div>').addClass('configuration');
	var solul = $('<ul>');
	var solurl = [location.protocol, '//', location.host, location.pathname].join('') + '?type=' + this.alias;

	for (var i = 0; i < this.options.length; i++) {
	    solul.append($('<li>').html(this.options[i].text + ': ' + this.options[i].value));
	    solurl += '&' + this.options[i].shortcut + '=' + this.options[i].value;
	}
	soltxt.append(solul);
	
	return [exhdr, solhdr, extxt, soltxt, solurl];
    }

    generateQuestions(exlist, sollist, extex, soltex, exmkd, solmkd) {
	var qn = this.makeQuestion(false);
	do {
	    qn.addToLists(exlist, sollist, extex, soltex, exmkd, solmkd, false);
	    qn = this.makeQuestion(false);
	} while (qn);
    }

}

/*
Question class

A Question object is returned by a Question Generator.  It has its
internal information regarding what it is, which consists of:

qdiv - a div containing the question
adiv - a div containing the answer
qtex - a string containing a LaTeX representation of the question
atex - a string containing a LaTeX representation of the answer
qmkd - a string containing a Markdown representation of the question
amkd - a string containing a Markdown representation of the answer

It also knows where it is on the webpage, so that if it is asked to be
replaced then it can provide a list of all of its locations.
*/

class Question {
    qdiv;
    adiv;
    qtex;
    atex;
    qmkd;
    amkd;
    generator;
    location;
    
    constructor(generator) {
	this.qdiv = $('<div>').addClass('question');
	this.adiv = $('<div>').addClass('answer');
	this.qtex = '';
	this.atex = '';
	this.qmkd = '';
	this.amkd = '';
	
	this.generator = generator;
	return this;
    }

    clone() {
	var q = new Question(this.generator);
	q.qdiv = this.qdiv.clone(true,true);
	q.adiv = this.adiv.clone(true,true);
	q.qtex = this.qtex;
	q.atex = this.atex;
	q.qmkd = this.qmkd;
	q.amkd = this.amkd;
	return q;
    }

    createDivs(wks) {
	var qd, ad, qt, at, qm, am;
	var reload = $('<div>').text('⟳').addClass('reload');
	var self = this;
	var reloadfn = function(e) {
	    MathJaxOrNot(function() {self.replace(wks);})
	};
	reload.click(reloadfn);

	var action;
	var self = this;

	if (wks) {
	    action = $('<div>').text('-').addClass('reload');
	    var actionfn = function(e) {
		MathJaxOrNot(function() {self.remove();});
	    };
	} else {
	    action = $('<div>').text('+').addClass('reload');
	    var actionfn = function(e) {
		MathJaxOrNot(function() {
		    $(qd).addClass('fadeOutIn').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){ $(qd).removeClass('fadeOutIn') });

		    addToWorksheet(self);
		});
	    };
	}
	action.click(actionfn);
	
	qd = this.qdiv.clone(true, true)
	    .append(reload.clone(true,true))
	    .append(action.clone(true,true));
	ad = this.adiv.clone(true,true);
	if (wks) {
	    qt = $('<div>').text('\n\\item ' + this.generator.shortexp() + this.qtex);
	    qm = $('<div>').text('\n* ' + this.generator.shortexp() + this.qmkd);
	} else {
	    qt = $('<div>').text('\n\\item ' + this.qtex);
	    qm = $('<div>').text('\n* ' + this.qmkd);
	}
	at = $('<div>').text('\n\\item ' + this.atex);
	am = $('<div>').text('\n* ' + this.amkd);
	this.location = [qd,ad,qt,at,qm,am];
	return [qd,ad,qt,at,qm,am];
    }
    
    addToLists(exlist, sollist, extex, soltex, exmkd, solmkd, wks) {
	var divs = this.createDivs(wks);
	
	var shextxt = $('<span>').addClass('shortexplanation');
	shextxt.html(this.generator.shortexp());
	
	exlist.append(
	    $('<li>').append(shextxt).append(divs[0])
	);
	sollist.append(
	    $('<li>').append(divs[1])
	);
	extex.append(divs[2]);
	soltex.append(divs[3]);
	exmkd.append(divs[4]);
	solmkd.append(divs[5]);

	return this;
    }

    replace(wks) {
	var q = this.generator.makeQuestion(true);
	var ndivs = q.createDivs(wks);
	for (var j = 0; j < this.location.length; j++) {
	    this.location[j].replaceWith(ndivs[j]);
	}
	return q;
    }

    remove() {
	for (var j = 0; j < this.location.length; j++) {
	    this.location[j].remove();
	}
	return this;
    }
}

/*
Worksheet class

This class holds a list of questions, possibly of different types.
*/

class Worksheet {
    qnselt;
    anselt;
    questions = [];
    
    constructor(qdiv,adiv,qtex,atex) {
	this.qdiv = qdiv;
	this.adiv = adiv;
	this.qtex = qtex;
	this.atex = atex;
	// From https://stackoverflow.com/questions/20668560/using-jquery-ui-sortable-to-sort-2-list-at-once
	// make them sortable
	var lists = [adiv, qtex, atex];
	var elts = ['li', 'div', 'div'];
	var pre;
	qdiv.sortable({
	    start:function(event, ui){
		pre = ui.item.index();
	    },
	    stop: function(event, ui) {
		var post = ui.item.index();
		for (var i = 0; i < 3; i++ ){
		    //Use insertBefore if moving UP, or insertAfter if moving DOWN
		    var preelt = lists[i].children(elts[i] + ':eq(' + pre + ')')[0];
		    var postelt = lists[i].children(elts[i] + ':eq(' + post + ')')[0];
		    if (post > pre) {
			$(preelt).insertAfter(postelt);
		    } else {
			$(preelt).insertBefore(postelt);
		    }
		}
	    }
	});
	
	return this;
    }

    addQuestion(qn) {
	var q = qn.clone();
	q.addToLists(this.qdiv, this.adiv, this.qtex, this.atex, true);
	return this;
    }

    
}
