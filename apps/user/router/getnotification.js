const { response } = require("../../../init/res");
const config = require("../../../Config/config");
const jwtHelper = require("../../../init/jwt");
const aws = require("aws-sdk");
const s3 = new aws.S3();
var md5 = require("md5");
module.exports.handler = async (event, context, callback) => {
  let user = context.prev;
  console.log(user)
  let key = 'notification' + user.userId;
  key = md5(key);
  let params = {
    Bucket: `apptmdt`,
    Key: `notification/${key.slice(0, 2)}/${key.slice(
      2,
      4
    )}/${key.slice(4, 6)}/${key.slice(6)}.json`,
  };
  return s3.getObject(params).promise().then(res=>{
    console.log(res.Body.toString("utf-8"));
    return response(res.Body.toString("utf-8"), "success", 200);
  });
  
};
