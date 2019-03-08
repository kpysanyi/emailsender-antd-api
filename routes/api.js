var express = require('express');
var router = express.Router();
var sgMail = require('@sendgrid/mail');
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/sendEmail', async function(req, res, next) {
  let users = req.body.receipts;
  let message = req.body.message;

  let tasks = users.map(user => {
    const msg = {
      personalizations: [{
        to: {
          email: user.email
        },
        dynamic_template_data: {
          username: user.username,
          message
        }
      }],
      from: {
        email: "admin@lensengage.com"
      },
      template_id: 'd-69aa76efeae5431b9d84b8569c34075c'
    };
    return sgMail.send(msg);
  });
  try {
    let results = await Promise.all(tasks);
    res.send({ message: 'success', data: results });
  } catch ( error ) {
    res.send({ message: 'failure', error });
  }
});

module.exports = router;
