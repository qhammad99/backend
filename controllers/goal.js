const Goal = require('../model/goal.js');

exports.add = async (req, res) => {
    try{
        const [user]= req.user;
        const goal = req.body;

        if(goal.duration_type == null || goal.duration_value == null || goal.target_type == null || goal.target_value == null)
            return res.status(400).json({
                success:false,
                message: "Please Fill all Fields",
            });
        
        const added = await Goal.addGoal(user[0].user_id, goal.duration_type, goal.duration_value, goal.target_type, goal.target_value);
        
        if(added){
            // update the isGoal flag in user table
            const update = await Goal.goalFlag(user[0].user_id, 1);
            if(update[0].affectedRows >0)
                return res.status(201).json({
                    success:true,
                    message: "Goal added successful",
                    goalID: added[0].insertId
                });
            else{
                await Goal.removeGoal(user[0].user_id);
                res.status(500).json({message:"Server Error 2"});
            }    
        }
        else
            res.status(500).json({message:"Server Error 2"});
            
    }catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updateStatus = async(req, res) => {
    // this will update status to completed
    try {
        const [user]= req.user;
        const goalID = req.body.goalID;
        let updated; // to check is any row affected by update or not

        // check to update is the goal of the user or he trying to update goal of any other
        const [verifyGoal] = await Goal.verifyGoal(user[0].user_id, goalID);
        if(verifyGoal.length==0){
            return res.status(401).json({
                success:false,
                message: "You can't update goal of other users"
            });   
        }

        updated = await Goal.updateStatus(goalID);
        
        if(updated[0].affectedRows == 0)
            return res.status(401).json({
                success:false,
                message: "Can't update"
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

// exports.myParameters = async(req, res) =>{
//     try{
//         const [user]= req.user;
        
//         const [parameters] = await Parameters.getParameters(user[0].user_id);
//         if(parameters.length != 0)
//             return res.status(201).json({
//                 success:true,
//                 message: "Parameters found",
//                 parameters: parameters[0]
//             });
//         else
//             res.status(500).json({
//                 success:false,
//                 message:"Parameters not found"
//             })
            
//     }catch (error) {
//         res.status(500).json({
//             success:false,
//             message:error.message
//         })
//     } 
// }

// exports.findParameters = async(req, res) =>{
//     try{
//         const id= req.params.id;
        
//         const [parameters] = await Parameters.getParameters(id);
//         if(parameters.length != 0)
//             return res.status(201).json({
//                 success:true,
//                 message: "Parameters found",
//                 parameters: parameters[0]
//             });
//         else
//             res.status(500).json({
//                 success:false,
//                 message:"Parameters not found"
//             })
            
//     }catch (error) {
//         res.status(500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }