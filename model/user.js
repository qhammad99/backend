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
        return db.execute(`SELECT * FROM user WHERE email=(?)`, [email]);
    }

    static async matchPassword(hash, password){
        return await bcrypt.compare(password, hash);
    }

    static generateToken(id){
        return jwt.sign(id, process.env.JWT_SECRET);
    }
};