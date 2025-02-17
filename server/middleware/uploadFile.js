const multer = require('multer');
const {generateID} = require ('../functions');

const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },

    filename: function (req, file, cb) {
        //console.log(file);
        const uniqueID = generateID(40);
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uniqueID}.${fileExtension}`
        req.fileID = fileName;
        cb(null, fileName);
    }
});

const uploadFile = multer({ storage }).single('file');
module.exports = uploadFile;
