const { Validator } = require('node-input-validator');

var SignInValidator = function (req, res, next) {
  const v = new Validator(req.body, {
    email: 'required|email',
    password: 'required'
  });

  v.check().then((matched) => {
    if (!matched) {
      res.status(422).send(v.errors);
    }
  });
  next();
}

var SignUpValidator = function (req, res, next) {
  const validation = new Validator(req.body, {
    email: 'required|email',
    password: 'required',
    firstName: 'required|string',
    lastName: 'required|string',
    phoneNumber: 'required|string|min:10|max:10'
  });

  validation.check().then((matched) => {
    if (!matched) {
      res.status(422).send(v.errors);
    }
  });
  next();
}

module.exports = {
  SignInValidator,
  SignUpValidator
}