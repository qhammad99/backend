const db = require('../config/database');

module.exports = class DietPlan{
    static generalDietPlans(){
        return db.execute(`SELECT * FROM diet_plan WHERE user_id = 1`);
    }

    static myDietPlans(user_id){
        return db.execute(`SELECT * FROM diet_plan WHERE user_id = ?`, [user_id]);
    }

    static userDietPlans(user_id){
        return db.execute(`SELECT * FROM diet_plan WHERE user_id = ?`, [user_id]);
    }

    static dietPlanByID(diet_id){
        return db.execute(`SELECT * FROM diet_plan WHERE diet_id = ?`, [diet_id]);
    }

    static addDietPlan(user_id, name){
        return db.execute(`INSERT INTO diet_plan (user_id, name) VALUES (?, ?)`, [user_id, name]);
    }

    static attachRecipies(rowsData){
        return db.query('INSERT INTO `recipie_diet` (`recipie_id`, `diet_id`) VALUES ?', [rowsData]);
    }

    static getRecipies(diet_id){
        return db.execute(`SELECT recipie.recipie_id, recipie.name, recipie.calorie 
            FROM recipie 
            JOIN recipie_diet ON recipie.recipie_id = recipie_diet.recipie_id
            WHERE recipie_diet.diet_id = ?
            ORDER BY recipie.recipie_id`, [diet_id]);
    }
}