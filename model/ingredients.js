const db = require('../config/database');

module.exports= class ingredientCategory{
    static addCategory(name){
        return db.execute(`INSERT INTO ingredients_category (name) VALUE (?)`, [name]);
    }

    static allCategories(){
        return db.execute(`SELECT * FROM ingredients_category`);
    }
}