const fs = require('fs').promises;
const defaultFolder = `mapDataCache`
const cacheFilePath = (cacheKey, folderName) => `${__dirname}/${folderName || defaultFolder}/${cacheKey}.json`;
exports.setCache = async (cacheKey, data, folderName) => {
    const cacheFile = cacheFilePath(cacheKey, folderName);
    await fs.writeFile(cacheFile,
        JSON.stringify(data, null, 4)
    );
}
exports.getCache = async (cacheKey, folderName) => {
    const cacheFile = cacheFilePath(cacheKey, folderName);
    const storageExists = await fs.access(cacheFile)
        .then(() => true).catch(() => false);
    if (storageExists) {
        return require(cacheFile);
    }
    return null;
}