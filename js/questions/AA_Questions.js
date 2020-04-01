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
	for (const k in qnsReset) {
	    this.qnsReset[k] = true;
	}
	generators[alias] = this;;
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
    
    
    reset() {
	this.qn = 0;
	for (const k of Object.keys(this.qnsReset)) {
	    this.qns[k] = true;
	}
	return this;
    }

    makeQuestion() {
	var qdiv, adiv, qtex, atex;
	qtex = '';
	qdiv = $('<div>').addClass('question');
	atex = '';
	adiv = $('<div>').addClass('question');
	return Question(qdiv, adiv, qtex, atex, this);
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

    generateQuestions(exlist, sollist, extex, soltex) {
	var qn = this.makeQuestion(false);
	do {
	    qn.addToLists(exlist, sollist, extex, soltex);
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

It also knows where it is on the webpage, so that if it is asked to be
replaced then it can provide a list of all of its locations.
*/

class Question {
    qdiv;
    adiv;
    qtex;
    atex;
    generator;
    location;
    
    constructor(qdiv, adiv, qtex, atex, generator) {
	this.qdiv = qdiv;
	this.adiv = adiv;
	this.qtex = qtex;
	this.atex = atex;
	this.generator = generator;
	return this;
    }

    createDivs() {
	var qd, ad, qt, at;
	var reload = $('<div>').text('⟳').addClass('reload');
	var self = this;
	var reloadfn = function(e) {
	    MathJaxOrNot(function() {self.replace();})
	};
	reload.click(reloadfn);

	var addtowks = $('<div>').text('+').addClass('reload');
	var addtowksfn;
	addtowksfn = function(e) {
	    MathJaxOrNot(function() {this.addToWorksheet();});
	};
	addtowks.click(addtowksfn);
	
	qd = this.qdiv.clone(true, true)
	    .append(reload.clone(true,true))
	    .append(addtowks.clone(true,true));
	ad = this.adiv.clone(true,true);
	qt = $('<div>').text('\n\\item ' + this.qtex);
	at = $('<div>').text('\n\\item ' + this.atex);
	this.location = [qd,ad,qt,at];
	return [qd,ad,qt,at];
    }
    
    addToLists(exlist, sollist, extex, soltex) {
	var divs = this.createDivs();
	
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

	return this;
    }

    replace() {
	var q = this.generator.makeQuestion(true);
	var ndivs = q.createDivs();
	for (var j = 0; j < 4; j++) {
	    this.location[j].replaceWith(ndivs[j]);
	}
	return q;
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
    
    constructor(qnselt,anselt) {
	this.qnselt = qnselt;
	this.anselt = anselt;
	return this;
    }

    addQuestion(qn) {
	questions.push(qn);
	return this;
    }

    removeQuestion(qn) {
	var n;
	for (var i = 0; i < this.questions.length; i++) {
	    if (this.questions[i] == qn) {
		n = i;
	    }
	}
	if (n) {
	    this.questions.splice(n,1);
	}
	return this;
    }
    
}
