'use strict';
const { response } = require("../../../init/res");
const db = require('../../../init/db');
const TableName = process.env.EVENT_TABLE;
module.exports.handler = async (event, context, callback) => {
    const params = {
        TableName: TableName,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':status': "active",
        },
    }
    return db.scan(params)
    .promise()
    .then((res)=>{
        res.forEach(r => {
            if(r.currentPoint/r.totalPoint > 0.97){
                Math.floor(Math.random()*r.totalPoint)
            }
        });
        return response(res,"success",200)
    })
    .catch((err)=>{
        return response("",err,500)
    })
};