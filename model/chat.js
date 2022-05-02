const db = require('../config/database.js');

module.exports = class Chat{
    static getChat(sender_id, reciever_id){
        return db.execute(`
        SELECT * FROM chat 
        WHERE (sender_id = ? AND reciever_id = ?)
        OR (reciever_id = ? AND sender_id = ?)
        ORDER BY msg_time DESC
        `, [sender_id, reciever_id, sender_id, reciever_id]);
    }
};