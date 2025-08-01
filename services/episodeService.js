const { Episode } = require("../models");

const createdEpisode = async (body, videoLink, chapterID, teacherID) => {
    const { episodeName } = body;
    
    const episode = await Episode.create({
        episodeName,
        videoLink,
        chapterId: chapterID,
        teacherId: teacherID,
    });
    const { episodeId, chapterId, teacherId, ...filteredEpisode } = episode.toJSON();

    return filteredEpisode;
};

const updatedEpisode = async (episode, episodeName, videoLink) => {
    await episode.update({ episodeName, videoLink });

    const response = episode.toJSON();
    delete response.episodeId;
    delete response.chapterId;
    delete response.teacherId;

    return response;
};


const existingEpisodeByEpisodeUUID = async (episodeUUID) => {
    const episode = await Episode.findOne({
        where: { episodeUUID },
    });

    return episode;
};

const getAllEpisodeByChapterId = async (chapterId) => {
    const episodes = await Episode.findAll({
        where: { chapterId },
        attributes: {
            exclude: ['episodeId', 'chapterId', 'teacherId'],
        },
    });

    return episodes;
};


module.exports = {
    createdEpisode,
    updatedEpisode,
    existingEpisodeByEpisodeUUID,
    getAllEpisodeByChapterId
}