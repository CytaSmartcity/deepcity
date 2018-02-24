const twillio_account_sid = process.env.TWILIO_ACCOUNT_SID,
twillio_auth_token = process.env.TWILIO_AUTH_TOKEN,
twillio_phone_number = process.env.TWILIO_PHONE_NUMBER;

var client = require('twilio')(twillio_account_sid, twillio_auth_token);

module.exports = {

send : (user_phone_number, body, cb) => {
  client.messages.create({
      from: twillio_phone_number,
      to: user_phone_number,
      body: body
  }, (err, message) => {
      if(err)
          cb(err, null)
      else
          cb(null, true);
  });
}
};