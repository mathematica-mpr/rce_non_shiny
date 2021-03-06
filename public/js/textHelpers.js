﻿
function calculateDurObject(d) {
	var duration =
		{
			length: d,
			unit: "day",
			remainder: 0
		}
	if (d < 7) {
		// default 
	} else if (d < 30) {
		duration.length = Math.floor(d / 7);
		duration.unit = 'week';
		duration.remainder = d % 7;
	} else if (d < 365) {
		duration.length = Math.floor(d / 30);
		duration.unit = 'month';
		duration.remainder = d % 30;
	} else {
		duration.length = Math.floor(d / 365);
		duration.unit = 'year';
		duration.remainder = d % 365;
	}
	return duration;
}

(function (exports) {
exports.stripPercent = function (x) {
    //console.log("in stripPercent and x = " + parseFloat(x.replace(/%/g, '')));
    return parseFloat(x.replace(/%/g, ''));
}

	exports.capitalize = function (x) {
    var out;

    if (x.length === 0) {
        out = '';
    }
    else {
        out = x.toString()[0].toUpperCase() + x.toString().substring(1);
    }
    return out;
}

	exports.punctuate = function (x) {
	    return x.replace(/([^.?!])$/, "$1.");
	}

	exports.sentence = function (x) {
    // Capitalize first letter and if it doesn't end with punctuation, add a period.
    return capitalize(punctuate(x));
}

	exports.round10 = function (value, exp) {
    // If the exp is undefined or zero...
	    
		value = Number(value.toString().replace("%",""));
    if (typeof exp === 'undefined' || +exp === 0)
        return Math.round(value);
	
	  
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
        return value;

    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
	}


	exports.wordList = function (x) {
    var out;

    if (x === undefined || !(x instanceof Array)) {
        out = '';
    }
    else {
        try {
            x = x.filter(function(x) { return x !== "" && x !== undefined });

            x = unique(x);

            if (x.length === 0) {
                out = '';
            }
            else if (x.length === 1) {
                out = x[0];
            }
            else if (x.length === 2) {
                out = x[0] + ' and ' + x[1];
            }
            else {
                out = x.slice(0, x.length - 1).join(', ') + ', and ' + x.slice(-1);
            }
        } catch (e) {
            out = '';
        }
    }

    return out;
}

	exports.unique = function (x) {

    for (var i = 0; i < x.length; i++) {
        if (x.indexOf(x[i]) < i) {
            x.splice(i, 1);
            i--;
        }
    }

    return x;
},

	exports.allBlank =function (x) {
    return x.every(function (el) { return el === '' });
}

	exports.round3 = function (x) {
    return Math.round(x * 1000) / 1000;
}

	exports.dynamicSort = function(property) {
	var sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a, b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	}
}

	exports.calculateDuration = function (sd, ed) {
        try {
            var beginDate = new Date(sd);
			var endDate = new Date(ed);

            var d = (Math.ceil((endDate - beginDate) / 86400000));

			var duration = calculateDurObject(d);
			console.log("duration  object");
			console.log(duration);
            var durationPlural = (duration.length > 1) ? "s" : "";
			var durationString = duration.length === 0 ? "Not reported" : duration.length.toString() + ' ' + duration.unit + durationPlural;
			console.log("duration = " + durationString);
			if ((duration.remainder > 6) || (duration.remainder > 0 && duration.unit === "week")) {
				var rduration = calculateDurObject(duration.remainder);
				durationPlural = (rduration.length > 1) ? "s" : "";
				durationString = durationString + ((rduration.remainder > 6) || (rduration.remainder > 0 && duration.unit === "week") ? ", " : " and ") + rduration.length.toString() + " " + rduration.unit + durationPlural;
				console.log("duration = " + durationString);
				if ((rduration.remainder > 6) || (rduration.remainder > 0 && duration.unit === "week")) {
					var r2Duration = calculateDurObject(rduration.remainder);
					durationPlural = (r2Duration.length > 1) ? "s" : "";
					durationString = durationString + ", and " + r2Duration.length.toString() + " " + r2Duration.unit + durationPlural;
					console.log("duration = " + durationString);
				}
			}

            return durationString;

        } catch (e) {
            return "Not Reported";
        }
	}
	exports.createGradeString = function(selected) {
	var gradeMap = {
		"PK": "pre-kindergarten",
		"K": "kindergarten",
		"1": "1st",
		"2": "2nd",
		"3": "3rd",
		"4": "4th",
		"5": "5th",
		"6": "6th",
		"7": "7th",
		"8": "8th",
		"9": "9th",
		"10": "10th",
		"11": "11th",
		"12": "12th",
		"PS": "post-secondary"
	}

    var grades_used = [];
    var grade_streak = 0;
    var start_grade = '';
    var end_grade = '';

	for (var grade in gradeMap) {
		if (selected.some(function (x) { return x === grade })) {
			grade_streak++;

			if (grade_streak === 1) start_grade = gradeMap[grade];
			else end_grade = gradeMap[grade];
		}
		else {

			if (grade_streak === 1) {
				grades_used.push(start_grade);
			}
			else if (grade_streak > 1) {
				grades_used.push(start_grade + '-' + end_grade);
			}

			grade_streak = 0;
		}
	}

    return grades_used.toString();
}

} (typeof exports === 'undefined' ? this.textHelpers = {} : exports));
