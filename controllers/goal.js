const Goal = require('../model/goal.js');

exports.add = async (req, res) => {
    try{
        const [user]= req.user;
        const goal = req.body;

        if(
            goal.start_date == null || 
            goal.number_of_days == null || 
            goal.target_type == null || 
            goal.target_value == null ||
            goal.difficulty == null
            )
            return res.status(400).json({
                success:false,
                message: "Please Fill all Fields",
            });
        
        const added = await Goal.addGoal(
            user[0].user_id, 
            goal.start_date, 
            goal.number_of_days, 
            goal.target_type, 
            goal.target_value,
            goal.difficulty);
        
        if(added){

            // copy schedule and relevant diets and workouts
            const [schedule] = await Goal.copySchedule(user[0].user_id, goal.difficulty);
            const [scheduleIDdiets] = await Goal.copyScheduleIDdiet(user[0].user_id);
            const [dietID]= await Goal.updateDietID(goal.difficulty);
            const [scheduleIDworkout] = await Goal.copyScheduleIDworkout(user[0].user_id);
            const [workoutID]= await Goal.updateWorkoutID(goal.difficulty);
            if(!schedule || !scheduleIDdiets || !dietID || !scheduleIDworkout || !workoutID){
                return res.status(400).json({
                    success: false,
                    message: "not able to generate schedule"
                })
            }

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
        let flagUpdate;

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

        flagUpdate = await Goal.goalFlag(user[0].user_id, 2);
        if(flagUpdate[0].affectedRows >0)
            return res.status(201).json({
                success:true,
                message: "updated successful",
            });
        else{
            await Goal.removeGoal(user[0].user_id);
            res.status(500).json({message:"Server Error 2"});
        } 

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }

}

exports.total = async(req, res) => {
    // completed goal count
    try {
        const [user]= req.user;
        const [total] = await Goal.completedGoal(user[0].user_id);
        
        res.status(200).json({
            success:true,
            message:"completed goals",
            completedGoals: total[0].GOALS
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.current = async(req, res) => {
    // inProgress goal of that user
    try {
        const [user]= req.user;
        const [total] = await Goal.currentGoal(user[0].user_id);
        
        if(total.length == 0){
            return res.status(401).json({
                success:false,
                message: "No current goal"
            });   
        }
        
        res.status(200).json({
            success:true,
            message:"current goal",
            goal: total[0]
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.findGoal = async(req, res) => {
    //  goal detail by goal id
    try {
        const id = req.params.id;
        const [goal] = await Goal.findGoal(id);
        
        if(goal.length == 0){
            return res.status(401).json({
                success:false,
                message: "No goal found for that goal_id"
            });   
        }
        
        res.status(200).json({
            success:true,
            message:"goal with goal id",
            goal: goal[0]
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}