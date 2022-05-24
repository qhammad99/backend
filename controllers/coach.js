const Coach = require('../model/coach.js');

exports.coachUsersSubscribed = async (req, res) => {
    
    try{
        // const [user]= req.coachId;
        const userObj = req.body;
        const [coachs] = await Coach.coachSubscribedUsers(userObj.coachId);
    
        if(coachs.length == 0)
        {
            return res.status(401).json({
                success:false,
                message: "No Users available"
            });
        }

        res.status(200).json({
            success:true,
            message: "Available users",
            coachs: coachs
        });
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}
exports.availableCoachs = async (req, res) => {
    try{
        const [coachs] = await Coach.availableCoach();
    
        if(coachs.length == 0)
        {
            return res.status(401).json({
                success:false,
                message: "No Coach available"
            });
        }

        res.status(200).json({
            success:true,
            message: "Available coachs",
            coachs: coachs
        });
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}


exports.coachDetail = async (req, res) => {
    try{
        const [user]= req.user;
        const [coachDetail] = await Coach.coachDetail(user[0].user_id);
    
        if(coachDetail.length == 0)
        {
            return res.status(401).json({
                success:false,
                message: "No Coach available"
            });
        }

        res.status(200).json({
            success:true,
            message: "coach detail",
            coach: coachDetail[0]
        });
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}

exports.coachClients = async (req, res) => {
    try{
        const [user]= req.user;
        let [coachClients] = await Coach.coachClients(user[0].user_id);
    
        if(coachClients.length == 0)
        {
            return res.status(401).json({
                success:false,
                message: "No Clients"
            });
        }

        let expiryDate;
        let nowDate = new Date();

        coachClients = coachClients.map((item)=>{
            expiryDate = new Date(item.payment_expiry);
            if(expiryDate < nowDate)
                item.expired = true;
            else    
                item.expired = false;

            return item;
        })

        res.status(200).json({
            success:true,
            message: "coach clients",
            clients: coachClients
        });
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}

exports.coachInfoByID = async (req, res) => {
    try{
        const coach_id = req.params.id;
        const [coachDetail] = await Coach.coachDetail(coach_id);
    
        if(coachDetail.length == 0)
        {
            return res.status(401).json({
                success:false,
                message: "No Coach found"
            });
        }

        res.status(200).json({
            success:true,
            message: "coach detail",
            coach: coachDetail[0]
        });
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}

exports.addCoachInfo = async (req, res) => {
    try{
        const [user] = req.user;
        const coach = req.body;

        if(!coach.charges || !coach.joining_date || !coach.coaching_experience || !coach.account_number){
            return res.status(401).json({
                success:false,
                message: "can't add empty fields"
            });
        }

        const insertion = await Coach.coachAdd(
            user[0].user_id, 
            coach.charges, 
            coach.joining_date,
            coach.coaching_experience,
            coach.account_number
            );

        if(insertion){
            res.status(200).json({
                success:true,
                message: "coach inserted",
                coach: coach 
            });
        }else
            res.status(500).json({message:"Server Error 2"})

    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }   
}

exports.coachFindByName = async (req, res) => {
    try{
        const name = req.params.name;
        const [coachList] = await Coach.coachByName(name);
        
        if(coachList.length == 0)
        {
            return res.status(401).json({
                success:false,
                message: "No Coach found"
            });
        }

        res.status(200).json({
            success:true,
            message: "coach list",
            coach: coachList[0]
        });
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}

exports.changeStatus = async(req, res) => {
    try {
        const [user]= req.user;
        const [coachDetail] = await Coach.coachDetail(user[0].user_id);
        const {availability} = coachDetail[0];

        let updated; // to check is any row affected by update or not
        if(availability == 1)
            updated = await Coach.changeStatus(user[0].user_id, 0);
        else if (availability == 0)
            updated = await Coach.changeStatus(user[0].user_id, 1);
        
        if(updated[0].affectedRows == 0)
            return res.status(401).json({
                success:false,
                message: "User not found"
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