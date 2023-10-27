const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '../../storage/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '_' + uniqueSuffix + '.' + file.originalname.split('.').pop())
    }
  })
  const uploadFile = multer({ storage: storage })
  module.exports = {
    uploadFile
  }