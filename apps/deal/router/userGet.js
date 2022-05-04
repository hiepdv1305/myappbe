'use strict';
const { response } = require("../../../init/res");
const db = require('../../../init/db');
const TableName = process.env.DEAL_TABLE;
module.exports.handler = async (event, context, callback) => {
    let user = context.prev;
    return db.scan(
        {
            TableName: TableName,
            FilterExpression: '#userId = :userId',
            ExpressionAttributeNames: {
                '#userId': 'userId',
            },
            ExpressionAttributeValues: {
                ':userId': user.userId,
            }
        }
    ).promise()
        .then((res) => {
            return response(res, "success", 200)
        })
        .catch((err) => {
            return response("", "server error", 500)
        })
};