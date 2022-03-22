const db = require('../config/database');

module.exports = class Progress{
    static tasksDetails(id){
        return db.execute(`SELECT * FROM(
            (
                SELECT diet_progress.start_time, diet_progress.finish_time,
                'Diet' AS category,
                diet_plan.diet_id AS dietID, diet_plan.name AS dietName, 
                NULL AS workoutID, NULL AS workoutName 
                FROM diet_progress
                    JOIN progress ON diet_progress.progress_id = progress.id
                    JOIN diet_plan     ON diet_plan.diet_id = diet_progress.diet_id
                WHERE progress.id = ?
            )        
                UNION
            (
                SELECT workout_progress.start_time, workout_progress.finish_time,
                'Workout' AS category,
                NULL AS dietID, NULL AS dietName,
                workout_plan.workout_plan_id AS workoutID, workout_plan.name AS workoutName 
                FROM workout_progress
                    JOIN progress ON workout_progress.progress_id = progress.id
                    JOIN workout_plan     ON workout_plan.workout_plan_id = workout_progress.workout_plan_id
                WHERE progress.id = ?
            )
        ) AS task
            order by task.start_time`, [id, id]);
    }


    static getByDate(date){
        return db.execute(`SELECT * FROM progress WHERE day_date = ?`, [date]);
    }

    static addProgressWorkout(goal_id, day_no, day_date, calories_burn){
        return db.execute(`INSERT INTO progress (goal_id, day_no, day_date, calories_burn, calories_gain) VALUES (?, ?, ?, ?, ?)`, 
        [goal_id, day_no, day_date, calories_burn, 0]);
    }

    static addProgressDiet(goal_id, day_no, day_date, calories_gain){
        return db.execute(`INSERT INTO progress (goal_id, day_no, day_date, calories_burn, calories_gain) VALUES (?, ?, ?, ?, ?)`, 
        [goal_id, day_no, day_date, 0, calories_gain]);
    }

    static updateCalorieBurn(calorie, progress_id){
        return db.execute(`UPDATE progress SET calories_burn = ? WHERE id = ?`, [calorie, progress_id]);
    }

    static updateCalorieGain(calorie, progress_id){
        return db.execute(`UPDATE progress SET calories_gain = ? WHERE id = ?`, [calorie, progress_id]);
    }

    static attachWorkout(progress_id, workout_plan_id, start_time, finish_time){
        return db.execute(`INSERT INTO workout_progress VALUES (?, ?, ?, ?)`, 
            [progress_id, workout_plan_id, start_time, finish_time]);
    }

    static attachDiet(progress_id, diet_id, start_time, finish_time){
        return db.execute(`INSERT INTO diet_progress VALUES (?, ?, ?, ?)`, 
            [progress_id, diet_id, start_time, finish_time]);
    }

    static findByDay(goal_id, day_no){
        return db.execute(`SELECT * FROM progress WHERE goal_id = ? AND day_no = ?`, [goal_id, day_no]);
    }

    static findByDate(goal_id, date){
        return db.execute(`SELECT * FROM progress WHERE goal_id = ? AND day_date = ?`, [goal_id, date]);
    }
};