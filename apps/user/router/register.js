'use strict';
const { response } = require("../../../init/res");
const bcrypt = require("bcryptjs");
const db = require('../../../init/db');
const { uuid } = require("uuidv4");
const { convertData } = require("../../../init/convertData")
const fields = {
    userId: { type: String, default: uuid() },
    username: { type: String },
    password: { type: String },
    role:{ type: String, default: 'user' },
    fullname: { type: String, default: '' },
    phonenumber: { type: String, default: '' },
    email: { type: String, default: '' },
    gendle: { type: Number, default: 1 },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() }
};
// const axios = require("axios");
const TableName = process.env.USER_TABLE;
module.exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let reqBody = JSON.parse(event.body);
    let salt = bcrypt.genSaltSync(10);
    reqBody.password = bcrypt.hashSync(reqBody.password, salt);
    let data = convertData(fields, reqBody);
    let params = {
        TableName: TableName,
        FilterExpression: '#username = :username',
        ExpressionAttributeNames: {
            '#username': 'username',
        },
        ExpressionAttributeValues: {
            ':username': data.username,
        },
    }
    return db.scan(params).promise().then((res)=>{
        console.log(res)
        if (res.Count > 0) {
            console.log(1)
            return response("", "username already exists", 400);
        } else {
            return db.put({
                TableName: TableName,
                Item: data,
            }).promise()
            .then(()=>{
               return response("", "success", 200) 
            })
        }
    }).catch((err)=>{
        
        console.log(err)
        return res("", "server error",500);
    })

};