﻿// routes/wizardRoutes.js
// load up things we need
var isLoggedIn = require('../middleware/isLoggedIn.js');
var getCurrentEvaluation = require('../middleware/getCurrentEvaluation.js');

var WizardStep = require('../models/wizardStep'),
    Tool = require('../models/tool.js');
var Evaluation = require('../models/evaluation');   // the evaluation should go away to middleware
var sess;
module.exports = function (app, passport) {

    //dashboard, require logged in and get current evaluation
   // app.use(getCurrentEvaluation);
    app.get('/dashboard', isLoggedIn, getCurrentEvaluation,  function (req, res) {
        sess = req.session;
        res.render('dashboard.html', { user: req.user, eval: sess.eval });
    });


    app.get('/wizard', isLoggedIn, function (req, res) {
        sess = req.session;
        if (!sess.step) { sess.step = 1 }
        WizardStep.find(function (err, wizardSteps) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.render('wizard.html', { wizardSteps: wizardSteps, eval: sess.eval, step: sess.step });
            }
        });

    });

    // this is for returning the partial view tool.html on the wizard.html
    app.get('/tools/:wizardPath', function (req, res) {
        //console.log(req.params.wizardPath);
        var wizardStep;
        WizardStep.findOne({ step: req.params.wizardPath }, function (err, wizard) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                console.log(wizardStep);
                wizardStep = wizard;
                Tool.find({ wizardPath: req.params.wizardPath }, function (err, tools) {
                    if (err) {

                        res.status(500).send(err);
                    }
                    else {
                        //console.log(tools);
                        res.render('partials/tool.html', { wizardStep: wizardStep, tools: tools });
                    }
                });
            }
        });
    });

    //this route is update evaluation object, it is called from dashboard.html and wizard.html
    app.post('/api/eval', isLoggedIn, function (req, res) {
        sess = req.session;
        // console.log(req.body.id);
        if (req.body.id == "") {
            var eval = new Evaluation({ userid: req.user._id, title: req.body.title });
            sess.eval = eval;
            eval.save(function (err) {
                if (err)
                    console.log(err);
                else {

                    res.status(201).send(eval);
                }
            });
        }
        else {
            Evaluation.findById(req.body.id, function (err, eval) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (!eval) {
                        eval = new Evaluation({ _id: req.body.id, userid: req.user._id });
                    }
                    eval.title = req.body.title;
                    sess.eval = eval;
                    eval.save(function (err) {
                        if (err)
                            console.log(err);
                        else {
                            sess.eval = eval;
                            res.status(201).send(eval);
                        }
                    });
                }

            });
        }

    });
    


   

   
};






