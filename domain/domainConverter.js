'use strict';

function domainConverter(fnConverter) {
    const singleConverter = fnConverter;
    /**
     * Converts model item(s) to domain item
     * @param {({}|[])} item item(s) to be converted
     */
    const convertToDomain = (item) => {
        let data = [];
        let isObject = false;
        if (!Array.isArray(item)) {
            isObject = true;
            data.push(singleConverter(item));
        } else {
            for (let i = 0; i < item.length; i++) {
                data.push(this.singleConverter(item[i]));
            }
        }
        if (!isObject)
            return data;
        else
            return data[0];
    };

    return Object.freeze({
        convert: convertToDomain,
    });
};

module.exports = domainConverter;
