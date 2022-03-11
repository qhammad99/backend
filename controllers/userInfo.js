const UserInfoModel = require ('../model/userInfo.js');

exports.getUsersInfo = async (req, res, next) => {
    try{
        const [usersInfo] = await UserInfoModel.getUsersInfo();
        res.status(200).json(usersInfo);
    }catch(err){
        res.status(500).json({message:"Server error"})
    }
}

//login
exports.getUserInfo = async (req, res) => {
    const email = req.body.email
    const pass = req.body.password;
    console.log(email);
    console.log(pass);
    try{
        const [userInfo] = await UserInfoModel.getUserInfo(email, pass);
        if(userInfo.length!=0){
            res.status(200).json(userInfo[0]);
        }
        else{
            res.status(409).json({message: "unauthorized user"});
        }
    }catch(err){
        res.status(500).json({message:"Server error"})
    }
}

//signup
exports.addUserInfo = async (req, res) => {
    const userInfo = req.body;
    try{
        const [mailVerify] = await UserInfoModel.verifyEmail(userInfo.email);
        if(mailVerify.length != 0)
        {
            res.status(409).json({message: "Email already exist"});
        }
        else{
            UserInfoModel.addUser(userInfo.name, userInfo.email, userInfo.password, 
                userInfo.u_type, userInfo.coach_id).then(result => {
                res.status(201).json({add:true})
            }).catch(error => {
                res.status(500).json({message:"Server Error 2"})
            })
            }   
    }catch(err){
        res.status(500).json({message:"Server error"})
    }
}

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