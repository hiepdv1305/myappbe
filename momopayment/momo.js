'use strict';
const { response } = require("../init/res");
const config = require("../Config/config")
const https = require('https');
const axios = require("axios");
const TableName = process.env.USER_TABLE;
module.exports.handler = async (event, context, callback) => {
    const data = JSON.parse(event.body);
    //parameters
    var partnerCode = config.partnerCode;
    var accessKey = config.accessKey;
    var secretkey = config.secretkey;
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = "pay with MoMo";
    var redirectUrl = config.redirectUrl;
    var ipnUrl = "https://callback.url/notify";
    var amount = (data.point * 10000).toString();
    var requestType = "captureWallet"
    var extraData = ""; //pass empty value if your merchant does not have stores

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
    //puts raw signature
    // console.log("--------------------RAW SIGNATURE----------------")
    // console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');
    // console.log("--------------------SIGNATURE----------------")
    // console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: 'en'
    });
    //Create the HTTPS objects
    
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    }
    return await axios.post('https://test-payment.momo.vn/v2/gateway/api/create',requestBody,options).then(res=>{
        return response(res.data,"success",200)
        console.log(res.data)
    }).catch(err=>{
        return response(err,"err",400)
    })
    // let result = {}
    // const req = https.request(options,(res) => {
    //     res.setEncoding('utf8');
    //     res.on('data', (body) => {
    //         console.log(JSON.parse(body));
    //         // return response(JSON.parse(body),"success",200)
    //     });
    // })
    // .write(requestBody);
    
};