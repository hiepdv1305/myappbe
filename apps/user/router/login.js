const connectToDatabase = require("../../../init/db");
const {res} = require("../../../init/res");
const User = require("../model/model");
const bcrypt = require("bcryptjs");
const config = require("../../../Config/config")
const jwtHelper = require('../../../init/jwt')

module.exports.handler = async (event, context, callback) => {
    let tokenList = {};
    context.callbackWaitsForEmptyEventLoop = false;
    const params = JSON.parse(event.body);
    console.log(params);
    await connectToDatabase();
    let result = await User.findOne({ username: params.username });
    if (result && bcrypt.compareSync(params.password, result.password)){
        const accessToken = await jwtHelper.generateToken(result, config.accessTokenSecret, config.accessTokenLife)
        const refreshToken = await jwtHelper.generateToken(result, config.refreshTokenSecret, config.refreshTokenLife)
        tokenList[refreshToken] = { accessToken, refreshToken };
        // result.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife }); 
        return res(accessToken,"success",200);
    }else{
        return res("","user or password incorrect",404)
    }
    
};

