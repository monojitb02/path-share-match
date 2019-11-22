const fs = require('fs').promises;
const cacheFolderPath = `${__dirname}/mapDataCache`
const cacheFilePath = (cacheKey) => `${cacheFolderPath}/${cacheKey}.json`;
exports.setCache = async (cacheKey, data) => {
    await fs.writeFile(cacheFilePath(cacheKey),
        JSON.stringify(data, null, 4)
    );
}
exports.getCache = async (cacheKey) => {
    const cacheFile = cacheFilePath(cacheKey);
    const storageExists = await fs.access(cacheFile)
        .then(() => true).catch(() => false);
    if (storageExists) {
        return require(cacheFile);
    }
    return null;
}