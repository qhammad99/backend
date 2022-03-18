const Recipies = require('../model/recipies');

exports.myRecipies = async(req, res) => {
    try{
        const [user] = req.user;
        const [recipies] = await Recipies.myRecipies(user[0].user_id);
        
        if(recipies.length == 0){
            return res.status(500).json({
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
        const recipie = req.body;

        // check null
        if(recipie.name == null || recipie.calorie == null || recipie.ingredients.length == 0){
            return res.status(500).json({
                success: false,
                message: "empty fields not allowed"
            })
        }

        const addedRecipie = await Recipies.addRecipie(user[0].user_id, recipie.name, recipie.calorie);
        if(addedRecipie){
            const recipieId = addedRecipie[0].insertId;

            const ingredients = recipie.ingredients.map(ingredient =>[ingredient.id, recipieId, ingredient.qty]);

            const ingredientsAdded = await Recipies.attachIngredients(ingredients);
            if(ingredientsAdded)
                res.status(200).json({
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
                status:false,
                message: "No general recipies"
            });
        
        res.status(200).json({
            status: true,
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

exports.renameRecipie = async(req, res) => {
    // only update name because if we change ingredients then it will effect the progress.
    try{
        const [user] = req.user;
        const recipie = req.body;

        if(recipie.name == null)
        {
            return res.status(400).json({
                success:false,
                message: "Not shared name to update",
            });
        }

        // get recipie detail -- or -- check recipie exist or not
        const [getRecipie] = await Recipies.recipieByID(recipie.recipie_id);
        if(getRecipie.length == 0)
            return res.status(401).json({
                status:false,
                message: "recipie not found"
            });

        // if general recipie then add it for user first and new name of it
        if(getRecipie[0].user_id == 1 && user[0].user_id != 1){
            const added = await Recipies.addRecipie(user[0].user_id, recipie.name, getRecipie[0].calorie);
            if(added){
                const recipieId = added[0].insertId;

                const [ingredients] = await Recipies.getIngredients(recipie.recipie_id);
                if (!ingredients.length == 0) {
                    const addIngredients = ingredients.map(ingredient =>[ingredient.id, recipieId, ingredient.qty]);
                    const ingredientsAdded = await Recipies.attachIngredients(addIngredients);
                    if(!ingredientsAdded)
                        return res.status(500).json({
                            success: false,
                            message: "ingredients Not added"
                        })
                }
            }
        }

        if(user[0].user_id != getRecipie[0].user_id){
            return res.status(401).json({
                success:false,
                message: "can't rename recipie of others"
            });
        }
        
        const rename = await Recipies.updateName(recipie.recipie_id, recipie.name);
        if(rename[0].affectedRows == 0){
            return res.status(401).json({
                success:false,
                message: "recipie not renamed"
            });
        }

        res.status(200).json({
            success: true,
            message: "renamed"
        });
    }catch(error){
        res.status(500).json({
            success: false,
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