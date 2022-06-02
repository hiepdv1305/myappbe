'use strict';
const { response } = require("../../init/res");
const db = require('../../init/db');
const { uuid } = require("uuidv4");
const { convertData } = require("../../init/convertData")
const fields = {
    rechangeId: { type: String, default: uuid() },
    userId: { type: String },
    bankName: { type: String },
    rechange: { type: Number, default: 0 },
    status: { type: String, default: 'dang xu ly' },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() }
};
// const axios = require("axios");
const TableName = process.env.RECHANGE_TABLE;
module.exports.handler = async (event, context, callback) => {
    // let user = context.jwtDecoded;
    let user = context.prev;

    let reqBody = JSON.parse(event.body);
    reqBody["userId"] = user.userId
    let data = convertData(fields, reqBody);
    // console.log(data)
    return db.put(
        {
            TableName: TableName,
            Item: data,
        }
    ).promise()
    .then((res) => {
        console.log(res)
        return response(res, "succces", 200);
    })
    .catch((err) => {
        return response("", "server error", 400)
    })

};