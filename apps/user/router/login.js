'use strict';
const {response} = require("../../../init/res");
const bcrypt = require("bcryptjs");
const config = require("../../../Config/config")
const jwtHelper = require('../../../init/jwt')
const db = require('../../../init/db');
// const axios = require("axios");
const TableName = process.env.USER_TABLE;
module.exports.handler = async (event, context, callback) => {
    let tokenList = {};
    context.callbackWaitsForEmptyEventLoop = false;
    const data = JSON.parse(event.body);
    const params = {
        TableName: TableName,
        FilterExpression: '#username = :username',
        ExpressionAttributeNames: {
            '#username': 'username',
        },
        ExpressionAttributeValues: {
            ':username': data.username,
        },
    }
    // console.log(params);
    return db.scan(params).promise().then(async (res)=>{
        console.log(res.Items[0])
        if (res && bcrypt.compareSync(data.password, res.Items[0].password)){
            const accessToken = await jwtHelper.generateToken(res.Items[0], config.accessTokenSecret, config.accessTokenLife)
            const refreshToken = await jwtHelper.generateToken(res.Items[0], config.refreshTokenSecret, config.refreshTokenLife)
            tokenList[refreshToken] = { accessToken, refreshToken };
            // result.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife }); 
            return response(accessToken,"success",200);
        }else{
            return response("","user or password incorrect",400)
        }
    }).catch((err)=>{
        return response("","user or password incorrect",400)
    })
    // let result = await db.scan(params);
    // console.log(result)
    // if (result && bcrypt.compareSync(params.password, result.password)){
    //     const accessToken = await jwtHelper.generateToken(result, config.accessTokenSecret, config.accessTokenLife)
    //     const refreshToken = await jwtHelper.generateToken(result, config.refreshTokenSecret, config.refreshTokenLife)
    //     tokenList[refreshToken] = { accessToken, refreshToken };
    //     // result.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife }); 
    //     return res(accessToken,"success",200);
    // }else{
    //     return res("","user or password incorrect",404)
    // }
    
};

