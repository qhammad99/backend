const Schedule = require('../model/schedule');

exports.todaySchedule = async(req, res) => {
    try{
        const[user] = req.user;
        const DAY ={ "Sun": 1, "Mon": 2, "Tue": 3, "Wed": 4, "Thu": 5, "Fri": 6, "Sat": 7 };

        const todayPK = new Date().toString(); // convert to local time but sending string
        const dayString = todayPK.substring(0, 3);
        const dayNumber = DAY[dayString];

        const [schedules] = await Schedule.scheduleByDay(user[0].user_id, dayNumber);
        if(schedules.length==0){
            return res.status(401).json({
                success: false,
                message: "rest day"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "tasks to do today",
            tasks: schedules
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.scheduleByDay = async(req, res) => {
    try{
        const dayNumber = req.params.day;
        const [user] = req.user;

        if(dayNumber == null || dayNumber < 1 || dayNumber > 7){
            return res.status(401).json({
                success: false,
                message: "Invalid try"
            });
        }

        const [schedules] = await Schedule.scheduleByDay(user[0].user_id, dayNumber);
        if(schedules.length==0){
            return res.status(401).json({
                success: false,
                message: "rest day"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "tasks to do on "+dayNumber+" day",
            tasks: schedules
        })
    }catch(error){
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}