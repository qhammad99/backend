const db = require('../config/database');

module.exports= class workoutCategory{
    static workoutByID(id){
        return db.execute(`SELECT 
            workouts.id, 
            workouts.name, 
            workouts.number_of_sets, 
            workouts.repititions, 
            workouts.calorie, workout_category.name AS category
            
            FROM workouts 
            JOIN workout_category ON workouts.category = workout_category.id 
            WHERE workouts.id = ?`, [id]);
    }

    static workoutByCategory(category){
        return db.execute(`SELECT workouts.id, workouts.name, workouts.number_of_sets, workouts.repititions, workouts.calorie, workout_category.name AS category
        FROM workouts JOIN workout_category ON workouts.category = workout_category.id WHERE workouts.category = ?`, [category]);
    }

    static addWorkout(category, name, sets, repititions, calorie){
        return db.execute(`INSERT INTO workouts (category, name, number_of_sets, repititions, calorie) VALUES (?, ?, ?, ?, ?)`, 
        [category, name, sets, repititions, calorie]);
    }

    static allWorkouts(){
        return db.execute(`SELECT 
            workouts.id, 
            workouts.name, 
            workouts.number_of_sets, 
            workouts.repititions, 
            workouts.calorie,
            workout_category.name AS category
        
            FROM workouts 
            JOIN workout_category ON workouts.category = workout_category.id`);
    }

    static addCategory(name){
        return db.execute(`INSERT INTO workout_category (name) VALUE (?)`, [name]);
    }

    static allCategories(){
        return db.execute(`SELECT * FROM workout_category`);
    }
}