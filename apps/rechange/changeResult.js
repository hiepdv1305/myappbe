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
const TableName = process.env.RECHANGE_TABLE;
const UserTable = process.env.USER_TABLE
module.exports.handler = async (event, context, callback) => {
    let user = context.prev;
    let reqBody = JSON.parse(event.body);
    let data = convertData(fields, reqBody);
    // console.log(data)
    return db.scan({
        TableName: TableName,
        FilterExpression: '#rechangeId = :rechangeId',
        ExpressionAttributeNames: {
            '#rechangeId': 'rechangeId',
        },
        ExpressionAttributeValues: {
            ':rechangeId': data.rechangeId,
        },
    }).promise()
        .then(res => {
            if (res.Count == 0) return response("", "rechange not exist")
                const item = JSON.parse(event.body);
                delete item["rechangeId"]
                let updateExpression = 'set';
                let ExpressionAttributeNames = {};
                let ExpressionAttributeValues = {};
                for (const property in item) {
                    updateExpression += ` #${property} = :${property} ,`;
                    ExpressionAttributeNames['#' + property] = property;
                    ExpressionAttributeValues[':' + property] = item[property];
                }
                updateExpression += ` #status = :status ,`;
                ExpressionAttributeNames['#status'] = 'status';
                ExpressionAttributeValues[':status'] = 'thành công';
                updateExpression = updateExpression.slice(0, -1);
                const params = {
                    TableName: TableName,
                    Key: {
                        rechangeId: data.rechangeId,
                    },
                    UpdateExpression: updateExpression,
                    ExpressionAttributeNames: ExpressionAttributeNames,
                    ExpressionAttributeValues: ExpressionAttributeValues
                };
                db.update(params).promise()
                    .then((res) => {
                        return response(res, "success", 200)
                    })
            db.update({
                TableName: UserTable,
                Key: {
                    rechangeId: user.userId,
                  },
                  UpdateExpression: 'set #amout = :amout',
                  ExpressionAttributeNames: {
                    "#amout": "amout"
                },
                  ExpressionAttributeValues: {
                    ":amout": data.rechange,
                  },
            })
            return response('', 'thanh cong', 200)
        })
        .catch(err => {
            return response("", err, 500)
        })


};