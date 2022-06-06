'use strict';
const { response } = require("../../../init/res");
const db = require('../../../init/db');
const { uuid } = require("uuidv4");
const { convertData } = require("../../../init/convertData")
const fields = {
    eventId: { type: String, default: uuid() },
    productId: { type: String },
    eventName: { type: String },
    description: { type: String, default: '' },
    image: { type: String },
    status: { type: String, default: 'active' },
    price: { type: Number },
    currentPoint: { type: Number, default: 0 },
    totalPoint: { type: Number },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() }
};
// const axios = require("axios");
const TableName = process.env.EVENT_TABLE;
module.exports.handler = async (event, context, callback) => {
    // let user = context.jwtDecoded;
    let user = context.prev;
    // console.log(user.role)
    if (user.role != "admin") {
        return response("", "no permision", 500)
    } else {
        let reqBody = JSON.parse(event.body);
        let data = convertData(fields, reqBody);
        console.log(data)
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

    }

};