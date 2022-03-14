const db = require('../config/database.js');

module.exports = class userGoal{
    static addGoal(user_id, duration_type, duration_value, target_type, target_value){
        return db.execute(`INSERT INTO goal (user_id, duration_type, duration_value, target_type, target_value) VALUES (?, ?, ?, ?, ?)`, 
        [user_id, duration_type, duration_value, target_type, target_value]);
    }

    static goalFlag(id, flag){
        return db.execute(`UPDATE user SET isGoal= ? WHERE user_id = ?`, [flag, id]);
    }

    static removeGoal(user_id){
        return db.execute(`DELETE FROM goal WHERE user_id = ?`, [user_id]);
    }

    static verifyGoal(user_id, goalID){
        return db.execute( `SELECT * from goal where user_id = ? AND id= ?`, [user_id, goalID]);
    }

    static currentGoal(user_id){
        return db.execute( `SELECT * FROM goal WHERE user_id = ? AND status = ?`, [user_id, 'inProgress']);
    }

    static updateStatus(goalID){
        return db.execute(`UPDATE goal SET status= ? WHERE id = ?`, ['completed', goalID]);
    }

    static completedGoal(user_id){
        return db.execute(`SELECT COUNT(*) AS GOALS FROM goal WHERE status = ?`, ['completed']);
    }
};