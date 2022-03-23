const db = require('../config/database');

module.exports = class Schedule{
    static scheduleByDay(user_id, dayNumber, goal_id, date){
        return db.execute(`SELECT * FROM(
            (
                SELECT schedule.schedule_id, schedule.start_time, schedule.finish_time, schedule.category,
                diet_plan.diet_id as dietID, diet_plan.name as dietName, 
                NULL as workoutID, NULL as workoutName,
                NULL AS extraID, NULL AS extraName  
                FROM schedule
                    JOIN diet_schedule ON diet_schedule.schedule_id = schedule.schedule_id
                    JOIN diet_plan     ON diet_plan.diet_id = diet_schedule.diet_id
                WHERE schedule.user_id = ? AND schedule.day_no = ?
            )        
                UNION
            (
                SELECT schedule.schedule_id, schedule.start_time, schedule.finish_time, schedule.category,
                NULL as dietID, NULL as dietName,
                workout_plan.workout_plan_id as workoutID, workout_plan.name as workoutName,
                NULL AS extraID, NULL AS extraName  
                FROM schedule
                    JOIN workout_schedule ON workout_schedule.schedule_id = schedule.schedule_id
                    JOIN workout_plan     ON workout_plan.workout_plan_id = workout_schedule.workout_plan_id
                WHERE schedule.user_id = ? AND schedule.day_no = ?
            )
                UNION
                (
                    SELECT 'Done' as schedule_id, diet_progress.start_time, diet_progress.finish_time,
                    'Diet' as category,
                    diet_plan.diet_id as dietID, diet_plan.name as dietName, 
                    NULL as workoutID, NULL as workoutName,
                    NULL AS extraID, NULL AS extraName  
                    FROM diet_progress
                        JOIN progress ON diet_progress.progress_id = progress.id
                        JOIN diet_plan     ON diet_plan.diet_id = diet_progress.diet_id
                    WHERE progress.goal_id = ? AND progress.day_date = ?
                )        
                    UNION
                (
                    SELECT 'Done' as schedule_id, workout_progress.start_time, workout_progress.finish_time,
                    'Workout' as category,
                    NULL as dietID, NULL as dietName,
                    workout_plan.workout_plan_id as workoutID, workout_plan.name as workoutName,
                    NULL AS extraID, NULL AS extraName  
                    FROM workout_progress
                        JOIN progress ON workout_progress.progress_id = progress.id
                        JOIN workout_plan     ON workout_plan.workout_plan_id = workout_progress.workout_plan_id
                    WHERE progress.goal_id = ? AND progress.day_date = ?
                )
                    UNION
                (
                    SELECT 'Extra' as schedule_id, NULL AS start_time, NULL AS finish_time,
                    extra_task.category AS category,
                    NULL AS dietID, NULL AS dietName,
                    NULL AS workoutID, NULL AS workoutName,
                    extra_task.id AS extraID, extra_task.name AS extraName 
                    FROM extra_progress
                        JOIN progress ON extra_progress.progress_id = progress.id
                        JOIN extra_task ON extra_task.id = extra_progress.extra_id
                    WHERE progress.goal_id = ? AND progress.day_date = ?
                )
        ) AS task
            order by task.start_time`
        , [user_id, dayNumber, user_id, dayNumber, goal_id, date, goal_id, date, goal_id, date]);
    }

    static addSchedule(user_id, day_no, start_time, finish_time, category, level){
        return db.execute(`INSERT INTO schedule (user_id, day_no, start_time, finish_time, category, level) 
        VALUES (?, ?, ?, ?, ?, ?)`, [user_id, day_no, start_time, finish_time, category, level]);
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