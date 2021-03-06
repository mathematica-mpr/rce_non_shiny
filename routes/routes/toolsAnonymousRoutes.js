﻿
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

//routes/toolAnonymousRoutes.js
// load up the thing we need
var Evaluation = require('../models/evaluation.js');

//please note that req.session.step is for managing the active tab for coach.html
//the following defines the tool routes available, only four routes available currently
module.exports = function (app) {


    //02.03 determine your approach
	app.get('/unknown/determine_your_approach', function (req, res) {
		var eval = new Evaluation({ userid: "NOAUTHENTICATED", title: '', status: '0' });
        res.render('determine_your_approach.html', { user: "NOAUTHENTICATED", eval: eval });
    });
  
    //03.01 crafting a research question
	app.get('/unknown/craft_your_research_q', function (req, res) {
		var eval = new Evaluation({ userid: "NOAUTHENTICATED", title: '', status: '0' });
            
        res.render('craft_your_research_q.html', { user: "NOAUTHENTICATED" });
    });
    
   
    //03.02 plan next steps
    app.get('/unknown/plan_next_steps', function (req, res) {
      
		var eval = new Evaluation({ userid: "NOAUTHENTICATED", title: '', status: '0' });
        res.render('plan_next_steps.html', { user: "NOAUTHENTICATED" });
    });
   
    //03.03 context and usage
    app.get('/unknown/context_and_usage', function (req, res) {
       
		var eval = new Evaluation({ userid: "NOAUTHENTICATED", title: '', status: '0' });
        res.render('context_and_usage.html', { user: "NOAUTHENTICATED" });
    });

    app.get('/unknown/matching',  function (req, res) {
        
		var eval = new Evaluation({ userid: "NOAUTHENTICATED", title: '', status: '0' });
         res.render('matching.html', { user: "NOAUTHENTICATED" });
    });
    
    app.get('/unknown/getresult', function (req, res) {
       
		var eval = new Evaluation({ userid: "NOAUTHENTICATED", title: '', status: '0' });
        res.render('getresult.html', { user: "NOAUTHENTICATED" });
    });
    
    app.get('/unknown/shareresult', function (req, res) {
        
		var eval = new Evaluation({ userid: "NOAUTHENTICATED", title: '', status: '0' });
        res.render('shareresult.html', { user: "NOAUTHENTICATED" });
    });
    
};

