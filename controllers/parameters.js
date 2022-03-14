const Parameters = require('../model/parameters.js');

exports.add = async (req, res) => {
    try{
        const [user]= req.user;
        const parameters = req.body;
        if(parameters.height == null || parameters.weight == null || parameters.dob == null || parameters.gender == null)
            return res.status(400).json({
                success:false,
                message: "Please Fill all Fields",
            });
        
        const added = await Parameters.addParameters(user[0].user_id, parameters.height, parameters.weight, parameters.dob, parameters.gender);
        
        if(added)
            return res.status(201).json({
                success:true,
                message: "Parameters added successful",
            });
        else
            res.status(500).json({message:"Server Error 2"})
            
    }catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.myParameters = async(req, res) =>{
    try{
        const [user]= req.user;
        
        const [parameters] = await Parameters.getParameters(user[0].user_id);
        if(parameters.length != 0)
            return res.status(201).json({
                success:true,
                message: "Parameters found",
                parameters: parameters[0]
            });
        else
            res.status(500).json({
                success:false,
                message:"Parameters not found"
            })
            
    }catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    } 
}

exports.update = async(req, res) => {
    try {
        const [user]= req.user;
        const parameters = req.body;
        let updated; // to check is any row affected by update or not
        
    
        if(parameters.height == null && parameters.weight == null && parameters.dob == null && parameters.gender == null)
            return res.status(400).json({
                success:false,
                message: "Not shared data to update",
        });

        if(parameters.height)
            updated = await Parameters.updateHeight(user[0].user_id, parameters.height);

        if(parameters.weight)
            updated = await Parameters.updateWeight(user[0].user_id, parameters.weight);
    
        if(parameters.dob)
            updated = await Parameters.updateDOB(user[0].user_id, parameters.dob);
        
        if(parameters.gender)
            updated = await Parameters.updateGender(user[0].user_id, parameters.gender);
        
        if(updated.affectedRows == 0)
            return res.status(401).json({
                success:false,
                message: "Parameters not found"
            });
        
        res.status(200).json({
            success:true,
            message:"updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }

}

exports.findParameters = async(req, res) =>{
    try{
        const id= req.params.id;
        
        const [parameters] = await Parameters.getParameters(id);
        if(parameters.length != 0)
            return res.status(201).json({
                success:true,
                message: "Parameters found",
                parameters: parameters[0]
            });
        else
            res.status(500).json({
                success:false,
                message:"Parameters not found"
            })
            
    }catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}