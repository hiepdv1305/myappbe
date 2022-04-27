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
        const id = event.pathParameters.id
        await connectToDatabase();
        try {
            await product.findByIdAndUpdate(id, { status: "delete" });
            return res("", "Delete Success", 200)
        } catch (err) {
            return res("", err, 400)
        }
    }

};