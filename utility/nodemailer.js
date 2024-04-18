
const nodemailer = require("nodemailer");
module.exports.sendMail=async function sendMail(str,data){
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "rishirajjnvr448@gmail.com",
    pass: "rzmnbrrxrcacggcm",
  },
});
var Osubject,Otext,Ohtml;
if(str==="signup"){
    Osubject=`Thanks for signing in ${data.name}`
    Ohtml=`
    <h1>welcome to the food app.com</h1>
    hope you are having a good time 
    Here are your details
    Name: ${data.name} <br>
    Email:${data.email}`
}
else
// if(str=="resetpassword")
{
    Osubject='resetpassword'
    Ohtml=`<h1>FoodApp.com </h1>
    Here is the link for resetting your password
    ${data.resetpasswordlink}`
}


// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Food Fiesta👻" <rishirajjnvr448@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: Osubject, // Subject line
    text: Otext, // plain text body
    html: Ohtml, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

main().catch(console.error);
}