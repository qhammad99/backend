const Schedule = require('../model/schedule');

exports.todaySchedule = async(req, res) => {
    try{
        const[user] = req.user;
        const goal = req.body;

        const DAY ={ "Sun": 1, "Mon": 2, "Tue": 3, "Wed": 4, "Thu": 5, "Fri": 6, "Sat": 7 };
        const MONTH ={ 
            "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, 
            "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
        };

        const todayPK = new Date().toString(); // convert to local time but sending string
        const dayString = todayPK.substring(0, 3);
        const dayNumber = DAY[dayString];
        const currentMonth = ('0' + MONTH[todayPK.substring(4, 7)]).slice(-2);  // add 0 at start if less than 10
        const currentDate = ('0' + todayPK.substring(8, 10)).slice(-2);
        const currentYear = todayPK.substring(11, 15);
        const todayDate = currentYear + "-" + currentMonth + "-" + currentDate;

        const [schedules] = await Schedule.scheduleByDay(user[0].user_id, dayNumber, goal.goal_id, todayDate);
        if(schedules.length==0){
            return res.status(401).json({
                success: false,
                message: "rest day"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "tasks to do today",
            tasks: schedules
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.scheduleByDay = async(req, res) => {
    try{
        const dayNumber = req.params.day;
        const [user] = req.user;

        if(dayNumber == null || dayNumber < 1 || dayNumber > 7){
            return res.status(401).json({
                success: false,
                message: "Invalid try"
            });
        }

        const [schedules] = await Schedule.scheduleByDay(user[0].user_id, dayNumber);
        if(schedules.length==0){
            return res.status(401).json({
                success: false,
                message: "rest day"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "tasks to do on "+dayNumber+" day",
            tasks: schedules
        })
    }catch(error){
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.addSchedule = async(req, res) => {
    try{
        const [user] = req.user;
        const schedule = req.body;
        
        // check null
        if(schedule.day_no == null || schedule.start_time == null 
            || schedule.finish_time == null || schedule.category == null 
            || (schedule.diet_id == null && schedule.workout_plan_id == null)
            ){
            return res.status(500).json({
                success: false,
                message: "empty fields not allowed"
            });
        }

        const addedSchedule = await Schedule.addSchedule(user[0].user_id, schedule.day_no, schedule.start_time,
            schedule.finish_time, schedule.category);

        if(addedSchedule){
            const scheduleID = addedSchedule[0].insertId;

            if(schedule.diet_id == null){
                // add workout_plan_id
                const workoutAdd = await Schedule.attachWorkout(scheduleID, schedule.workout_plan_id);
                if(!workoutAdd){
                    await removeSchedule(scheduleID);
                    return res.status(401).json({
                        status: false,
                        message: "can't add schedule"
                    })
                }
            }

            if(schedule.workout_plan_id == null){
                // add diet_id
                const dietAdd = await Schedule.attachDiet(scheduleID, schedule.diet_id);
                if(!dietAdd){
                    await removeSchedule(scheduleID);
                    return res.status(401).json({
                        status: false,
                        message: "can't add schedule"
                    })
                }
            }
            return res.status(200).json({
                success: true,
                message: "schedule added"
            })
        }

        res.status(500).json({
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

exports.deleteSchedule = async(req, res) => {
    try{
        const [user] = req.user;
        const scheduleID = req.params.id;

        // delete workout
        await Schedule.removeWorkout(scheduleID);

        // delete diet
        await Schedule.removeDiet(scheduleID);

        const deletedSchedule = await Schedule.removeSchedule(scheduleID);

        if(deletedSchedule[0].affectedRows > 0){
            return res.status(200).json({
                success: true,
                message: "schedule deleted"
            });
        }

        res.status(500).json({
            success: false,
            message: "Not deleted"
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.updateTime = async(req, res) => {
    try{
        const schedule = req.body;

        if(schedule.schedule_id == null && schedule.start_time == null && schedule.finish_time == null)
            return res.status(401).json({
                success: false,
                message: "can't update with empty fields"
            })

        let updated = await Schedule.updateTime(schedule.schedule_id, schedule.start_time, schedule.finish_time);
        if(updated[0].affectedRows >0)
            return res.status(200).json({
                success: true,
                message: "updated successfully"
            })

        res.status(401).json({
            success: false,
            message: "can't update"
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}