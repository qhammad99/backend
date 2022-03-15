const Ingredients = require('../model/ingredients');

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
                message: "Parameters added successful",
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

        res.status(400).json({
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