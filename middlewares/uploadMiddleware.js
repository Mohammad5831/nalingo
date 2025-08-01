const multer = require('multer');
const path = require('path');

// Maximum acceptable size for course demo video
const MAX_SIZE = 150* 1024* 1024;
//Maximum acceptable volume for course episodes
const MAX_SIZE_EPISODE = 350* 1024* 1024;

// Upload teacher profile picture
const teachersFilesStorage = multer.diskStorage({
    destination: function (req, file, cb) { 
        if (file.fieldname === 'teacherPhoto') {
        cb(null, 'storage/teachers/profiles'); // ذخیره عکس پروفایل
      } else if (file.fieldname === 'teachingPreview') {
        cb(null, 'storage/teachers/teachingPreviews'); // ذخیره ویدیو دمو تدریس
      }
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});


// Upload course demo video
const coursePreviewStorage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        cb(null, 'storage/courses/coursePreviews');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
})

// Upload course episodes
const courseEpisodesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/courses/episodes');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
})

// Upload the file received by the teacher (transfer receipt)
const teacherPaymentsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/teachers/paymentsProof');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// Course Upload File Filter
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if(ext === '.mp4') {
        cb(null, true);
    } else {
        cb(new Error('لطفا فایل رو با فرمت mp4 اپلود کنید'));
    };
};

const upload = {
    teacher: multer({
        storage: teachersFilesStorage
    }),
    coursePreview: multer({
        storage: coursePreviewStorage,
        limits: {fileSize: MAX_SIZE},
        fileFilter,
    }),
    courseEpisodes: multer({
        storage: courseEpisodesStorage,
        limits: {fileSize: MAX_SIZE_EPISODE},
        fileFilter,
    }),
    paymentProofLink: multer({
        storage: teacherPaymentsStorage
    }),
};

module.exports = upload