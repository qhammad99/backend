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

    static addSchedule(user_id, day_no, start_time, finish_time, category){
        return db.execute(`INSERT INTO schedule (user_id, day_no, start_time, finish_time, category) 
        VALUES (?, ?, ?, ?, ?)`, [user_id, day_no, start_time, finish_time, category]);
    }

    static removeSchedule(schedule_id){  //unlinked with other tables
        return db.execute(`DELETE FROM schedule WHERE schedule_id = ?`, [schedule_id]);
    }

    static attachWorkout(schedule_id, workout_plan_id){
        return db.execute(`INSERT INTO workout_schedule (schedule_id, workout_plan_id) 
        VALUES (?, ?)`, [schedule_id, workout_plan_id]);
    }

    static attachDiet(schedule_id, diet_id){
        return db.execute(`INSERT INTO diet_schedule (schedule_id, diet_id) 
        VALUES (?, ?)`, [schedule_id, diet_id]);
    }

    static removeWorkout(schedule_id){
        return db.execute(`DELETE FROM workout_schedule WHERE schedule_id = ?`, [schedule_id]);
    }

    static removeDiet(schedule_id){
        return db.execute(`DELETE FROM diet_schedule WHERE schedule_id = ?`, [schedule_id]);
    }

    static updateTime(schedule_id, start_time, finish_time){
        return db.execute(`UPDATE schedule SET start_time = ?, finish_time = ? 
        WHERE schedule_id = ?`, [start_time, finish_time, schedule_id]);
    }
}