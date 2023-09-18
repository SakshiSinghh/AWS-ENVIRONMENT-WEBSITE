const config = require('../config/config');
const jwt = require('jsonwebtoken');

module.exports.verifyTokenUserID= (req,res,next)=> {
    //logger.info("verifyTokenUserID middleware called")
    let token = req.headers['authorization'];
    res.type('json');
    if(!token || !token.includes("Bearer")){
        console.log("Unauthorized Access Attempt is made, No Token");
        res.status(403);
        res.send(`{"Message":"Not Authorized"}`);
    }
    else{
       console.log("Token found ... now trying to decode it...")
       token = token.split('Bearer ')[1];
       jwt.verify(token,config.JWTKey,function(err,decoded){
        if(err){
            console.log("Unauthorized Access Attempt was made, Invalid Token");
            res.status(403);
            res.send(`{"Message":"Not Authorized"}`);

        }
        else{
            console.log("Token verified");
            req.body.userId = decoded.id;
            req.role = decoded.role;
            next();
            return;
        }
       })
    }
}

module.exports.verifyAdminToken = (req, res, next) => {
    //logger.info("verifyTokenUserID middleware called");
    let token = req.headers['authorization'];
    console.log('token: ',req.headers)
    console.log('verifying admin token.....')
    res.type('json');
    if (!token || !token.includes("Bearer")) {
        console.log("Unauthorized access attempt was made, no token");
        res.status(403);
        res.send(`{"Message":"Not Authorized"}`);
    } else {
        console.log("Token found... now trying to decode it...")
        token = token.split('Bearer ')[1];
        jwt.verify(token, config.JWTKey, function (err, decoded) {
            if (err) {
                console.log("Unauthorized access attempt was made, invalid token");
                res.status(403);
                res.send(`{"Message":"Not Authorized"}`);
            } else {
                console.log('decoded id is ', decoded.role_id)
                if(decoded.role_id == 1) { //1 is admin, 2 is user
                    console.log("Token verified");
                    req.body.userId = decoded.id;
                    // if (req.role )
                    next();
                    return;
                } else {
                    console.log("Unauthorized access attempt was made, not admin token")
                    res.status(403);
                    res.send(`{"Message":"Not Authorized"}`);
                }
            }
        });
    }
}