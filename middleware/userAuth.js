const jwt = require('jsonwebtoken');

exports.isAuthenticated = async(req, res, next) =>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token)
            return res.status(401).json({
                message: "Token not found"
            });
        
        jwt.verify(token, process.env.JWT_SECRET, (err, id)=>{
            if(err)
                return res.status(403).json({
                    message: "You have no access"
                })

            //i will get user here by calling model
            // req.user = model(id)
            next();
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message 
        })
    }
}