const db = require('../config/database.js');

module.exports = class Client{
    static myCoach(user_id){
        return db.execute(`
            SELECT user.img_file, user.name, clients.* 
            FROM  coach 
            INNER JOIN user ON user.user_id = coach.coach_id
            INNER JOIN clients ON clients.coach_id =  coach.coach_id
            WHERE clients.user_id = (?)
        `, [user_id]);
    }

    static deleteChat(user_id){
        return db.execute(`
            DELETE FROM  chat 
            WHERE reciever_id OR sender_id = (?)
        `, [user_id]);
    }

    static deleteClient(user_id){
        return db.execute(`
            DELETE FROM  clients 
            WHERE USER_id = (?)
        `, [user_id]);
    }

    static coachAdd(user_id, coach_id, payment_date, payment_expiry){
        return db.execute(`
            INSERT INTO clients(user_id, coach_id, payment_date, payment_expiry)
            VALUES (?, ?, ?, ?)
        `, [user_id, coach_id, payment_date, payment_expiry])
    }

    static clientRatingStatus(user_id, coach_id, rating){
        return db.execute(`
            UPDATE clients 
            SET is_rated =1, rating = ?
            WHERE user_id = ? AND coach_id = ?
        `, [rating, user_id, coach_id]);
    }

    static updateCoachRating(coach_id, rated_count, avg_rating){
        return db.execute(`
            UPDATE coach 
            SET rated_count =?, avg_rating = ?
            WHERE coach_id = ?
        `, [rated_count, avg_rating, coach_id]);
    }

    static updatePayment(user_id, payment_expiry){
        return db.execute(`
            UPDATE clients 
            SET payment_expiry = ?
            WHERE user_id = ?
        `, [payment_expiry, user_id]);
    }
};