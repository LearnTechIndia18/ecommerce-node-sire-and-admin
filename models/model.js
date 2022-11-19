const express       = require('express');
const Router        = express.Router();
const DB            = require('../../models/db');
const HELPERFUNC    = require('../../models/commonfunctions');
var   mongoose        = require('mongoose');
const verifyToken   =require('./verifyToken');


Router.get('/listConfiguration',verifyToken,function(req,res) {
  const response = {
    status  : 0,
  }
  DB.GetDocument('configuration',{}, {}, {}, function(err, result) {
      if(err) {
          res.send(response);
      } else {
          response.status  = 1;
          response.data    = result;
          response.count   = result.length;
          res.send(response);
      }
  });
});

Router.post('/viewConfiguration',verifyToken,function(req,res) {
  const response = {
    status  : 0,
  }
  DB.GetOneDocument('configuration',{slug:req.body.slug}, {}, {}, function(err, result) {
      if(err) {
          res.send(response);
      } else {
        response.id       = result._id;
        response.name     = result.name;
        response.slug  = result.slug;
        response.description = result.description;
        response.status   = result.status;

        res.send(response);
      }
  });
});

Router.post('/addUpdateConfiguration',verifyToken,function(req,res) {
  const response = {
    status  : 0,
    message : 'Something went wrong in your code!'
  }
  req.checkBody('name', 'name is required.').notEmpty();
  req.checkBody('description', 'description is required.').notEmpty();
  req.checkBody('slug', 'slug is required.').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ errors: errors});
  }
  const name     = req.body.name;
  const slug  = req.body.slug;
  const description = req.body.description;
  const status   = req.body.status;
  const configurationFormData = {
    name        : HELPERFUNC.Capitalize(name),
    slug     : slug,
    description    : description,
    status      : HELPERFUNC.Capitalize(status),  }
  if(!req.body.id){
    DB.GetOneDocument('configuration', {name : name}, {}, {}, function(err, result) {
      if(result){
        response.status  = 0;
        response.message = 'Data you have entered is already exist!';
        res.send(response);
      } else {
        DB.InsertDocument('configuration', configurationFormData, function(err, result1) {
      console.log(err);
      if(err) {
            res.send(response);
          } else {
            response.status  = 1;
            response.message = 'configuration added successfully';
            response.id      = result1._id;
            res.send(response);
          }
        });
      }
    });
  } else {
    DB.FindUpdateDocument('configuration',{_id:req.body.id}, configurationFormData, function(err, result) {
      if(err) {
        res.send(response);
      } else {
        DB.GetOneDocument('configuration', {_id:req.body.id}, {}, {}, function(err, result1) {
            if(err) {
                res.send(response);
            } else {
                  const configurationData = {
                    id         : result1._id,
                    name       : result1.name,
                    slug       : result1.slug,
                    description: result1.description,
                    status     : result1.status, 
                  }
                  response.status  = 1;
                  response.message = 'configuration updated successfully';
                  response.data    = configurationData;
                res.send(response);
            }
        });
      }
    });
  }
})

Router.post('/deleteConfiguration',verifyToken,function(req,res) {
  const response = {
    status  : 0,
    message : 'Something went wrong in your code!'
  }
  
  DB.DeleteDocument('configuration', {_id:req.body.id}, function(err, result) {
      if(err) {
          res.send(response);
      } else {
        DB.GetDocument('configuration', {}, {}, {}, function(err, result) {
            if(err) {
                res.send(response);
            } else {
                  response.status  = 1;
                  response.message = 'configuration deleted successfully';
                  response.data    = result;
                  response.count   = result.length;
                  res.send(response);
            }
        });
      }
  });
  
})

Router.post('/deletesConfiguration',verifyToken,function(req,res) {
  const response = {
    status  : 0,
    message : 'Something went wrong in your code!'
  }
  
  DB.DeleteDocument('option', {conid:req.body.id}, function(err, result) {
      if(err) {
          res.send(response);
      } else {
        DB.GetDocument('option', {}, {}, {}, function(err, result) {
            if(err) {
                res.send(response);
            } else {
                  response.status  = 1;
                  response.message = 'option deleted successfully';
                  response.data    = result;
                  response.count   = result.length;
                  res.send(response);
            }
        });
      }
  });
  
})

module.exports = Router;