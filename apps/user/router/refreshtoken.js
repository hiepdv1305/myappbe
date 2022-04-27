const {res} = require("../../../init/res");
const config = require("../../../Config/config")
const jwtHelper = require('../../../init/jwt')

module.exports.handler = async (event, context, callback) => {
    const refreshTokenFromClient = event.body.cookies.refreshToken;
    // debug("tokenList: ", tokenList);

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
            // có thể mở comment dòng debug bên dưới để xem là rõ nhé.
            // debug("decoded: ", decoded);
            const accessToken = await jwtHelper.generateToken(decoded, config.accessTokenSecret, config.accessTokenLife);
            // gửi token mới về cho người dùng
            return res.status(200).json({ accessToken });
        } catch (error) {
            delete tokenList[refreshTokenFromClient];
            res.status(403).json({
                message: 'Invalid refresh token.',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
    
};

