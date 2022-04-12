const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        // first argument is error, for now null, and sec arg folder
        cb(null, './public/userImages/');
    },
    filename: (req, file, cb)=>{
        // renaming file
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

// filter so only images 
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);
    else
        cb(new Error('Unsupported files'), false);
}

const upload = multer({
    storage: storage,
    // if we wanna limit size
    limits: {
        fileSize:1024*1024*10 //10MB
    },
    fileFilter: fileFilter
})

module.exports = upload;