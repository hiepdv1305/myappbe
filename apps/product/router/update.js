'use strict';
const { response } = require("../../../init/res");
const db = require('../../../init/db');
const TableName = process.env.PRODUCT_TABLE;
module.exports.handler = async (event, context, callback) => {
    let user = context.prev;
    if (user.role != "admin") {
        return response("", "no permision", 500)
    } else {
        const id = event.pathParameters.id;
        return db.scan({
            TableName: TableName,
            FilterExpression: '#productId = :productId',
            ExpressionAttributeNames: {
                '#productId': 'productId',
            },
            ExpressionAttributeValues: {
                ':productId': id,
            },
        }).promise()
            .then(res => {
                if (res.Count == 0) return response("", "product not exist")
                const item = JSON.parse(event.body);
                let updateExpression = 'set';
                let ExpressionAttributeNames = {};
                let ExpressionAttributeValues = {};
                for (const property in item) {
                    updateExpression += ` #${property} = :${property} ,`;
                    ExpressionAttributeNames['#' + property] = property;
                    ExpressionAttributeValues[':' + property] = item[property];
                }
                updateExpression = updateExpression.slice(0, -1);
                const params = {
                    TableName: TableName,
                    Key: {
                        productId: id,
                    },
                    UpdateExpression: updateExpression,
                    ExpressionAttributeNames: ExpressionAttributeNames,
                    ExpressionAttributeValues: ExpressionAttributeValues
                };
                return db.update(params).promise()
                    .then((res) => {
                        return response(res, "success", 200)
                    })
            })
            .catch(err=>{
                return response("",err,500)
            })

    }

};