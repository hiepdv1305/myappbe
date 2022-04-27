'use strict';
const connectToDatabase = require("../../../init/db")
const product = require("../model/model")
const { res } = require("../../../init/res");
module.exports.handler = async (event, context, callback) => {
    // let user = context.jwtDecoded;
    let user = context.prev;
    if (user.role != "admin") {
        return res("", "no permision", 500)
    } else {
        const params = JSON.parse(event.body);
        // console.log(params);
        await connectToDatabase();
        let result = await product.create(params);
        if (result) {
            return res(result, "succces", 200);
        } else {
            return res("", "error", 400)
        }
    }

};