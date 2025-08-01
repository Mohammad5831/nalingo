const { videoRoom } = require('./videoRoom');

module.exports = (io) => {
    videoRoom(io);
};