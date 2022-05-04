'use strict';
const { response } = require("../../../init/res");
const db = require('../../../init/db');
const TableName = process.env.DEAL_TABLE;
module.exports.handler = async (event, context, callback) => {
    const id = event.pathParameters.id;
    return db.scan(
        {
            TableName: TableName,
            FilterExpression: '#eventId = :eventId',
            ExpressionAttributeNames: {
                '#eventId': 'eventId',
            },
            ExpressionAttributeValues: {
                ':eventId': id,
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