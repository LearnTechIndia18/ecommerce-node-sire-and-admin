const express       = require('express');
const Router        = express.Router();
const DB            = require('../../models/db');
const HELPERFUNC    = require('../../models/commonfunctions');
var mongoose        = require('mongoose');
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

Router.post('/createPassword',function(req,res) {
    var password = req.body.password;
    var encryptedPassword = bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
    res.send({password:encryptedPassword})
});

Router.post('/isLogin',function(req,res) {
    var response = {
        status: 0,
        message: "Something error occured"
    }
    var email = req.body.email;
    var password = req.body.password;

    DB.GetOneDocument('logins',{email:email}, {}, {}, function(err, result){
        if(err) {
            res.send(response);
        } else {
            if(result==null){
                response.message = "Invalid email"
                res.send(response)
            }
            else{
                var encryptedPassword = result.password;
                bcrypt.compare(password,encryptedPassword,function(err, result1){
                    if(result1){
                        var privateKey = "ecommsite";
                        var data = {
                            email:email,
                            password: password
                        }
                        var token = jwt.sign({
                            data
                          }, privateKey, { expiresIn: '1h' });
                          response.status = 1;
                          response.message = "Success";
                          response.token = token;
                          res.send(response)
                    }
                    else{
                        response.message = "Invalid password";
                        res.send(response)
                    }
                })
            }
        }
    });
});

module.exports = Router