'use strict';
const { response } = require("../../../init/res");
const db = require('../../../init/db');
const TableName = process.env.EVENT_TABLE;
module.exports.handler = async (event, context, callback) => {
    // let user = context.jwtDecoded;
    let user = context.prev;
    if (user.role != "admin") {
        return response("", "no permision", 500)
    } else {
        const id = event.pathParameters.id
        const params ={
            TableName: TableName,
            Key: {
                eventId: id,
              },
              UpdateExpression: 'set #status = :status',
              ExpressionAttributeNames: {
                "#status": "status"
            },
              ExpressionAttributeValues: {
                ":status": "delete",
              },
        }
        return db.update(params)
        .promise()
        .then((res)=>{
            return response(res,"success",200)
        })
    }

};