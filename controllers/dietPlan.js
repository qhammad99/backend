const DietPlan = require('../model/dietPlan');

exports.myDietPlans = async(req, res) => {
    try{
        const [user] = req.user;
        const [diets] = await DietPlan.myDietPlans(user[0].user_id);
        
        if(diets.length == 0){
            return res.status(500).json({
                success: false,
                message: "You don't have your any own diet plan",
            })
        }

        res.status(200).json({
            success: true,
            message:"My diet plans",
            dietPlans: diets
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.dietPlanByID = async(req, res) => {
    try{
        const [diet] = await DietPlan.dietPlanByID(req.params.id);

        if(diet.length == 0)
            return res.status(401).json({
                status:false,
                message: "diet plan not found"
            });
        
        res.status(200).json({
            status: true,
            message: "diet plan by id",
            dietPlan: diet
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }    
}

exports.addDietPlan = async(req, res) => {
    try{
        const [user] = req.user;
        const dietPlan = req.body;

        // check null
        if(dietPlan.name == null || dietPlan.recipies.length == 0){
            return res.status(500).json({
                success: false,
                message: "empty fields not allowed"
            })
        }

        const addedPlan = await DietPlan.addDietPlan(user[0].user_id, dietPlan.name);
        if(addedPlan){
            const dietID = addedPlan[0].insertId;

            const recipies = dietPlan.recipies.map(recipies =>[recipies.id, dietID]);

            const recipiesAdded = await DietPlan.attachRecipies(recipies);
            if(recipiesAdded)
                return res.status(200).json({
                    success: true,
                    message: "Diet Plan added"
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

exports.generalDietPlan = async(req, res) => {
    try{
        const [dietPlans] = await DietPlan.generalDietPlans();

        if(dietPlans.length == 0)
            return res.status(401).json({
                success:false,
                message: "No general diet plans"
            });
        
        res.status(200).json({
            success: true,
            message: "general diet plans",
            dietPlans: dietPlans
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.dietPlansByUserID = async(req, res) => {
    try{
        const [dietPlans] = await DietPlan.userDietPlans(req.params.id);
        
        if(dietPlans.length == 0){
            return res.status(401).json({
                success: false,
                message: "No diet plan found for that user",
            })
        }

        res.status(200).json({
            success: true,
            message:"diet plans by user id",
            dietPlans: dietPlans
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.dietPlanRecipies = async(req, res) => {
    try{
        const id = req.params.id;
        const [recipies] = await DietPlan.getRecipies(id);
        
        if(recipies.length == 0){
            return res.status(401).json({
                success: false,
                message: "no recipies"
            });
        }
        res.status(200).json({
            success: true,
            message: "Recipies of a diet plan",
            recipies: recipies
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}