import express = require('express');
import jwt = require('express-jwt');
import jwksRsa = require('jwks-rsa');
import dotenv = require('dotenv');
import cors = require('cors');
import checkScope = require('express-jwt-authz');

dotenv.config();

const app: express.Application = express();

app.use(cors());

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.app_auth0_domain}/.well-known/jwks.json`
  }),
  audience: `http://${process.env.app_auth0_audience}`,
  issuer: `https://${process.env.app_auth0_domain}/`,
  algorithm: ['RS256']
});

app.get('/public', function(req, res) {
  res.json({
    message: 'Hello from a public API!'
  });
});

app.get('/private', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private API!'
  });
});

app.get('/courses', checkJwt, checkScope(['read:courses']), function(req, res) {
  res.json({
    courses: [
      { id: 1, title: 'angualr component communication' },
      { id: 2, title: 'Angualr routing' }
    ]
  });
});

app.listen(3000, function() {
  console.log('Listening');
});
