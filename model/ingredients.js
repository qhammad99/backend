const db = require('../config/database');

module.exports= class ingredientCategory{
    static ingredientByID(id){
        return db.execute(`SELECT 
            ingredients.id, 
            ingredients.name, 
            ingredients.price, 
            ingredients.weight, 
            ingredients.calories, 
            ingredients_category.name AS category
            
            FROM ingredients 
            JOIN ingredients_category ON ingredients.category = ingredients_category.id 
            WHERE ingredients.id = ?`, [id]);
    }

    static ingredientByCategory(category){
        return db.execute(`SELECT 
            ingredients.id, 
            ingredients.name, 
            ingredients.price, 
            ingredients.weight, 
            ingredients.calories, 
            ingredients_category.name AS category
        
            FROM ingredients 
            JOIN ingredients_category ON ingredients.category = ingredients_category.id
            WHERE ingredients.category = ?`, [category]);
    }

    static addIngredient(image, category, name, price, calories, weight){
        return db.execute(`INSERT INTO ingredients (category, name, price, calories, weight, image) VALUES (?, ?, ?, ?, ?, ?)`,[
            category, name, price, calories, weight, image]);
    }

    static allIngredients(){
        return db.execute(`SELECT 
            ingredients.id, 
            ingredients.name, 
            ingredients.price, 
            ingredients.weight, 
            ingredients.calories, 
            ingredients.image,
            ingredients_category.name AS category
            
            FROM ingredients 
            JOIN ingredients_category ON ingredients.category = ingredients_category.id`);
    }

    static addCategory(name){
        return db.execute(`INSERT INTO ingredients_category (name) VALUE (?)`, [name]);
    }

    static allCategories(){
        return db.execute(`SELECT * FROM ingredients_category`);
    }

    static updatePrice(id, price){
        return db.execute(`UPDATE ingredients SET price = ? WHERE id = ?`,[price, id]);
    }
}