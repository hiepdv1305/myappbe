'use strict';
const { response } = require("../../../init/res");
const db = require('../../../init/db');
const TableName = process.env.EVENT_TABLE;
const dealTable = process.env.DEAL_TABLE;
const {addNotification} = require('../../user/router/addnotification')
module.exports.handler = async (event, context, callback) => {
    console.log(1)
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
    db.scan(params)
        .promise()
        .then((res) => {
            // console.log(res.Items)
            res.Items.forEach(r => {
                if (r.currentPoint / r.totalPoint >= 0.5) {
                    console.log(1)
                    const id = r.eventId;
                    db.scan(
                        {
                            TableName: dealTable,
                            FilterExpression: '#eventId = :eventId',
                            ExpressionAttributeNames: {
                                '#eventId': 'eventId',
                            },
                            ExpressionAttributeValues: {
                                ':eventId': id,
                            }
                        }
                    ).promise()
                        .then((result) => {
                            let spin_arr = [];
                            result.Items.forEach(item => {
                                for (var i = 0; i < item.currentPoint; i++) {
                                    spin_arr.push(item.userId);
                                    console.log(item.userId)
                                }
                            })
                            var kq = Math.floor(Math.random() * r.currentPoint);
                            console.log(`nguoi chien thang la ${spin_arr[kq]}`)
                            if(!spin_arr[kq]){
                                kq = "khong co ai chien thang"
                            }else{
                                kq=spin_arr[kq]
                                addNotification(kq,{
                                    eventId:r.eventId,
                                    content: 'ban la nguoi chien thang'
                                })
                            }
                            db.update({
                                TableName: TableName,
                                Key: {
                                    eventId: id,
                                },
                                UpdateExpression: 'set #winner = :winner, #status = :status',
                                ExpressionAttributeNames: {
                                    "#winner": "winner",
                                    "#status": "status"
                                },
                                ExpressionAttributeValues: {
                                    ":winner": kq,
                                    ":status": "finish"
                                },
                            })
                                .promise()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            });
        })
    // .catch((err) => {
    //     return response("", err, 500)
    // })
};