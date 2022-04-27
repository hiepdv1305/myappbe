module.exports.res = (data,message ,statusCode) => {
    return {
      headers: {
        "Access-Control-Allow-Origin": "http://gridsomehossting.s3-website-us-east-1.amazonaws.com",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: message,
        statusCode:statusCode,
        data
      }),
  
    };
  }