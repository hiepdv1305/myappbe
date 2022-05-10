'use strict';
const { response } = require("../../../init/res");
const db = require('../../../init/db');
const TableName = process.env.EVENT_TABLE;
module.exports.handler = async (event, context, callback) => {
    const id = event.pathParameters.id;
    return db.scan(
        {
            TableName: TableName,
            FilterExpression: '#eventId = :eventId AND #status = :status',
            ExpressionAttributeNames: {
                '#eventId': 'eventId',
                '#status' : 'status'
            },
            ExpressionAttributeValues: {
                ':eventId': id,
                ':status' : 'active'
            }
        }
    ).promise()
        .then((res) => {
            if(res.Count == 0) return response("","event not exist or finished",400)
            return response(res, "success", 200)
        })
        .catch((err) => {
            return response("", "server error", 500)
        })
};