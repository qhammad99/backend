const db = require('../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = class userInfo{
    static async createUser(name, email, password, u_type){
        let hashPassword = await bcrypt.hash(password, 10);
        return db.execute(`INSERT INTO user (name, email, password, u_type, img_file) VALUES (?, ?, ?, ?, ?)`, 
        [name, email, hashPassword, u_type, 'userAvatar.png']);
    }

    static findUser(email){
        return db.execute(`SELECT * FROM user WHERE email=(?)`, [email]);
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

    static updatePhoto(id, image){
        return db.execute(`UPDATE user SET img_file= ? WHERE user_id = ?`, [image, id]);
    }
};