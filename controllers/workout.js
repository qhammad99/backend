const Workout = require('../model/workout');

exports.findByID = async(req, res) => {
    try{
        const id = req.params.id; 
        const [workout] = await Workout.workoutByID(id);
        
        if(workout.length == 0){
            return res.status(400).json({
                success:false,
                message: "No workouts to show",
            });   
        }

        res.status(200).json({
            success:true,
            message: "workout",
            workouts: workout[0]            
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
        const [workouts] = await Workout.workoutByCategory(category);
        
        if(workouts.length == 0){
            return res.status(400).json({
                success:false,
                message: "No workouts to show",
            });   
        }

        res.status(200).json({
            success:true,
            message: "workouts",
            workouts: workouts            
        }); 

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })        
    }
}

exports.addWorkout = async(req, res) => {
    try{
        const workout = req.body;
        if(workout.category == null || workout.number_of_sets == null || workout.repititions == null || workout.calorie == null || workout.name == null)
            return res.status(400).json({
                success:false,
                message: "Must fill all fiels",
            });

        const added = await Workout.addWorkout(workout.category, workout.name, workout.number_of_sets, workout.repititions, workout.calorie);
        
        if(added){
            return res.status(201).json({
                success:true,
                message: "workout added successful",
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

exports.showWorkouts = async(req, res) =>{
    try{
        const [workouts] = await Workout.allWorkouts();
        
        if(workouts.length == 0){
            return res.status(400).json({
                success:false,
                message: "No workouts to show",
            });   
        }

        res.status(200).json({
            success:true,
            message: "workouts",
            workouts: workouts            
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

        const added = await Workout.addCategory(category.name);
        
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
        const [categories] = await Workout.allCategories();
        
        if(categories.length == 0){
            return res.status(400).json({
                success:false,
                message: "No categories to show",
            });   
        }

        res.status(200).json({
            success:true,
            message: "workout Categories",
            category: categories            
        }); 
    }catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}