const ytdl = require('ytdl-core');

module.exports =
{
    validateYoutubeUrl: (url) =>
    {
        return ytdl.validateURL(url) && ytdl.getURLVideoID(url);
    }
}