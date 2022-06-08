const { json } = require('express/lib/response');
const Recipies = require('../model/recipies');

exports.myRecipies = async(req, res) => {
    try{
        const [user] = req.user;
        const [recipies] = await Recipies.myRecipies(user[0].user_id);
        
        if(recipies.length == 0){
            return res.status(200).json({
                success: false,
                message: "You don't have your any own recipie",
            })
        }

        res.status(200).json({
            success: true,
            message:"My recipies",
            recipies: recipies
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.recipieByID = async(req, res) => {
    try{
        const [recipie] = await Recipies.recipieByID(req.params.id);

        if(recipie.length == 0)
            return res.status(401).json({
                status:false,
                message: "recipie not found"
            });
        
        res.status(200).json({
            status: true,
            message: "recipie by id",
            recipies: recipie
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }    
}

exports.addRecipie = async(req, res) => {
    try{
        const [user] = req.user;
        const {name, calorie, ingredients} = req.body;
        const new_ingrediets= ingredients.map(ing=> JSON.parse(ing));

        // check null
        if(!req.file || name == null || calorie == null || ingredients.length == 0){
            return res.status(500).json({
                success: false,
                message: "empty fields not allowed"
            })
        }

        const addedRecipie = await Recipies.addRecipie(user[0].user_id, name, calorie, req.file.filename);
        if(addedRecipie){
            const recipieId = addedRecipie[0].insertId;

            const modified_ingredients = new_ingrediets.map(ingredient =>[ingredient.id, recipieId, ingredient.qty]);

            const ingredientsAdded = await Recipies.attachIngredients(modified_ingredients);
            if(ingredientsAdded)
                return res.status(200).json({
                    success: true,
                    message: "Recipie added"
                })
        }

        res.status(500).json({
            success: false,
            message: "Not added"
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.generalRecipies = async(req, res) => {
    try{
        const [recipies] = await Recipies.generalRecipies();

        if(recipies.length == 0)
            return res.status(401).json({
                success:false,
                message: "No general recipies"
            });
        
        res.status(200).json({
            success: true,
            message: "general recipies",
            recipies: recipies
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.recipiesByUserID = async(req, res) => {
    try{
        const [recipies] = await Recipies.userRecipies(req.params.id);
        
        if(recipies.length == 0){
            return res.status(500).json({
                success: false,
                message: "No recipie found for that user",
            })
        }

        res.status(200).json({
            success: true,
            message:"recipies by user id",
            recipies: recipies
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.recipieIngredients = async(req, res) => {
    try{
        const id = req.params.id;
        // console.log(id);
        const [ingredients] = await Recipies.getIngredients(id);
        
        if(ingredients.length == 0){
            return res.status(500).json({
                success: false,
                message: "no ingredients"
            });
        }
        res.status(200).json({
            success: true,
            message: "Ingredients of a recipie",
            ingredients: ingredients
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}