const db = require('../config/database.js');

module.exports = class userParameters{
    static addParameters(user_id, height, weight, dob, gender){
        return db.execute(`INSERT INTO parameters (user_id, height, weight, dob, gender) VALUES (?, ?, ?, ?, ?)`, 
        [user_id, height, weight, dob, gender]);
    }

    static getParameters(user_id){
        return db.execute(`SELECT * FROM parameters WHERE user_id = ?`, [user_id]);
    }

    static updateHeight(id, height){
        return db.execute(`UPDATE parameters SET height= ? WHERE user_id = ?`, [height, id]);
    }

    static updateWeight(id, weight){
        return db.execute(`UPDATE parameters SET weight= ? WHERE user_id = ?`, [weight, id]);
    }

    static updateDOB(id, dob){
        return db.execute(`UPDATE parameters SET dob= ? WHERE user_id = ?`, [dob, id]);
    }

    static updateGender(id, gender){
        return db.execute(`UPDATE parameters SET gender= ? WHERE user_id = ?`, [gender, id]);
    }
};