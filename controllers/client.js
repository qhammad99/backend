const Client = require('../model/client.js');

exports.clientsCoach = async (req, res) => {
    try{
        const [user] = req.user;
        const [coach] = await Client.myCoach(user[0].user_id);
        let expired;
    
        if(coach.length == 0)
        {
            return res.status(401).json({
                success:false,
                message: "you have no coach"
            });
        }

        let expiryDate = new Date(coach[0].payment_expiry);
        let nowDate = new Date();

        if(expiryDate < nowDate)
            expired = true;
        else    
            expired = false;

        res.status(200).json({
            success:true,
            message: "your coach",
            coach: coach,
            expired: expired
        });
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}

exports.deleteCoach = async (req, res) => {
    //delete from chat and also from client
    try{
        const [user] = req.user;

        // delete from chat where sender or reciever id is matched with user id
        await Client.deleteChat(user[0].user_id);
        const deleteClient = await Client.deleteClient(user[0].user_id);

        if(deleteClient[0].affectedRows > 0){
            return res.status(200).json({
                success: true,
                message: "deleted successfully!!"
            });
        }

        res.status(500).json({
            success: false,
            message: "Not deleted"
        });
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}

exports.addClientsCoach = async (req, res) => {
    try{
        const [user] = req.user;
        const coach = req.body

        if(!coach.coach_id || !coach.payment_date || !coach.payment_expiry){
            return res.status(401).json({
                success:false,
                message: "can't add empty fields"
            });
        }
        
        const insertion = await Client.coachAdd(
            user[0].user_id, 
            coach.coach_id, 
            coach.payment_date,
            coach.payment_expiry
            );

        if(insertion){
            res.status(200).json({
                success:true,
                message: "coach hired",
                coach: coach 
            });
        }else
            res.status(500).json({message:"Server Error 2"})
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}

exports.giveRating = async (req, res) => {
    try{
        const [user] = req.user;
        const info = req.body;

        if(!(info.coach_id || info.rated_count || info.avg_rating || info.rating)){
            return res.status(401).json({
                success:false,
                message: "can't update empty fields"
            });
        }

        // add client rating
        await Client.clientRatingStatus(user[0].user_id, info.coach_id, info.rating);

        // update coach rating
        let rated_count = info.rated_count + 1;

        if(rated_count == 1)
            avg_rating = info.rating;
        else
            avg_rating = (info.avg_rating + info.rating) / 2;
        
        let updated = await Client.updateCoachRating(info.coach_id, rated_count, avg_rating);
    
        if(updated[0].affectedRows >0)
            return res.status(200).json({
                success: true,
                message: "updated successfully"
            })

        res.status(401).json({
            success: false,
            message: "can't update"
        })
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}

exports.updatePayment = async (req, res) => {
    try{
        const [user] = req.user;
        const {payment_expiry} = req.body;

        if(!payment_expiry){
            return res.status(401).json({
                success:false,
                message: "can't update empty fields"
            });
        }

        let updated = await Client.updatePayment(user[0].user_id, payment_expiry);
    
        if(updated[0].affectedRows >0)
            return res.status(200).json({
                success: true,
                message: "updated successfully"
            })

        res.status(401).json({
            success: false,
            message: "can't update"
        })
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}