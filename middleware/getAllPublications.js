﻿
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

// middleware/getAllEvaluations.js
//load the thing we need
var Evaluation = require('../models/evaluation');
var dynamicSort = require('./dynamicSort');

var getAllPublications = function (req, res, next) {
    var sort = "-published_at";
    var search = "";
    var trial = {$ne: true};
    var query = require('url').parse(req.url, true).query;
    if (query.search) search = query.search;
    if (query.sort) sort = query.sort;
    if (query.trial=='on') trial = true;

    sess = req.session;
      if (sort === "-basics.Basics_Tech_Name") {
        if (!search) {
           
           Evaluation.aggregate([{ $match: { status: '100', trialflag: trial } }, { "$project": { "userid": 1, "title": 1, "trialflag": 1, "planContext.Outcomes": 1, "planContext.Grades": 1, "published_at": 1, "author": 1, "company": 1, "basics.Basics_Tech_Name": 1, "insensitive": { "$toLower": "$basics.Basics_Tech_Name" } } }, { "$sort": { "insensitive": -1 } }]).exec(function (err, evals) {
				if (err) {
					console.log("Error getting shared evals.");
                    console.log(err);
                    return next();
                } else {

					if (evals) {
				//		console.log("Getting shared evals.");
				//		console.log(evals);
						sess.publishlists = evals;
									
                        return next();
                    }
                    return next();
                }
            });

        }
        else {

            Evaluation.aggregate([{ $match: { status: '100', trialflag: trial } }, { "$project": { "userid": 1, "title": 1, "trialflag": 1, "planContext.Outcomes": 1, "planContext.Grades": 1, "published_at": 1, "author": 1, "company": 1, "basics.Basics_Tech_Name": 1, "insensitive": { "$toLower": "$basics.Basics_Tech_Name" } } }, { "$sort": { "insensitive": -1 } }]).exec(function (err, evals) {
                if (err) {
                    console.log(err);
                    return next();
                } else {

                    if (evals) {

                        sess.publishlists = evals;
                        return next();
                    }
                    return next();
                }
            });

        }
    }
    else if (sort === "basics.Basics_Tech_Name") {
        if (!search) {
            console.log(query.sort);
            Evaluation.aggregate([{ $match: { status: '100', trialflag: trial } }, { "$project": { "userid": 1, "title": 1, "trialflag": 1, "planContext.Outcomes": 1, "planContext.Grades": 1, "published_at": 1, "author": 1, "company": 1, "basics.Basics_Tech_Name": 1, "insensitive": { "$toLower": "$basics.Basics_Tech_Name" } } }, { "$sort": { "insensitive": 1 } }]).exec(function (err, evals) {
                if (err) {
                    console.log(err);
                    return next();
                } else {

                    if (evals) {

                        sess.publishlists = evals;
                        return next();
                    }
                    return next();
                }
            });

        }
        else {

            Evaluation.aggregate([{ $match: { status: '100', trialflag: trial } }, { "$project": { "userid": 1, "title": 1, "trialflag": 1, "planContext.Outcomes": 1, "planContext.Grades": 1, "published_at": 1, "author": 1, "company": 1, "basics.Basics_Tech_Name": 1, "insensitive": { "$toLower": "$basics.Basics_Tech_Name" } } }, { "$sort": { "insensitive": 1 } }]).exec(function (err, evals) {
                if (err) {
                    console.log(err);
                    return next();
                } else {

                    if (evals) {

                        sess.publishlists = evals;
                        return next();
                    }
                    return next();
                }
            });

        }
    }    else if (sort === "-published_at") {
        if (!search) {
            console.log(query.sort);
            Evaluation.find({ status: '100',  trialflag: trial }).sort({ "published_at": -1 }).select("userid title trialflag basics.Basics_Tech_Name planContext.Outcomes planContext.Grades published_at author company").exec(function (err, evals) {
                if (err) {
                    console.log(err);
                    return next();
                } else {

                    if (evals) {

                        sess.publishlists = evals;
                        return next();
                    }
                    return next();
                }
            });

        }
        else {

            Evaluation.find({
                $and:
                [{ status: '100',  trialflag: trial }, {
                    $or: [{ "basics.Basics_Tech_Name": { $regex: new RegExp(search, "i") } }, { "author": { $regex: new RegExp(search, "i") } }, { "company": { $regex: new RegExp(search, "i") } },
                        { "planContext.Grades": { $regex: new RegExp(search, "i") } }, { "planContext.Outcomes": { $regex: new RegExp(search, "i") } }]
                }]
            }).sort({ "published_at": -1 }).select("userid title trialflag basics.Basics_Tech_Name planContext.Outcomes planContext.Grades published_at author company").exec(function (err, evals) {
                if (err) {
                    console.log(err);
                    return next();
                } else {

                    if (evals) {

                        sess.publishlists = evals;
                        return next();
                    }
                    return next();
                }
            });

        }
    }
    {
		if (!search) {
		   // console.log("In get all publications not search");
            Evaluation.find({ status: '100',  trialflag: trial }).sort({ "published_at": 1 }).select("userid title trialflag basics.Basics_Tech_Name planContext.Outcomes planContext.Grades published_at author company").exec(function (err, evals) {
                if (err) {
                    console.log(err);
                    return next();
                } else {

                    if (evals) {
				//		console.log("In get all publications not search and evals found = " + evals.length);
                       // evals.sort(dynamicSort(sort));
                        sess.publishlists = evals;
                        return next();
                    }
                    return next();
                }
            });

        }
        else {

            Evaluation.find({
                $and:
                [{ status: '100',  trialflag: trial }, {
                    $or: [{ "basics.Basics_Tech_Name": { $regex: new RegExp(search, "i") } }, { "author": { $regex: new RegExp(search, "i") } }, { "company": { $regex: new RegExp(search, "i") } },
                        { "planContext.Grades": { $regex: new RegExp(search, "i") } }, { "planContext.Outcomes": { $regex: new RegExp(search, "i") } }]
                }]
            }).sort({ "published_at": 1 }).select("userid title trialflag basics.Basics_Tech_Name planContext.Outcomes planContext.Grades published_at author company").exec(function (err, evals) {
                if (err) {
                    console.log(err);
                    return next();
                } else {

                    if (evals) {

                        //evals.sort(dynamicSort(sort));
                        sess.publishlists = evals;
                        return next();
                    }
                    return next();
                }
            });

        }
 }
  


};

module.exports = getAllPublications;



