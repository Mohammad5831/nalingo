const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");

// تابع برای تعیین مسیر ریموت بر اساس نوع فایل
const getRemotePath = (fileName, remoteFileName) => {
    let remotePath;
    if (fileName === 'coursePreview') {
        remotePath = `/courses/coursePreviews/${remoteFileName}`;
    } else if (fileName === 'episode') {
        remotePath = `/courses/episodes/${remoteFileName}`;
    } else if (fileName === 'profile') {
        remotePath = `/teachers/profiles/${remoteFileName}`;
    } else if (fileName === 'teachingPreviews') {
        remotePath = `/teachers/teachingPreviews/${remoteFileName}`;
    } else if (fileName === 'paymentsProof') {
        remotePath = `/teachers/paymentsProof/${remoteFileName}`;
    } else {
        throw new Error(`نوع فایل ناشناخته: ${fileName}`);
    }
    return remotePath;
};

const uploadToFTP = async (localFilePath, remoteFileName, fileName) => {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false, // اگر هاستت SSL داره این رو true بذار
        });

        const remotePath = getRemotePath(fileName, remoteFileName);
        const remoteDir = path.dirname(remotePath);

        // اطمینان از وجود دایرکتوری مقصد
        await client.ensureDir(remoteDir);

        // حذف فایل قبلی در صورت وجود
        try {
            await client.remove(remotePath);
            console.log("فایل قبلی با موفقیت حذف شد:", remotePath);
        } catch (err) {
            if (err.code !== 550) { // 550 به معنی عدم وجود فایل است
                throw err;
            }
        }

        // آپلود فایل جدید
        await client.uploadFrom(localFilePath, remotePath);

        // حذف فایل محلی بعد از آپلود موفق
        fs.unlink(localFilePath, (err) => {
            if (err) console.error("خطا در حذف فایل محلی:", err);
            else console.log("فایل محلی با موفقیت حذف شد:", localFilePath);
        });

        return {
            success: true,
            remotePath: `https://fs4-ns2.hostiran.net/public_ftp/storage${remotePath}`,
        };
    } catch (err) {
        console.error("FTP Upload failed:", err);
        return { success: false, error: err };
    } finally {
        client.close();
    }
};

// تابع حذف فایل از FTP
const deleteFromFTP = async (remoteFileName, fileName) => {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false,
        });

        const remotePath = getRemotePath(fileName, remoteFileName);

        // حذف فایل از هاست
        try {
            await client.remove(remotePath);
            console.log("فایل با موفقیت حذف شد:", remotePath);
            return { success: true };
        } catch (err) {
            console.error("خطا در حذف فایل:", err);
            return { success: false, error: err };
        }
    } catch (err) {
        console.error("FTP Connection failed:", err);
        return { success: false, error: err };
    } finally {
        client.close();
    }
};

module.exports = {
    uploadToFTP,
    deleteFromFTP,
};