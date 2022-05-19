const db = require('../config/database.js');

module.exports = class Coach{
    static  availableCoach(){
        return db.execute(`
            SELECT coach.*, user.img_file, user.name 
            FROM  coach 
            INNER JOIN user 
            ON user.user_id = coach.coach_id 
            WHERE coach.availability =  1
        `);
    }
    static  coachSubscribedUsers(coach_id){
        return db.execute(`
        SELECT clients.*, user.img_file, user.name,user.email,parameters.height,parameters.weight,parameters.dob,parameters.gender,goal.number_of_days,
        goal.start_date,goal.target_type,goal.target_value,goal.status
        FROM  clients 
        INNER JOIN user 
        ON user.user_id = clients.user_id 
        INNER JOIN parameters ON user.user_id = parameters.user_id 
        INNER JOIN goal ON user.user_id = goal.user_id 
        WHERE clients.coach_id = (?)
        `,[coach_id]);
    }

    static coachDetail(user_id){
        return db.execute(`
            SELECT coach.*, user.img_file, user.name 
            FROM  coach 
            INNER JOIN user 
            ON user.user_id = coach.coach_id 
            WHERE coach.coach_id = (?)
        `, [user_id]);
    }

    static coachClients(user_id){
        return db.execute(`
            SELECT clients.*, user.img_file, user.name
            FROM  clients 
            INNER JOIN user 
            ON user.user_id = clients.user_id 
            WHERE clients.coach_id = (?)
        `, [user_id]);
    }

    static coachAdd(user_id, charges, joining_date, experience, account){
        return db.execute(`
            INSERT INTO coach (coach_id, charges, joining_date, coaching_experience, account_number)
            VALUES (?, ?, ?, ?, ?)
            `,[ user_id, charges, joining_date, experience, account]);
    }

    static coachByName(name){
        return db.execute(`
            SELECT coach.*, user.img_file, user.name 
                FROM  coach 
                INNER JOIN user 
                ON user.user_id = coach.coach_id 
                WHERE coach.availability =  1 
                AND user.name LIKE ?`, [`%${name}%`]);
    }

    static changeStatus(id, status){
        return db.execute(`
            UPDATE coach SET availability = ?
            WHERE coach_id = ?
        `, [status, id]);
    }
};