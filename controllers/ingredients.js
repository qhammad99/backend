const Ingredients = require('../model/ingredients');

exports.findByID = async(req, res) => {
    try{
        const id = req.params.id; 
        const [ingredient] = await Ingredients.ingredientByID(id);
        
        if(ingredient.length == 0){
            return res.status(400).json({
                success:false,
                message: "No ingredients to show",
            });   
        }

        res.status(400).json({
            success:true,
            message: "ingredient",
            ingredients: ingredient[0]            
        }); 

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })        
    }
}

exports.findByCategory= async(req, res) => {
    try{
        const category = req.params.category; 
        const [ingredients] = await Ingredients.ingredientByCategory(category);
        
        if(ingredients.length == 0){
            return res.status(400).json({
                success:false,
                message: "No ingredients to show",
            });   
        }

        res.status(400).json({
            success:true,
            message: "ingredients",
            ingredients: ingredients            
        }); 

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })        
    }
}

exports.addIngredient = async(req, res) => {
    try{
        const {category, name, price, calories, weight} = req.body;

        if(!req.file || !category || !name || !price || !calories || !weight)
            return res.status(400).json({
                success:false,
                message: "Must fill all fiels",
            });

        const added = await Ingredients.addIngredient(req.file.filename, category, name, price, calories, weight);
        
        if(added){
            return res.status(201).json({
                success:true,
                message: "ingredient added successful",
                id: added[0].insertId,
                image: req.file.filename
            });   
        }else
            res.status(500).json({message:"Server Error 2"})
            
    }catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.showIngredients = async(req, res) =>{
    try{
        const [ingredients] = await Ingredients.allIngredients();
        
        if(ingredients.length == 0){
            return res.status(400).json({
                success:false,
                message: "No ingredients to show",
            });   
        }

        res.status(200).json({
            success:true,
            message: "ingredients",
            ingredients: ingredients            
        }); 
    }catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.addCategory = async(req, res) => {
    try{
        const category = req.body;
        if(category.name == null)
            return res.status(400).json({
                success:false,
                message: "Name of category is required",
            });

        const added = await Ingredients.addCategory(category.name);
        
        if(added){
            return res.status(201).json({
                success:true,
                message: "category added successful",
            });   
        }else
            res.status(500).json({message:"Server Error 2"})
            
    }catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.showCategories = async(req, res) =>{
    try{
        const [categories] = await Ingredients.allCategories();
        
        if(categories.length == 0){
            return res.status(400).json({
                success:false,
                message: "No categories to show",
            });   
        }

        res.status(200).json({
            success:true,
            message: "ingredients Categories",
            category: categories            
        }); 
    }catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updatePrice = async(req, res) => {
    try {
        const details = req.body;

        let updated; // to check is any row affected by update or not

        if (!details.id && !details.newPrice)
            return res.status(400).json({
                success: false,
                message: "Not shared data to update",
            });

        updated = await Ingredients.updatePrice(details.id, details.price);
        
        if (updated[0].affectedRows == 0)
            return res.status(401).json({
                success: false,
                message: "ingredient not found"
            });

        res.status(200).json({
            success: true,
            message: "updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}