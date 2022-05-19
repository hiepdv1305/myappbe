'use strict';
const { response } = require("../../../init/res");
const db = require('../../../init/db');
const { uuid } = require("uuidv4");
const { convertData } = require("../../../init/convertData")
const TableName = process.env.DEAL_TABLE;
const eventTable = process.env.EVENT_TABLE;
const fields = {
    dealId: { type: String, default: uuid() },
    eventId: { type: String },
    userId: { type: String },
    eventName: { type: String },
    image: { type: String },
    price: {type:Number},
    currentPoint: { type: Number },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() }
};
module.exports.handler = async (event, context, callback) => {

    let user = context.prev;
    const data = JSON.parse(event.body);
    db.scan(
        {
            TableName: eventTable,
            FilterExpression: '#eventId = :eventId AND #status = :status',
            ExpressionAttributeNames: {
                '#eventId': 'eventId',
                '#status' : 'status'
            },
            ExpressionAttributeValues: {
                ':eventId': data.eventId,
                ':status' : 'active'
            }
        }).promise().then(res=>{
            db.update({
                TableName: eventTable,
                Key: {
                    eventId: data.eventId,
                  },
                  UpdateExpression: 'set #currentPoint = :currentPoint',
                  ExpressionAttributeNames: {
                    "#currentPoint": "currentPoint"
                },
                  ExpressionAttributeValues: {
                    ":currentPoint": res.Items[0].currentPoint+data.point,
                  },   
            }).promise()
        })
    
    return db.scan({
        TableName: TableName,
        FilterExpression: '#eventId = :eventId AND #userId = :userId',
        ExpressionAttributeNames: {
            '#eventId': 'eventId',
            '#userId': 'userId'
        },
        ExpressionAttributeValues: {
            ':eventId': data.eventId,
            ':userId': user.userId
        }
    }).promise()
        .then(res => {
            if (res.Count == 0) {
                let dealdata = {
                    userId: user.userId,
                    eventId: data.eventId,
                    currentPoint: data.point,
                    image:data.image,
                    eventName: data.eventName,
                    price:data.price
                }
                dealdata = convertData(fields, dealdata);
                let dealparams = {
                    TableName: TableName,
                    Item: dealdata
                }
                return db.put(dealparams).promise()
                    .then(res => {
                        return response(res, "succces", 200);
                    }).catch(err => {
                        return response("", err, 400)
                    })
            } 
            else {
                let oldPoint = res.Items[0].currentPoint
                let item = {
                    userId: user.userId,
                    eventId: data.eventId,
                    currentPoint: data.point+oldPoint,
                    image:data.image,
                    eventName: data.eventName,
                    price:data.price+res.Items[0].price
                }
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
                        dealId: res.Items[0].dealId,
                    },
                    UpdateExpression: updateExpression,
                    ExpressionAttributeNames: ExpressionAttributeNames,
                    ExpressionAttributeValues: ExpressionAttributeValues
                };
                return db.update(params).promise()
                    .then((res) => {
                        return response(res, "success", 200)
                    })
            }

        }).catch(err=>{
            return response("",err,400)
        })
};