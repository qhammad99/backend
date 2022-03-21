const db = require('../config/database');

module.exports = class WorkoutPlan{
    static generalWorkoutPlans(){
        return db.execute(`SELECT * FROM workout_plan WHERE user_id = 1`);
    }

    static myWorkoutPlans(user_id){
        return db.execute(`SELECT * FROM workout_plan WHERE user_id = ?`, [user_id]);
    }

    static userWorkoutPlans(user_id){
        return db.execute(`SELECT * FROM workout_plan WHERE user_id = ?`, [user_id]);
    }

    static workoutPlanByID(worout_plan_id){
        return db.execute(`SELECT * FROM workout_plan WHERE workout_plan_id = ?`, [worout_plan_id]);
    }

    static addWorkoutPlan(user_id, name){
        return db.execute(`INSERT INTO workout_plan (user_id, name) VALUES (?, ?)`, [user_id, name]);
    }

    static attachWorkouts(rowsData){
        return db.query('INSERT INTO `workout_planning` (`workouts_id`, `workout_plan_id`) VALUES ?', [rowsData]);
    }

    static getWorkouts(workout_plan_id){
        return db.execute(`SELECT 
            workouts.id, 
            workouts.name, 
            workouts.calorie
            FROM workouts 
            JOIN workout_planning ON workouts.id = workout_planning.workouts_id
            WHERE workout_planning.workout_plan_id = ?
            ORDER BY workouts.id`, [workout_plan_id]);
    }
}