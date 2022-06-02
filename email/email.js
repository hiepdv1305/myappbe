'use strict';
const { response } = require("../init/res");
const config = require("../Config/config")
const nodemailer = require('nodemailer');
module.exports.handler = async (event, context, callback) => {
    const data = JSON.parse(event.body);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dongvanhiep92@gmail.com',
          pass: 'tkhwqqlkblaebsfw'
        }
      });
      
      var mailOptions = {
        from: 'dongvanhiep92@gmail.com',
        to: 'quyetnh@let.vn',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
};