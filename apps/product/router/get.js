'use strict';
const { response } = require("../../../init/res");
const db = require('../../../init/db');
const TableName = process.env.PRODUCT_TABLE;
module.exports.handler = async (event, context, callback) => {
    const id = event.pathParameters.id;
    return db.scan(
        {
            TableName: TableName,
            FilterExpression: '#productId = :productId',
            ExpressionAttributeNames: {
                '#productId': 'productId',
            },
            ExpressionAttributeValues: {
                ':productId': id,
            },
            Limit: 1
        }
    ).promise()
        .then((res) => {
            if(res.Count == 0) return response("","product not exist",400)
            return response(res, "success", 200)
        })
        .catch((err) => {
            return response("", err, 500)
        })
};