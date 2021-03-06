const db = require('../config/database.js');

module.exports = class userGoal{
    static addGoal(user_id, start_date, number_of_days, target_type, target_value, difficulty){
        return db.execute(`INSERT INTO goal (user_id, start_date, number_of_days, target_type, target_value, difficulty) VALUES (?, ?, ?, ?, ?, ?)`, 
        [user_id, start_date, number_of_days, target_type, target_value, difficulty]);
    }

    static goalFlag(id, flag){
        return db.execute(`UPDATE user SET isGoal= ? WHERE user_id = ?`, [flag, id]);
    }

    static removeGoal(user_id){
        return db.execute(`DELETE FROM goal WHERE user_id = ?`, [user_id]);
    }

    static verifyGoal(user_id, goalID){
        return db.execute( `SELECT * from goal where user_id = ? AND id= ?`, [user_id, goalID]);
    }

    static currentGoal(user_id){
        return db.execute( `SELECT * FROM goal WHERE user_id = ? AND status = ?`, [user_id, 'inProgress']);
    }

    static findGoal(goal_id){
        return db.execute( `SELECT * FROM goal WHERE id = ?`, [goal_id]);
    }

    static updateStatus(goalID){
        return db.execute(`UPDATE goal SET status= ? WHERE id = ?`, ['completed', goalID]);
    }

    static completedGoal(user_id){
        return db.execute(`SELECT COUNT(*) AS GOALS FROM goal WHERE status = ? AND user_id = ?`, ['completed', user_id]);
    }

    static copySchedule(user_id, level){
        return db.execute(`INSERT INTO schedule(user_id, day_no, start_time, finish_time, category, image)
        SELECT ? AS user_id, day_no, start_time, finish_time, category, image
        FROM schedule
        WHERE user_id = 1 AND level = ?`, [user_id, level]);
    }

    static scheduleByUser(user_id){
        return db.execute(`SELECT schedule_id, category FROM schedule WHERE user_id = ?`, [user_id]);
    }

    static copyScheduleIDdiet(user_id){
        return db.execute(`INSERT INTO diet_schedule(schedule_id)
        SELECT schedule.schedule_id FROM schedule
        WHERE schedule.user_id = ? AND schedule.category = 'Diet'`, [user_id]);
    }

    static copyDiets(level){
        return db.execute(`SELECT diet_schedule.diet_id AS id from diet_schedule
            JOIN schedule ON schedule.schedule_id = diet_schedule.schedule_id 
            AND schedule.user_id = 1 AND schedule.level = ?`,[level]);
    }

    static updateDietID(diet_id, schedule_id){
        return db.execute(`UPDATE diet_schedule SET diet_id = ?
        WHERE schedule_id = ?`,[diet_id, schedule_id]);
    }

    static copyScheduleIDworkout(user_id){
        return db.execute(`INSERT INTO workout_schedule(schedule_id)
        SELECT schedule.schedule_id FROM schedule
        WHERE schedule.user_id = ? AND schedule.category = 'Workout'`, [user_id]);
    }

    static copyWorkouts(level){
        return db.execute(`SELECT workout_schedule.workout_plan_id AS id from workout_schedule
            JOIN schedule ON schedule.schedule_id = workout_schedule.schedule_id 
            AND schedule.user_id = 1 AND schedule.level = ?`,[level]);
    }

    static updateWorkoutID(workout_plan_id, schedule_id){
        return db.execute(`UPDATE workout_schedule SET workout_plan_id = ?
            WHERE schedule_id = ?`,[workout_plan_id, schedule_id]);
    }
};