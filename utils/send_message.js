const { generateOtp } = require("./generateOtp");
const sendOtp = (to) => {
  const otp = generateOtp;
  const message = `Your verification Otp is ${otp}`;
  client.messages
    .create({
      body: message,
      from: process.env.PhoneNumber,
      to: to,
    })
    .then((message) => {
      console.log(`Otp send ${message.sid}`);
    })
    .catch((error) => console.error(error.message));
};
module.exports = { sendOtp };
