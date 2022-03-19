const db = require('../config/database');

module.exports = class Schedule{
    static scheduleByDay(user_id, dayNumber){
        return db.execute(`SELECT * FROM(
            (
                SELECT schedule.schedule_id, schedule.start_time, schedule.finish_time, schedule.category,
                diet_plan.diet_id as dietID, diet_plan.name as dietName, 
                NULL as workoutID, NULL as workoutName 
                FROM schedule
                    JOIN diet_schedule ON diet_schedule.schedule_id = schedule.schedule_id
                    JOIN diet_plan     ON diet_plan.diet_id = diet_schedule.diet_id
                WHERE schedule.user_id = ? AND schedule.day_no = ?
            )        
                UNION
            (
                SELECT schedule.schedule_id, schedule.start_time, schedule.finish_time, schedule.category,
                NULL as dietID, NULL as dietName,
                workout_plan.workout_plan_id as workoutID, workout_plan.name as workoutName 
                FROM schedule
                    JOIN workout_schedule ON workout_schedule.schedule_id = schedule.schedule_id
                    JOIN workout_plan     ON workout_plan.workout_plan_id = workout_schedule.workout_plan_id
                WHERE schedule.user_id = ? AND schedule.day_no = ?
            )
        ) AS task
            order by task.start_time`
        , [user_id, dayNumber, user_id, dayNumber]);
    }

}