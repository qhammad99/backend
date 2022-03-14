const jwt = require('jsonwebtoken');
const User = require('../model/user');

exports.isAuthenticated = async(req, res, next) =>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token)
            return res.status(401).json({
                message: "Token not found"
            });
        
        jwt.verify(token, process.env.JWT_SECRET, async(err, id)=>{
            if(err)
                return res.status(403).json({
                    message: "You have no access"
                })

            if(req.params.id == id)
                req.user = await User.findById(id);
            else
                return res.status(403).json({
                    message: "invalid argument"
                })
            next();
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message 
        })
    }
}