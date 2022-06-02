const { response } = require("../../../init/res");
const config = require("../../../Config/config");
const jwtHelper = require("../../../init/jwt");
const aws = require("aws-sdk");
const s3 = new aws.S3();
var md5 = require("md5");
module.exports.handler = async (event, context, callback) => {
  let user = context.env;
  let key = 'notification' + user.userId;
  key = md5(key);
  let params = {
    Bucket: `runtime-cococas`,
    Key: key.json
  };
  const getData = await s3.getObject(params).promise();
  console.log(getData.Body.toString("utf-8"));
  return response(getData,"success",200);
};