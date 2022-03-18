const db = require('../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = class userInfo{
    static async createUser(name, email, password, u_type){
        let hashPassword = await bcrypt.hash(password, 10);
        return db.execute(`INSERT INTO user (name, email, password, u_type) VALUES (?, ?, ?, ?)`, 
        [name, email, hashPassword, u_type]);
    }

    static findUser(email){
        return db.execute(`SELECT 
            user.user_id, 
            user.name, 
            user.email, 
            user.password, 
            user.isParameters, 
            user.isGoal, 
            user_type.u_type as u_type 
            
            FROM user 
            JOIN user_type ON user.u_type = user_type.id 
            WHERE email=(?)`, [email]);
    }

    static findById(id){
        return db.execute(`SELECT * FROM user WHERE user_id=(?)`, [id]);
    }

    static async matchPassword(hash, password){
        return await bcrypt.compare(password, hash);
    }

    static generateToken(id){
        return jwt.sign(id, process.env.JWT_SECRET);
    }

    static updateName(id, name){
        return db.execute(`UPDATE user SET name= ? WHERE user_id = ?`, [name, id]);
    }

    static updateEmail(id, email){
        return db.execute(`UPDATE user SET email= ? WHERE user_id = ?`, [email, id]);
    }

    static async updatePassword(id, password){
        let hashPassword = await bcrypt.hash(password, 10);
        return db.execute(`UPDATE user SET password= ? WHERE user_id = ?`, [hashPassword, id]);
    }
};