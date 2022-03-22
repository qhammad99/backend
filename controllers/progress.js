const Progress = require('../model/progress');

exports.progressTasks = async(req, res) => {
    try{
        const id = req.params.id;

        const [tasks] = await Progress.tasksDetails(id);
        if(tasks.length==0){
            return res.status(401).json({
                success: false,
                message: "no tasks for progress"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "tasks of progress by id",
            tasks: tasks
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.findByDay = async(req, res) => {
    try{
        const goal_id = req.params.goal;
        const day_no = req.params.day;

        const [progress] = await Progress.findByDay(goal_id, day_no);
        if(progress.length == 0){
            return res.status(401).json({
                success: false,
                message: "No progress found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Progress By Day Number",
            progress: progress
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.findByDate = async(req, res) => {
    try{
        const goal_id = req.params.goal;
        const date = req.params.date;

        const [progress] = await Progress.findByDate(goal_id, date);
        if(progress.length == 0){
            return res.status(401).json({
                success: false,
                message: "No progress found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Progress By Date",
            progress: progress
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.attachDiet = async(req, res) => {
    try{
        const diet = req.body;
        const MONTH ={ 
            "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, 
            "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
        };

        if(diet.diet_id == null || diet.calories == null || 
            diet.start_time == null || diet.finish_time == null || 
            diet.goal_id == null || diet.day_no == null){

            return res.status(500).json({
                success: false,
                message: "empty values not allowed"
            });
        }

        const todayPk = new Date().toString();
        const currentMonth = ('0' + MONTH[todayPk.substring(4, 7)]).slice(-2);  // add 0 at start if less than 10
        const currentDate = ('0' + todayPk.substring(8, 10)).slice(-2);
        const currentYear = todayPk.substring(11, 15);
        const todayDate = currentYear + "-" + currentMonth + "-" + currentDate;

        // check if progress table has today record then get id of it and attach diet with junction table
        const [check] = await Progress.getByDate(todayDate);
        if(check.length > 0){
            let caloriesGain = parseInt(check[0].calories_gain);
            caloriesGain = caloriesGain + parseInt(diet.calories);

            // also update calorie in progress table of that record
            const update = await Progress.updateCalorieGain(caloriesGain, check[0].id);

            if(update[0].affectedRows == 0)
                return res.status(401).json({
                    success: false,
                    message: "Can't attach diet"
                })
            else{
                const added = await Progress.attachDiet(check[0].id, diet.diet_id, diet.start_time, diet.finish_time);
                if(!added)
                    return res.status(401).json({
                        success: false,
                        message: "Workout not attached to progress"
                    })
            }
        }
        else{
            // otherwise insert record into progress and attach workout
            let caloriesGain = parseInt(diet.calories);

            const add = await Progress.addProgressDiet(diet.goal_id, diet.day_no, todayDate, caloriesGain);
            if(!add){
                return res.status(401).json({
                    success: false,
                    message: "Can't add progress"
                })
            }

            const added = await Progress.attachDiet(add[0].insertId, diet.diet_id, diet.start_time, diet.finish_time);
            if(!added)
                return res.status(401).json({
                    success: false,
                    message: "Diet not attached to progress"
                })
        }
        
        res.status(200).json({
            success: true, 
            message: "Added Successfully"
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.attachWorkout = async(req, res) => {
    try{
        const workout = req.body;
        const MONTH ={ 
            "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, 
            "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
        };

        if(workout.workout_plan_id == null || workout.calories == null || 
            workout.start_time == null || workout.finish_time == null || 
            workout.goal_id == null || workout.day_no == null){

            return res.status(500).json({
                success: false,
                message: "empty values not allowed"
            });
        }

        const todayPk = new Date().toString();
        const currentMonth = ('0' + MONTH[todayPk.substring(4, 7)]).slice(-2);  // add 0 at start if less than 10
        const currentDate = ('0' + todayPk.substring(8, 10)).slice(-2);
        const currentYear = todayPk.substring(11, 15);
        const todayDate = currentYear + "-" + currentMonth + "-" + currentDate;

        // check if progress table has today record then get id of it and attach workout with junction table
        const [check] = await Progress.getByDate(todayDate);
        if(check.length > 0){
            let caloriesBurn = parseInt(check[0].calories_burn);
            caloriesBurn = caloriesBurn + parseInt(workout.calories);

            // also update calorie in progress table of that record
            const update = await Progress.updateCalorieBurn(caloriesBurn, check[0].id);

            if(update[0].affectedRows == 0)
                return res.status(401).json({
                    success: false,
                    message: "Can't attach workout"
                })
            
            else{
                const added = await Progress.attachWorkout(check[0].id, workout.workout_plan_id, workout.start_time, workout.finish_time);
                if(!added)
                    return res.status(401).json({
                        success: false,
                        message: "Workout not attached to progress"
                    })
            }
        }
        else{
            // otherwise insert record into progress and attach workout
            let caloriesBurn = parseInt(workout.calories);

            const add = await Progress.addProgressWorkout(workout.goal_id, workout.day_no, todayDate, caloriesBurn);
            if(!add){
                return res.status(401).json({
                    success: false,
                    message: "Can't add progress"
                })
            }

            const added = await Progress.attachWorkout(add[0].insertId, workout.workout_plan_id, workout.start_time, workout.finish_time);
            if(!added)
                return res.status(401).json({
                    success: false,
                    message: "Workout not attached to progress"
                })
        }

        res.status(200).json({
            success: true, 
            message: "Added Successfully"
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}