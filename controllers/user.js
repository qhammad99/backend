const User = require('../model/user.js');

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const [user] = await User.findUser(email);
    
        if(user.length == 0)
        {
            return res.status(401).json({
                success:false,
                message: "User not found"
            });
        }

        const isMatch = await User.matchPassword(user[0]["password"], password);

        if(!isMatch)
            return res.status(400).json({
                success:false,
                message: "Password not match"
            });

        const token = await User.generateToken(user[0]["user_id"]);

        res.status(201).json({
            success:true,
            message: "Login successful",
            token:token,
            user:user[0]
        });
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}

exports.register = async (req, res) => {
    const user = req.body;
    try{
        if(user.email == null || user.password == null || user.name == null ||user.u_type == null)
            return res.status(400).json({
                success:false,
                message: "Please Fill all Fields",
            });

        const [mailVerify] = await User.findUser(user.email);
        
        if(mailVerify.length != 0)
            return res.status(409).json({
                message: "Email already exist"
            });
        
        const created = await User.createUser(user.name, user.email, user.password, user.u_type)
        
        if(created){
            const token = await User.generateToken(created[0].insertId);
            let userObj;
            if(user.u_type = 1)
                userObj = {...user, user_id: created[0].insertId, isParameters:0, isGoal:0, u_type:"User"}
            else
                userObj = {...user, user_id: created[0].insertId, isParameters:0, isGoal:0, u_type:"Coach"}
                
            return res.status(201).json({
                success:true,
                message: "Register successful",
                token:token,
                user:userObj
            });
        }
        else
            res.status(500).json({message:"Server Error 2"})
            
    }catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.update = async(req, res) => {
    try {
        const [user]= req.user;
        const userObj = req.body;
        let updated; // to check is any row affected by update or not
    
        if(userObj.email == null && userObj.password == null && userObj.name == null)
            return res.status(400).json({
                success:false,
                message: "Not shared data to update",
        });

        if(userObj.email == null || userObj.password == null || userObj.name == null)
            return res.status(400).json({
                success:false,
                message: "Please don't pass empty fields",
        });

        if(userObj.email){
            const [mailVerify] = await User.findUser(userObj.email);
    
            if(mailVerify.length != 0)
                return res.status(409).json({
                    message: "Email already exist"
                });

            updated = await User.updateEmail(user[0].user_id, userObj.email);
        }

        if(userObj.name)
            updated = await User.updateName(user[0].user_id, userObj.name);
    
        if(userObj.password)
            updated = await User.updatePassword(user[0].user_id, userObj.password);
        
        if(updated[0].affectedRows == 0)
            return res.status(401).json({
                success:false,
                message: "User not found"
            });

        res.status(200).json({
            success:true,
            message:"updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }

}
