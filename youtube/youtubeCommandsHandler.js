const YoutubeDownloader = require('./Youtube');
const key = 'AIzaSyA53q1WJv1-6IqyCVjqHjlar7pWfKiTOtQ'
const YTD = new YoutubeDownloader(key);

const inputHandler = {}

inputHandler['-download'] = async (args, options) => {
    const result = await YTD.downloadFirstResult(args, options);
    return {
        responseType: "Download",
        data: result,
    }
};

inputHandler['-search'] = async (searchString) => {

    const result = await YTD.getResults(searchString);
    return {
        responseType: "Search",
        data: result,
    }
};

inputHandler['-index'] = async (index, options) => {
    const result = await YTD.downloadFromIndex(index, options);
    return {
        responseType: "Download",
        data: result,
    }
};

inputHandler['-next'] = async () => {
    const result = await YTD.getNextPage();
    return {
        responseType: "Search",
        data: result,
    }
};

inputHandler['-previous'] = async () => {
    const result = await YTD.getPreviousPage();
    return {
        responseType: "Search",
        data: result,
    }
};

inputHandler['default'] = async () => {throw "invalid method"};

module.exports = inputHandler;