﻿
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

// routes/resetPasswordRoutes.js
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var configDB = require('../config/database.js');
User = require('../models/user');
module.exports = function (app) {
    // =====================================
    // FORGOT PASSWORD =====================
    // =====================================
    // for forgot password
    app.get('/forgot', function (req, res) {
        res.render('forgot.html', {
            user: req.user, info: req.flash('info'), error:req.flash('error')
        });
    });
    app.post('/forgot', function (req, res, next) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({ 'local.email': req.body.email }, function (err, user) {
                    if (!user) {
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/forgot');
                    }
                    
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {
              
                var transport = nodemailer.createTransport( {

                    port: 25, 
                    host: configDB.emailHost
                 
                });

                var mailOptions = {
                    to: user.local.email,
                    from: 'intrelay.mathematica-mpr.com',
                    subject: 'RCE USER Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
              //  console.log("hi");
                try {
                    transport.sendMail(mailOptions, function (err) {
                        req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
                        done(err, 'done');
                    });
                } catch (err) {
                    console.log(err);
                }
                 
                
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/forgot');
        });
    });

    //for reset
    app.get('/reset/:token', function (req, res) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset.html', {
                user: req.user
            });
        });
    });
    app.post('/reset/:token', function (req, res) {
        async.waterfall([
            function (done) {
                User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }
                    //console.log(req.body.password);
                    //console.log(user);
                    user.local.password = user.generateHash(req.body.password);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save(function (err) {
                        done(err, user);
                    });
                });
            },
            function (user, done) {
                var transport = nodemailer.createTransport({

                    port: 25, 
                    host: configDB.emailHost
                 
                });

                var mailOptions = {
                    to: user.local.email,
                    from: 'intrelay.mathematica-mpr.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
                };
                transport.sendMail(mailOptions, function (err) {
                    req.flash('success', 'Success! Your password has been changed.');
                    done(err);
                });
            }
        ], function (err) {
            console.log(err);
            res.redirect('/');
        });
    });

};