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
        if(user.email == null || user.password == null)
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
            let userObj = {...user, user_id: created[0].insertId}

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
/////////////////////////////////////////////////////////////////////////

// exports.removeUserInfo = (req, res) => {
//     const {id} = req.params;
//     dbConnection.query( `DELETE FROM user_info WHERE user_id = ?`, [id], (error, results, fields) => {
//         if (error) throw error;
//         console.log(results);
//         res.send(results);
//     });
// }

// exports.updateUserInfo = (req, res) => {
//     const {id} = req.params;
//     console.log(req.body);
//     if(req.body.name){
//         dbConnection.query( `UPDATE user_info SET name= ? WHERE user_id = ?`,[req.body.name, id], (error, results, fields) => {
//             if (error) throw error;
//             console.log(results);
//             res.send(results);
//         });
//     }

//     if(req.body.email){
//         dbConnection.query( `UPDATE user_info SET email= ? WHERE user_id = ?`,[req.body.email, id], (error, results, fields) => {
//             if (error) throw error;
//             console.log(results);
//             res.send(results);
//         });
//     }

//     if(req.body.password){
//         dbConnection.query( `UPDATE user_info SET password= ? WHERE user_id = ?`, [req.body.password, id], (error, results, fields) => {
//             if (error) throw error;
//             console.log(results);
//             res.send(results);
//         });
//     }

//     if(req.body.coach_id){
//         dbConnection.query( `UPDATE user_info SET coach_id= ? WHERE user_id = ?`,[req.body.coach_id, id], (error, results, fields) => {
//             if (error) throw error;
//             console.log(results);
//             res.send(results);
//         });
//     }
// }