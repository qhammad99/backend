const db = require('../config/database');

module.exports= class workoutCategory{
    static addCategory(name){
        return db.execute(`INSERT INTO workout_category (name) VALUE (?)`, [name]);
    }

    static allCategories(){
        return db.execute(`SELECT * FROM workout_category`);
    }
}