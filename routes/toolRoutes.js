﻿
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

//routes/toolRoutes.js
// load up the thing we need
var fs = require('fs');
var async = require('async');
//var juice = require('juice');

//var request = require('request');

var Evaluation = require('../models/evaluation.js');
var isLoggedIn = require("../middleware/isLoggedIn.js");
var getCurrentEvaluation = require('../middleware/getCurrentEvaluation.js');
var sess;
//please note that req.session.step is for managing the active tab for coach.html
//the following defines the tool routes available, only four routes available currently



module.exports = function (app, passport) {
   // app.use(isLoggedIn);
    app.use(getCurrentEvaluation);
	
	
	function dynamicSort(property) {
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
	
	
	function updateLastTool(eval, toollist) {
		var tool = eval.toolsvisited.filter(function (x) { return x.name === toollist.name });
	    console.log(tool);
		if (tool.length == 0) {
			eval.toolsvisited.push(toollist);
		}
		else {
			var index = eval.toolsvisited.indexOf(tool[0]);
			if (index > -1) {
				if (tool[0].status === "completed") toollist = { "name": toollist.name, "status": "completed", "visited_at": new Date() };
				eval.toolsvisited.splice(index, 1);
				eval.toolsvisited.push(toollist);
			}
		}
		if (eval.stepsclicked.indexOf(eval.last_step) < 0) eval.stepsclicked.push(eval.last_step);
	} 
	
	//02.03 The Basics
    app.get('/basics', isLoggedIn, function (req, res) {
		sess = req.session;
		sess.eval.last_step = 2;
		sess.eval.last_tool = "The Basics";
	//	console.log(eval.basics);
        var query = require('url').parse(req.url, true).query;
        res.render('basics.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query   });
	});
    app.post('/basics', isLoggedIn, function (req, res) {
        sess = req.session;
		var obj = req.body;
		var returnpath = obj.returnpath;
		if (returnpath === '') returnpath = "basics";
        var toolName = "The Basics";
        var toollist = { "name": toolName, "status": req.body.status, "visited_at": new Date() };
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },
            function (eval, done) {
                //eval find so update the toolsVisisted accordingly
                eval.last_step = 2;
                eval.last_tool = toolName;
                updateLastTool(eval, toollist);
				//add/update the probAppr within eval
				var basics = obj.Basics;
               
                if (!eval.basics) {
                    eval.basics.created_at = dt;

                }
                else {
                    eval.basics.created_at = eval.basics.created_at;
                    eval.basics.updated_at = dt;
                };

                eval.basics = basics;
                if (eval.stepsclicked.indexOf(2) < 0) eval.stepsclicked.push(2);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    //  console.log(eval);
                    if (req.body.status === "started") {
                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/' + returnpath);
                    }
                    else {
                        return res.redirect('/coach');
                    }

                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
    });
    
	//02. Who used and how	   
	app.get('/who_and_how', function (req, res) {
		//	console.log("In DYA get method.");
		sess = req.session;
		sess.eval.last_step = 2;
		sess.eval.last_tool = "Who Used Your Technology and How";
		var query = require('url').parse(req.url, true).query;
		res.render('who_and_how.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
	});
    //02.03 determine your approach
    app.get('/determine_your_approach', isLoggedIn, function (req, res) {
	//	console.log("In DYA get method.");
        sess = req.session;
        sess.eval.last_step = 2;
        sess.eval.last_tool = "Determine Your Approach";
        var query = require('url').parse(req.url, true).query;
        res.render('determine_your_approach.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
    app.post('/determine_your_approach', isLoggedIn,  function (req, res) {
        sess = req.session;
		var obj = req.body;
		var returnpath = obj.returnpath;		
		var returnpath = obj.returnpath;
		if (returnpath === '') returnpath = "determine_your_approach";
        var toollist = { "name": "Determine Your Approach", "status": req.body.status, "visited_at": new Date() };
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });                      
                }
                else
                    res.redirect('/coach');                     
            },
            function (eval, done) {
                //eval find so update the toolsVisisted accordingly
				eval.last_step = 2;
                eval.last_tool = "Determine Your Approach";
				updateLastTool(eval, toollist);
				//add/update the probAppr within eval
               
                    eval.prepareRandom.Individual_Group = obj.Individual_Group;
				
                    eval.prepareRandom.Cluster_Group = obj.Cluster_Group;
				
                    eval.prepareRandom.Cluster_Group_Other = obj.Cluster_Group_Other;
              
                var probAppr = {
						"Appr_Current_or_New": obj.Appr_Current_or_New, 
						"Appr_All_Using": obj.Appr_All_Using,
						"Appr_Can_Group": obj.Appr_Can_Group, 
						"Appr_How_Choose": obj.Appr_How_Choose

				};
				if (!eval.probAppr) {
				    eval.probAppr.created_at = dt;
				}
                else {
				    eval.probAppr.updated_at = dt;
				};
                
                eval.probAppr = probAppr;
                if (eval.stepsclicked.indexOf(2) < 0) eval.stepsclicked.push(2);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
					sess.eval = eval;
                  //  console.log(eval);
                    if (req.body.status == "started") {
                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/' + returnpath);
                    }
                    else {
                        return res.redirect('/coach');
                    }
                    
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
	});
	
    app.post('/pdf_view', isLoggedIn,  function (req, res) {
		sess = req.session;
		var obj = req.body;
		var toollist = { "name": obj.tname, "status": "completed", "visited_at": new Date() };
		var dt = new Date();
		//console.log(req.body);
		async.waterfall([
			function (done) {
				if (sess.eval) {
					Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
						if (!eval) {
                            res.status(404).send("Eval not found");
						}
						if (err) {
                            res.status(500).send(err);
						}
						return done(err, eval);
					});
				}
				else
                    res.status(404).send("Eval not found");
			},
			function (eval, done) {
				//console.log(eval);
				//eval find so update the toolsVisisted accordingly
				eval.last_step = obj.step;
				eval.last_tool = obj.tname;
				updateLastTool(eval, toollist);
				
				if (eval.stepsclicked.indexOf(obj.step) < 0) eval.stepsclicked.push(obj.step);
				eval.save(function (err) {
					if (err) {
                        res.status(500).send(err);
					}
					else {
                        sess.eval = eval;
                        //console.log(eval);
                        res.send(eval);
					}
                    
				});
			}
		], function (err) {
            res.status(500).send(err);
		});
	});

    app.get('/craft_your_research_q', isLoggedIn, function (req, res) {	   
		sess = req.session;
	//	console.log(sess.eval);
        sess.eval.last_step = 3;
        sess.eval.last_tool = "Craft Your Research Question";
        var query = require('url').parse(req.url, true).query;
        res.render('craft_your_research_q.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
    //03.01 crafting a research question
    app.post('/craft_your_research_q', isLoggedIn,  function (req, res) {
        var toollist = { "name": "Craft Your Research Question", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 3;
		var obj = req.body;
		var returnpath = obj.returnpath;
		if (returnpath === '') returnpath = "craft_your_research_q";
        var dt = new Date();
        if (!obj.evalid) { obj.evalid = sess.eval._id; }
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },
            function (eval, done) {
				eval.last_step = 3;
                eval.last_tool = "Craft Your Research Question";
                //eval find so update the toolsVisisted accordingly
				updateLastTool(eval, toollist);
				
				
				//add/update the planQuestion within eval
				eval.basics.Basics_Outcome_Other = obj.Basics_Outcome_Other;
				eval.basics.Basics_Outcome = obj.Basics_Outcome;

                var planQuestion = {
                        "Outcome_Measure": obj.Outcome_Measure,
						"Outcome_Direction": obj.Outcome_Direction, 
						"Intervention_Group_Desc": obj.Intervention_Group_Desc,
						"Comparison_Group_Desc": obj.Comparison_Group_Desc
				};
				if (!eval.planQuestion) {
				    eval.planQuestion.created_at = dt;

				}
                else {
				    eval.planQuestion.updated_at = dt;
				};

                eval.planQuestion = planQuestion;
                if (eval.stepsclicked.indexOf(3) < 0) eval.stepsclicked.push(3);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {
                        req.flash('saveMessage', 'Changes Saved.')
                        return res.redirect('/' + returnpath);
                    }
                    else {
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
    });
    //03.02 plan next steps
    app.get('/plan_next_steps', isLoggedIn,  function (req, res) {
        sess = req.session;
        sess.eval.last_step = 3;
        sess.eval.last_tool = "Think About How to Use Your Result";
        var query = require('url').parse(req.url, true).query;
        res.render('plan_next_steps.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query  });
    });
    app.post('/plan_next_steps', isLoggedIn, function (req, res) {
        var toollist = { "name": "Think About How to Use Your Results", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 3;
		var obj = req.body;
		var returnpath = obj.returnpath;
        if (returnpath === '') returnpath = "plan_next_steps";
	//	console.log(obj);
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },
            function (eval, done) {
				eval.last_step = 3;
                eval.last_tool = "Think About How to Use Your Result";
                //eval find so update the toolsVisisted accordingly
				updateLastTool(eval, toollist);

				//add/update the planQuestion within eval
				eval.planQuestion.Outcome_Measure = obj.Outcome_Measure; // measure
				eval.planQuestion.Outcome_Direction = obj.Outcome_Direction; // direction
			
               var planNext = {
						"Tech_Cost_Saves": obj.Tech_Cost_Saves,
						"Tech_Amount": obj.Tech_Amount,
						"Tech_Cost_User": obj.Tech_Cost_User, 
						"Tech_Cost_Desc": obj.Tech_Cost_Desc,
						"Measure_Units" : obj.Measure_Units,
						"Measure_Units_Other" : obj.Measure_Units_Other,
						"Success_Effect_Size": obj.Success_Effect_Size, 
						"Pass_Probability": obj.Pass_Probability,
						"Fail_Probability": obj.Fail_Probability, 
						"Action_Success": obj.Action_Success,
						"Action_Fail": obj.Action_Fail,
						"Action_Inconclusive": obj.Action_Inconclusive

				};
				if (!eval.planNext) {
				    eval.planNext.created_at = dt;
				}
                else {
				    eval.planNext.updated_at = dt;
				};
                eval.planNext = planNext;
                if (eval.stepsclicked.indexOf(3) < 0) eval.stepsclicked.push(3);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status === "started") {
                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/' + returnpath);
                    }
                    else {
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
	});
	//03.03 Work with providers
	app.get('/working_with_provider', isLoggedIn, function (req, res) {
		console.log("start work with providers");
		sess = req.session;
		sess.eval.last_step = 3;
		sess.eval.last_tool = "Working with Ed Tech Providers";
		var query = require('url').parse(req.url, true).query;
		res.render('working_with_provider.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
	});
	
	app.post('/working_with_provider', isLoggedIn, function (req, res) {
		var toollist = { "name": "Working with Ed Tech Providers", "status": 'completed', "visited_at": new Date() };
		sess = req.session;
		sess.step = 3;
		console.log("In saving working with providers");
		
		var dt = new Date();
		async.waterfall([
			function (done) {
				if (sess.eval) {
					console.log("Yes eval in saving working with providers");
					Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
						if (!eval) {
							req.flash('error', 'No evaluation exists.');
							return res.redirect('/coach');
						}
						if (err) {
							console.log(err);
							return res.redirect('/coach');
						}
						return done(err, eval);
					});
				}
				else
					res.redirect('/coach');
			},
			function (eval, done) {
				console.log("Eval found in saving working with providers");
				eval.last_step = 3;
				eval.last_tool = "Working with Ed Tech Providers";
				//eval find so update the toolsVisisted accordingly
				updateLastTool(eval, toollist);
				eval.save(function (err) {
					if (err) {
						console.log(err); return done(err);
					}
					sess.eval = eval;
					
						return res.redirect('/coach');
					
				});
						
					
			}
		], function (err) {
			if (err) return next(err);
			res.redirect('/coach');
		});
	});

    //03.03 context and usage
    app.get('/context_and_usage', isLoggedIn, function (req, res) {
		sess = req.session;
        sess.eval.last_step = 3;
        sess.eval.last_tool = "Summarize Context";
        var query = require('url').parse(req.url, true).query;
        res.render('context_and_usage.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
    app.post('/context_and_usage', isLoggedIn,  function (req, res) {
        var toollist = { "name": "Summarize Context", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 3;
		var obj = req.body;
		var returnpath = obj.returnpath;
		if (returnpath === '') returnpath = "context_and_usage";
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },
            function (eval, done) {
				eval.last_step = 3;
                eval.last_tool = "Summarize Context";
                updateLastTool(eval, toollist);
				
				
				//add/update the planQuestion within eval
                var grades = [], outcomes = [];
     
                if (obj.Grade_PK) grades.push(obj.Grade_PK);
                if (obj.Grade_K) grades.push(obj.Grade_K);
                if (obj.Grade_1) grades.push(obj.Grade_1);
                if (obj.Grade_2) grades.push(obj.Grade_2);
                if (obj.Grade_3) grades.push(obj.Grade_3);
                if (obj.Grade_4) grades.push(obj.Grade_4);
                if (obj.Grade_5) grades.push(obj.Grade_5);
                if (obj.Grade_6) grades.push(obj.Grade_6);
                if (obj.Grade_7) grades.push(obj.Grade_7);
                if (obj.Grade_8) grades.push(obj.Grade_8);
                if (obj.Grade_9) grades.push(obj.Grade_9);
                if (obj.Grade_10) grades.push(obj.Grade_10);
                if (obj.Grade_11) grades.push(obj.Grade_11);
                if (obj.Grade_12) grades.push(obj.Grade_12);
                if (obj.Grade_PS) grades.push(obj.Grade_PS);

                if (obj.Outcome_Literacy) outcomes.push(obj.Outcome_Literacy);
                if (obj.Outcome_Mathematics) outcomes.push(obj.Outcome_Mathematics);
                if (obj.Outcome_Science) outcomes.push(obj.Outcome_Science);
                if (obj.Outcome_Behavior) outcomes.push(obj.Outcome_Behavior);
                if (obj.Outcome_Teacher_Excellence) outcomes.push(obj.Outcome_Teacher_Excellence);
                if (obj.Outcome_Graduation) outcomes.push(obj.Outcome_Graduation);
					var planContext = {
						Eval_Begin_Date: obj.Eval_Begin_Date,
						Eval_End_Date: obj.Eval_End_Date,
						Type_Curriculum: obj.Type_Curriculum,
						Type_Practice: obj.Type_Practice,
						Type_School_Structure: obj.Type_School_Structure,
						Type_School_Level: obj.Type_School_Level,
						Type_Teacher_Level: obj.Type_Teacher_Level,
						Type_Policy: obj.Type_Policy,
						Tech_Purpose: obj.Tech_Purpose,
						Tech_Components: obj.Tech_Components,
						Delivered_Individually: obj.Delivered_Individually,
						Delivered_Small_Group: obj.Delivered_Small_Group,
						Delivered_Whole_Class: obj.Delivered_Whole_Class,
						Delivered_School_Wide: obj.Delivered_School_Wide,
						Grades: grades,
						Expected_Dosage: obj.Expected_Dosage,
						Developer_Guidelines:obj.Developer_Guidelines,
						ClassroomType_General: obj.ClassroomType_General,
						ClassroomType_Inclusion: obj.ClassroomType_Inclusion,
						Outcomes: outcomes,
						SchoolType_Charter: obj.SchoolType_Charter,
						SchoolType_Private: obj.SchoolType_Private, 
						SchoolType_Parochial: obj.SchoolType_Parochial, 
						SchoolType_Public: obj.SchoolType_Public,
						Total_Students: obj.Total_Students,
						Urbanicity_Rural: obj.Urbanicity_Rural,
						Urbanicity_Suburban: obj.Urbanicity_Suburban,
					Urbanicity_Urban: obj.Urbanicity_Urban,
						District_State: obj.District_State,
						Race_Asian: obj.Race_Asian,
						Race_Black: obj.Race_Black,
						Race_Native_American: obj.Race_Native_American,
						Race_Pacific_Islander: obj.Race_Pacific_Islander,
						Race_White: obj.Race_White,
						Race_Other: obj.Race_Other,
						Ethnicity_Hispanic: obj.Ethnicity_Hispanic,
						Ethnicity_Not_Hispanic: obj.Ethnicity_Not_Hispanic,
						Gender_Female: obj.Gender_Female,
						Gender_Male: obj.Gender_Male,
						FRPL_Free: obj.FRPL_Free,
						FRPL_Reduced: obj.FRPL_Reduced,
						English_Learners: obj.English_Learners,
						IEP: obj.IEP,
						Other_Notes: obj.Other_Notes, 
						

                };
                    console.log(planContext);
				if (!eval.planContext) {
				    planContext.created_at = dt;
				}
                else {
					planContext.created_at = eval.planContext.created_at;
				    planContext.updated_at = dt;
				};
                
                eval.planContext = planContext;
                if (eval.stepsclicked.indexOf(3) < 0) eval.stepsclicked.push(3);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {

                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/' + returnpath);
                    }
                    else {
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
	});
	
	//02. Prepare data	   
	app.get('/prepare_data_random', function (req, res) {
		//	console.log("In DYA get method.");
		sess = req.session;
		sess.eval.last_step = 4;
		sess.eval.last_tool = "Prepare for Random Assignment";
		var query = require('url').parse(req.url, true).query;
		res.render('prepare_data_random.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
	});
	app.post('/prepare_data_random', function (req, res) {
		var toollist = { "name": "Prepare for Random Assignment", "status": req.body.status, "visited_at": new Date() };
		sess.eval.step = 4;
		var obj = req.body;
		console.log("post prepare_data_radom");

		console.log(toollist);
		var returnpath = obj.returnpath;
		if (returnpath === '') returnpath = "prepare_data_random";
		var dt = new Date();
		async.waterfall([
			function (done) {
				if (sess.eval) {
					Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
						if (!eval) {
							req.flash('error', 'No evaluation exists.');
							return res.redirect('/coach');
						}
						if (err) {
							console.log(err);
							return res.redirect('/coach');
						}
						return done(err, eval);
					});
				}
				else
					res.redirect('/coach');
			},
			function (eval, done) {
				eval.last_step = 4;
				eval.last_tool = "Prepare Your Data for Analysis";
				//eval find so update the toolsVisisted accordingly
				updateLastTool(eval, toollist);
				
				
				eval.basics.Basics_Users = obj.Basics_Users;
				eval.basics.Basics_Users_Others = obj.Basics_Users_Others;

			    var prepareRandom = obj.PrepareRandom;
					
				if (!eval.prepareRandom) {
					eval.prepareRandom.created_at = dt;
				}

				else {
					eval.prepareRandom.updated_at = dt;
				};
				
				eval.prepareRandom = prepareRandom;
				console.log(returnpath);
				console.log(eval);
				eval.save(function (err) {
					if (err) {
						console.log(err); return done(err);
					}
					sess.eval = eval;
					
					if (req.body.status === "started") {
						
						req.flash('saveMessage', 'Changes Saved.');
					   
						return res.redirect('/' + returnpath);
					}
					else {
						return res.redirect('/coach');
					}
				});
			}
		], function (err) {
			if (err) return next(err);
			res.redirect('/coach');
		});
	});
	
	//02. Prepare data	   
	app.get('/prepare_data', function (req, res) {
		//	console.log("In DYA get method.");
		sess = req.session;
		sess.eval.last_step = 4;
		sess.eval.last_tool = "Prepare Your Data for Analysis";
		var query = require('url').parse(req.url, true).query;
		res.render('prepare_data.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
	});
	app.post('/prepare_data', function (req, res) {
		var toollist = { "name": "Prepare Your Data for Analysis", "status": req.body.status, "visited_at": new Date() };
		sess = req.session;
		sess.eval.step = 4;
		var obj = req.body;
		var returnpath = obj.returnpath;
		if (returnpath === '') returnpath = "prepare_data";
		var dt = new Date();
		async.waterfall([
			function (done) {
				if (sess.eval) {
					Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
						if (!eval) {
							req.flash('error', 'No evaluation exists.');
							return res.redirect('/coach');
						}
						if (err) {
							console.log(err);
							return res.redirect('/coach');
						}
						return done(err, eval);
					});
				}
				else
					res.redirect('/coach');
			},
			function (eval, done) {
				eval.last_step = 4;
				eval.last_tool = "Prepare Your Data for Analysis";
				//eval find so update the toolsVisisted accordingly
				updateLastTool(eval, toollist);
				

			    if (obj.Basics_Users != null) {
			        eval.basics.Basics_Users = obj.Basics_Users;
			    }

			    var prepare = obj.Prepare;
				
				if (!eval.prepare) {
					eval.prepare.created_at = dt;
				}

				else {
					eval.prepare.updated_at = dt;
				};
				
				eval.prepare = prepare;
				if (eval.stepsclicked.indexOf(5) < 0) eval.stepsclicked.push(5);
				//console.log(eval);
				eval.save(function (err) {
					if (err) {
						console.log(err); return done(err);
					}
					sess.eval = eval;
					
					if (req.body.status === "started") {
						
						req.flash('saveMessage', 'Changes Saved.');
						return res.redirect('/'+returnpath);
					}
					else {
						return res.redirect('/coach');
					}
				});
			}
		], function (err) {
			if (err) return next(err);
			res.redirect('/coach');
		});
	});

	//02. Evaluation Plan   
	app.get('/evaluation_plan', function (req, res) {
		sess = req.session;

		sess.eval.last_step = 3;
		sess.eval.last_tool = "Evaluation Plan";
		sess.eval.evalPlan.Milestones.sort(dynamicSort("Order"));
		
		var query = require('url').parse(req.url, true).query;
		res.render('evaluation_plan.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
	});
	
	
	
	app.post('/evaluation_plan', function (req, res) {
		var toollist = { "name": "Evaluation Plan", "status": req.body.status, "visited_at": new Date() };
		
		sess = req.session;
		var obj = req.body;
		var returnpath = obj.returnpath;
		if (returnpath === '') returnpath = "evaluation_plan";
	
	//    console.log(obj.EvalPlan.Milestones);
		var dt = new Date();
		async.waterfall([
			function (done) {
				if (sess.eval) {
					Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
						if (!eval) {
							req.flash('error', 'No evaluation exists.');
							return res.redirect('/coach');
						}
						if (err) {
							console.log(err);
							return res.redirect('/coach');
						}
						return done(err, eval);
					});
				}
				else
					res.redirect('/coach');
			},
			function (eval, done) {
				eval.last_step = 3;
				eval.last_tool = toollist.name;
				//eval find so update the toolsVisited accordingly
			    updateLastTool(eval, toollist);

				eval.planContext.Tech_Purpose = obj.Tech_Purpose;
				eval.planContext.Tech_Components = obj.Tech_Components;
				eval.planContext.Expected_Dosage = obj.Expected_Dosage;
			    eval.planNext.Action_Success = obj.Action_Success;
			    eval.planNext.Action_Fail = obj.Action_Fail;
			    eval.planNext.Action_Inconclusive = obj.Action_Inconclusive;
			    var evalPlan = obj.EvalPlan;

				if (!eval.evalPlan) {
					eval.evalPlan.created_at = dt;
					eval.evalPlan.updated_at = dt;
				}
				else {
					eval.evalPlan.updated_at = dt;
				};
				
				eval.evalPlan = evalPlan;


				eval.save(function (err) {
					if (err) {
						console.log(err); return done(err);
					}
					sess.eval = eval;					
					if (req.body.status === "started") {						
						req.flash('saveMessage', 'Changes Saved.');
						return res.redirect('/'+returnpath);
					}
					else {
						return res.redirect('/coach');
					}
				});
			}
		], function (err) {
			if (err) return next(err);
			res.redirect('/coach');
		});
	});

    app.get('/matching', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 4;
        sess.eval.last_tool = "Matching";
        var query = require('url').parse(req.url, true).query;
        res.render('matching.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query  });
    });
    app.post('/matching', function (req, res) {
        var toollist = { "name": "Matching", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;    
		var obj = req.body;
		var returnpath = obj.returnpath;
		if (returnpath === '') returnpath = "matching";
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },
            function (eval, done) {
                eval.last_step = 4;
                eval.last_tool = "Matching";
                //eval find so update the toolsVisisted accordingly
				updateLastTool(eval, toollist);

				//eval.planQuestion.Intervention_Group_Desc = obj.Intervention_Group_Desc;
				//eval.planQuestion.Comparison_Group_Desc = obj.Comparison_Group_Desc;
				eval.planContext.Tech_Purpose = obj.Tech_Purpose; eval.planContext.Tech_Components = obj.Tech_Components;		
                 var matching = {      
                        "Target_Group_Desc": obj.Target_Group_Desc,
                        "treat_var": obj.s_treat_var,
                        "match_vars": obj.s_match_vars,
                        "grade_var": obj.s_grade_var,
                        "n_full": obj.n_full,
                        "n_full_treat": obj.n_full_treat,
                        "n_matched": obj.n_matched,
                        "n_matched_treat": obj.n_matched_treat,
                        "Result":obj.result

				};
				if (!eval.matching) {
				    eval.matching.created_at = dt;
				}

				else {
				    eval.matching.updated_at = dt;
				};

                eval.matching = matching;
                if (eval.stepsclicked.indexOf(5) < 0) eval.stepsclicked.push(5);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
					sess.eval = eval;

                    if (req.body.status == "started") {

                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/' + returnpath);
                    }
                    else {
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
	});
	app.get('/randomization', isLoggedIn, function (req, res) {
		sess = req.session;
		sess.eval.last_step = 4;
        sess.eval.last_tool = "Randomization";
        var query = require('url').parse(req.url, true).query;
        res.render('randomization.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
 

	app.post('/randomization', function (req, res) {
        var toollist = { "name": "Random Assignment", "status": req.body.status, "visited_at": new Date() };
		sess = req.session;
		sess.eval.step = 4;
		var obj = req.body;
		var returnpath = obj.returnpath;
        if (returnpath === '') returnpath = "Random Assignment";
		console.log(obj);
		var dt = new Date();
		async.waterfall([
			function (done) {
				if (sess.eval) {
					Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
						if (!eval) {
							req.flash('error', 'No evaluation exists.');
							return res.redirect('/coach');
						}
						if (err) {
							console.log(err);
							return res.redirect('/coach');
						}
						return done(err, eval);
					});
				}
				else
					res.redirect('/coach');
			},
			function (eval, done) {
				eval.last_step = 4;
                eval.last_tool = "Random Assignment";
				//eval find so update the toolsVisisted accordingly
				updateLastTool(eval, toollist);

				eval.planQuestion.Intervention_Group_Desc = obj.Intervention_Group_Desc;
				eval.planQuestion.Comparison_Group_Desc = obj.Comparison_Group_Desc;

			    eval.prepareRandom.Individual_Group = obj.Individual_Group;
			    eval.prepareRandom.Cluster_Group = obj.Cluster_Group;
			    eval.prepareRandom.Cluster_Group_Other = obj.Cluster_Group_Other;
				var random = {
					"User_Limit_Exist": obj.User_Limit_Exist,
					"intervention_quantity": obj.intervention_quantity,
					"intervention_type": obj.intervention_type,
					"s_unit_id": obj.s_unit_id,
					"s_pretest": obj.s_pretest,
					"s_block_id": obj.s_block_id,
					"n_matched": obj.n_matched,
					"s_baseline_vars": obj.s_baseline_vars,
					"Result": obj.result

				};
				if (!eval.random) {
					eval.random.created_at = dt;
				}

				else {
					eval.random.updated_at = dt;
				};
				
				eval.random = random;
			
				eval.save(function (err) {
					if (err) {
						console.log(err); return done(err);
					}
					sess.eval = eval;
					
					if (req.body.status == "started") {
						
						req.flash('saveMessage', 'Changes Saved.');
						return res.redirect('/' + returnpath);
					}
					else {
						return res.redirect('/coach');
					}
				});
			}
		], function (err) {
			if (err) return next(err);
			res.redirect('/coach');
		});
	});

    app.get('/getresult', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 5;
        sess.eval.last_tool = "Get Results";
        var query = require('url').parse(req.url, true).query;
        res.render('getresult.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
    app.post('/getresult', isLoggedIn, function (req, res) {
        var toollist = { "name": "Get Results", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.step = 5;
		var obj = req.body;
		var returnpath = obj.returnpath;
		if (returnpath === '') returnpath = "getresult";
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },
            function (eval, done) {
                eval.last_step = 5;
                eval.last_tool = "Get Results";
                //eval find so update the toolsVisisted accordingly
				updateLastTool(eval, toollist);

				eval.planQuestion.Outcome_Measure = obj.Outcome_Measure;
				eval.planQuestion.Outcome_Direction = obj.Outcome_Direction;
				eval.planNext.Success_Effect_Size= obj.Success_Effect_Size;
				eval.planNext.Pass_Probability= obj.Pass_Probability;
				
					var getresult = {				
                        "Result": obj.result
                       

				};
				if (!eval.getresult) {
				    eval.getresult.created_at = dt;
				}
                else {
					eval.getresult.updated_at = dt;
                   };

                eval.getresult = getresult;
                if (eval.stepsclicked.indexOf(5) < 0) eval.stepsclicked.push(5);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status === "started") {

                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/' + returnpath);
                    }
                    else {
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
    });
    app.get('/shareresult', isLoggedIn, function (req, res) {
        sess = req.session;
        sess.eval.last_step = 6;
        sess.eval.last_tool = "Share Your Results";
        var query = require('url').parse(req.url, true).query;
        res.render('shareresult.html', { user: req.user, eval: sess.eval, message: req.flash('saveMessage'), query: query });
    });
    app.get('/shareresult/:id', isLoggedIn, function (req, res) {
        sess = req.session;
        var query = require('url').parse(req.url, true).query;
        console.log(query);
        Evaluation.findOne({ _id: req.params.id }, function (err, eval) {
            sess.publishlists  = eval;
            res.render('shareresult.html', { user: req.user, eval: sess.publishlists, message: req.flash('saveMessage'), query: query });
        });
    });
    app.post('/shareresult', isLoggedIn,function (req, res) {
        var toollist = { "name": "Share Your Results", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.eval.last_step = 6;
		var obj = req.body;
		var returnpath = obj.returnpath;
		if (returnpath === '') returnpath = "shareresult";
        var dt = new Date();
        async.waterfall([
            function (done) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        return done(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },
            function (eval, done) {
                eval.last_step = 6;
                eval.last_tool = "Share Your Results";
                //eval find so update the toolsVisisted accordingly
				updateLastTool(eval, toollist);

                // Turn relabel inputs into an array rather than 
                var relabel_index = 0;
                var relabels = [];

                while (obj['relabel-baseline-var-' + relabel_index]) {
                    relabels.push(obj['relabel-baseline-var-' + relabel_index]);
                    delete obj['relabel-baseline-var-' + relabel_index] 
                    relabel_index++;
                }

                var shareresult = obj;
                shareresult.baseline_var_relabels = relabels;

                if (!eval.shareresult) {
                    shareresult.created_at = dt;
                }
                else {
                    shareresult.updated_at = dt;
                };

                eval.shareresult = shareresult;

               
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {
                        req.flash('saveMessage', 'Changes Saved.');
                        return res.redirect('/' + returnpath);
                    }
                    else {
                        return res.redirect('/coach');
                    }
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
    });

    app.post('/download', isLoggedIn, function (req, res) {
        var toollist = { "name": "Share Your Results", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.eval.last_step = 6;
        var obj = req.body;
        var dt = new Date();

        var download_type = obj.download_type;

        async.waterfall([
            function (callback) {

                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        callback(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },
            function (eval, callback) {
                eval.last_step = 6;
                eval.last_tool = "Share Your Results";
                //eval find so update the toolsVisisted accordingly
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Share Your Results" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
                        if (tool[0].status === "completed") toollist = { "name": "Share Your Results", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                if (eval.stepsclicked.indexOf(6) < 0) eval.stepsclicked.push(6);

                // Turn relabel inputs into an array rather than 
                var relabel_index = 0;
                var relabels = [];

                while (obj['relabel-baseline-var-' + relabel_index]) {
                    relabels.push(obj['relabel-baseline-var-' + relabel_index]);
                    delete obj['relabel-baseline-var-' + relabel_index]
                    relabel_index++;
                }

                var shareresult = obj;
                shareresult.baseline_var_relabels = relabels;

                if (!eval.shareresult) {
                    shareresult.created_at = dt;
                }
                else {
                    shareresult.updated_at = dt;
                };

                eval.shareresult = shareresult;

                if (eval.stepsclicked.indexOf(6) < 0) eval.stepsclicked.push(6);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {
                        req.flash('saveMessage', 'Changes Saved.');
                    }
                    else {
                    }
                });

                callback(null, eval);
            },
            function (eval, callback) {

                // Need to generate document file here
                var query = require('url').parse(req.url, true).query;

                console.log('rendering ', 'download_' + download_type + '.html');

                /*res.render('download_' + download_type + '.html', { user: req.user, eval: sess.eval, message: req.flash('saveMessage'), query: query },
                    function (err, html) {
                        console.log(err);
                        res.setHeader('Content-disposition', 'attachment; filename=brief.html');
                        res.setHeader('Content-type', 'text/html');

                        res.write(html);
                        res.send();
                    });*/

                //console.log('generate document');
                //var filename = 'node-google.pdf';

                // Now download the document
                /*
                console.log('download document');
                res.setHeader('Content-disposition', 'attachment; filename=brief.pdf');
                res.setHeader('Content-type', 'application/pdf');
                var filestream = fs.createReadStream('node-google.pdf');

                filestream.pipe(res);*/
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });
    });

    app.get('/shareresult/:id', isLoggedIn, function (req, res) {
        sess = req.session;
        Evaluation.findOne({ _id: req.params.id }, function (err, eval) {
            sess.eval = eval;        
            var query = require('url').parse(req.url, true).query;
            res.render('shareresult.html', { user: req.user.local.email, eval: sess.eval, message: req.flash('saveMessage'), query: query });
        });
    });

    app.get('/brief_appendix_matching', isLoggedIn, function (req, res) {
        var toollist = { "name": "Share Your Results", "status": req.body.status, "visited_at": new Date() };
        sess = req.session;
        sess.eval.last_step = 6;
        var obj = req.body;

        var dt = new Date();
        async.waterfall([
            function (callback) {
                if (sess.eval) {
                    Evaluation.findOne({ _id: sess.eval._id }).exec(function (err, eval) {
                        if (!eval) {
                            req.flash('error', 'No evaluation exists.');
                            return res.redirect('/coach');
                        }
                        if (err) {
                            console.log(err);
                            return res.redirect('/coach');
                        }
                        callback(err, eval);
                    });
                }
                else
                    res.redirect('/coach');
            },
            function (eval, callback) {
                eval.last_step = 6;
                eval.last_tool = "Share Your Results";
                //eval find so update the toolsVisisted accordingly
                var tool = eval.toolsvisited.filter(function (x) { return x.name === "Share Your Results" });
                if (tool.length == 0) {
                    eval.toolsvisited.push(toollist);
                }
                else {
                    var index = eval.toolsvisited.indexOf(tool[0]);
                    if (index > -1) {
                        if (tool[0].status === "completed") toollist = { "name": "Share Your Results", "status": "completed", "visited_at": new Date() };
                        eval.toolsvisited.splice(index, 1);
                        eval.toolsvisited.push(toollist);
                    }
                }
                if (eval.stepsclicked.indexOf(6) < 0) eval.stepsclicked.push(6);

                // Turn relabel inputs into an array rather than 
                var relabel_index = 0;
                var relabels = [];

                while (obj['relabel-baseline-var-' + relabel_index]) {
                    relabels.push(obj['relabel-baseline-var-' + relabel_index]);
                    delete obj['relabel-baseline-var-' + relabel_index]
                    relabel_index++;
                }

                var shareresult = obj;
                shareresult.baseline_var_relabels = relabels;

                if (!eval.shareresult) {
                    shareresult.created_at = dt;
                }
                else {
                    shareresult.updated_at = dt;
                };

                eval.shareresult = shareresult;

                if (eval.stepsclicked.indexOf(6) < 0) eval.stepsclicked.push(6);
                eval.save(function (err) {
                    if (err) {
                        console.log(err); return done(err);
                    }
                    sess.eval = eval;
                    if (req.body.status == "started") {
                        req.flash('saveMessage', 'Changes Saved.');
                    }
                    else {
                    }
                });

                callback(null, eval);
            },
            function (eval, callback) {
                console.log('download 5');

                // Need to generate document file here
                var query = require('url').parse(req.url, true).query;
                res.render('brief_appendix_matching.html', { user: req.user, eval: sess.eval, message: req.flash('saveMessage'), query: query },
                    function (err, html) {
                        console.log(err);
                        res.setHeader('Content-disposition', 'attachment; filename=brief.html');
                        res.setHeader('Content-type', 'text/html');

                        res.write(html);
                        res.send();
                    });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/coach');
        });

    });
};

