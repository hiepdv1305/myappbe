'use strict';
const connectToDatabase = require("../../../init/db")
const deal = require("../model/model")
const ev = require("../../event/model/model")
const { res } = require("../../../init/res");
module.exports.handler = async (event, context, callback) => {

    let user = context.prev;
    // // console.log(user)
    const data = JSON.parse(event.body);
    // // console.log(params);
    // await connectToDatabase();
    // let check = await deal.find({ userId: user.id, eventId: data.eventId }).count();
    // let evdata = await ev.find({ eventId: data.eventId })
    // let evparams = {
    //     currentPoint:evdata[0].currentPoint +data.point
    // }
    // await ev.findByIdAndUpdate(data.eventId, evparams, { new: true });
    // // console.log(check)
    // if (check > 0) {
    //     let getdata = await deal.find({ userId: user.id, eventId: data.eventId })
    //     let oldPoint = getdata[0].currentPoint
    //     // console.log(getdata)
    //     let dealparams = {
    //         userId: user.id,
    //         eventId: data.eventId,
    //         currentPoint: data.point+oldPoint
    //     }
    //     // console.log(params);

    //     // console.log(a[0].point)
    //     await deal.findOneAndUpdate({userId: user.id, eventId: data.eventId},dealparams,{ new: true });
    //     return res("", "succces", 200);
    // } else {
    //     let dealparams = {
    //         userId: user.id,
    //         eventId: data.eventId,
    //         currentPoint: data.point
    //     }
    //     let result = await deal.create(dealparams);
    //     if (result) {
    //         return res(result, "succces", 200);
    //     } else {
    //         return res("", "error", 400)
    //     }

    // }
    return res(result, "succces", 200);
};