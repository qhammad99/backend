const WorkoutPlan = require('../model/workoutPlan');

exports.myWorkoutPlans = async(req, res) => {
    try{
        const [user] = req.user;
        const [workouts] = await WorkoutPlan.myWorkoutPlans(user[0].user_id);
        
        if(workouts.length == 0){
            return res.status(500).json({
                success: false,
                message: "You don't have your any own workout plan",
            })
        }

        res.status(200).json({
            success: true,
            message:"My workout plans",
            workoutPlans: workouts
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.workoutPlanByID = async(req, res) => {
    try{
        const [workouts] = await WorkoutPlan.workoutPlanByID(req.params.id);

        if(workouts.length == 0)
            return res.status(401).json({
                status:false,
                message: "workot plan not found"
            });
        
        res.status(200).json({
            status: true,
            message: "workout plan by id",
            workoutPlan: workouts
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }    
}

exports.addWorkoutPlan = async(req, res) => {
    try{
        const [user] = req.user;
        const workoutPlan = req.body;

        // check null
        if(workoutPlan.name == null || workoutPlan.workouts.length == 0){
            return res.status(500).json({
                success: false,
                message: "empty fields not allowed"
            })
        }

        const addedPlan = await WorkoutPlan.addWorkoutPlan(user[0].user_id, workoutPlan.name);
        if(addedPlan){
            const wokrout_planID = addedPlan[0].insertId;

            const workouts = workoutPlan.workouts.map(workouts =>[workouts.id, wokrout_planID]);

            const workoutsAdded = await WorkoutPlan.attachWorkouts(workouts);
            if(workoutsAdded)
                return res.status(200).json({
                    success: true,
                    message: "Workout Plan added"
                })
        }

        res.status(401).json({
            success: false,
            message: "Not added"
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.generalWorkoutPlan = async(req, res) => {
    try{
        const [workoutPlans] = await WorkoutPlan.generalWorkoutPlans();

        if(workoutPlans.length == 0)
            return res.status(401).json({
                success:false,
                message: "No general workout plans"
            });
        
        res.status(200).json({
            success: true,
            message: "general workout plans",
            workoutPlans: workoutPlans
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.workoutPlansByUserID = async(req, res) => {
    try{
        const [workoutPlans] = await WorkoutPlan.userWorkoutPlans(req.params.id);
        
        if(workoutPlans.length == 0){
            return res.status(401).json({
                success: false,
                message: "No workout plan found for that user",
            })
        }

        res.status(200).json({
            success: true,
            message: "workout plans by user id",
            workoutPlans: workoutPlans
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.workoutPlanWorkouts = async(req, res) => {
    try{
        const id = req.params.id;
        const [workouts] = await WorkoutPlan.getWorkouts(id);
        
        if(workouts.length == 0){
            return res.status(401).json({
                success: false,
                message: "no workouts"
            });
        }
        res.status(200).json({
            success: true,
            message: "Workouts of a workout plan",
            workouts: workouts
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}