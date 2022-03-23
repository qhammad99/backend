const db = require('../config/database');

module.exports = class Recipies{
    static generalRecipies(){
        return db.execute(`SELECT * FROM recipie WHERE user_id = 1`);
    }

    static myRecipies(user_id){
        return db.execute(`SELECT * FROM recipie WHERE user_id = ?`, [user_id]);
    }

    static userRecipies(user_id){
        return db.execute(`SELECT * FROM recipie WHERE user_id = ?`, [user_id]);
    }

    static recipieByID(recipie_id){
        return db.execute(`SELECT * FROM recipie WHERE recipie_id = ?`, [recipie_id]);
    }

    static addRecipie(user_id, name, calorie){
        return db.execute(`INSERT INTO recipie (user_id, name, calorie) VALUES (?, ?, ?)`, [user_id, name, calorie]);
    }

    static attachIngredients(rowsData){
        return db.query('INSERT INTO `ingredient_recipie` (`ingredient_id`, `recipie_id`, `quantity`) VALUES ?', [rowsData]);
    }

    static getIngredients(recipie_id){
        return db.execute(`SELECT 
            ingredients.id, 
            ingredients_category.name as category, 
            ingredients.price, 
            ingredients.calories, 
            ingredients.weight, 
            ingredient_recipie.quantity
            
            FROM ingredients 
            JOIN ingredients_category ON ingredients.category = ingredients_category.id
            JOIN ingredient_recipie ON ingredients.id = ingredient_recipie.ingredient_id
            WHERE ingredient_recipie.recipie_id = ?
            ORDER BY ingredients.id`, [recipie_id]);
    }
}