const db = require('../config/database.js');

module.exports = class userInfo{
    constructor(id, name, email, password, u_type, coach_id){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.u_type = u_type;
        this.coach_id = coach_id;
    };

    static getUsersInfo(){
        return db.execute('SELECT * from user_info');
    };

    static getUserInfo(email, password){
        return db.execute(`SELECT * FROM user_info WHERE email = (?) AND password=(?)`,[email, password]);
    };

    static verifyEmail(email){
        return db.execute(`SELECT * FROM user_info WHERE email = (?)`,[email]);
    }

    static addUser(name, email, password, u_type, coach_id){
        return db.execute(`INSERT INTO user_info
        (name, email, password, u_type, coach_id) VALUES (?, ?, ?, ?, ?)`, 
        [name, email, password, u_type, coach_id]);
    }
};