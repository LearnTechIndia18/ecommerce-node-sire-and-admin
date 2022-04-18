var jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
  const response = {
    status: 0,
    message: "Something went wrong"
  }
  var webToken = req.headers['authorization'];
  if (webToken != undefined) {
    var token = webToken.split(' ');
  }
  if (!token) {
    response.message = "Token is required"
    res.send(response)
  }
  else {
    var privateKey = "ecommsite"
    jwt.verify(token[1], privateKey, function (err, result) {
      if (err) {
        res.send(err)
      } else {
        next();
      }
    });
  }
}
module.exports = verifyToken;