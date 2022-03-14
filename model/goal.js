const db = require('../config/database.js');

module.exports = class userGoal{
    static addGoal(user_id, duration_type, duration_value, target_type, target_value){
        return db.execute(`INSERT INTO goal (user_id, duration_type, duration_value, target_type, target_value) VALUES (?, ?, ?, ?, ?)`, 
        [user_id, duration_type, duration_value, target_type, target_value]);
    }

    // static getParameters(user_id){
    //     return db.execute(`SELECT * FROM parameters WHERE user_id = ?`, [user_id]);
    // }

    static goalFlag(id, flag){
        return db.execute(`UPDATE user SET isGoal= ? WHERE user_id = ?`, [flag, id]);
    }

    static removeGoal(user_id){
        return db.execute(`DELETE FROM goal WHERE user_id = ?`, [user_id]);
    }

    static verifyGoal(user_id, goalID){
        return db.execute( `SELECT * from goal where user_id = ? AND id= ?`, [user_id, goalID]);
    }

    static updateStatus(goalID){
        return db.execute(`UPDATE goal SET status= ? WHERE id = ?`, ['completed', goalID]);
    }
};