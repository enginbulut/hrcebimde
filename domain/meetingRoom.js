'use strict';

function meetingRoom(){
    /**
     * Converts model item(s) to domain item
     * @param {({}|[])} item employee(s) to be converted
     */
    const convertToDomain = (item) => {
        let data = [];
        let isObject = false;
        if (!Array.isArray(item)) {
            isObject = true;
            data.push(singleConverter(item));
        } else {
            for (let i = 0; i < item.length; i++) {
                data.push(singleConverter(item[i]));
            }
        }
        if (!isObject)
            return data;
        else
            return data[0];
    };

    const singleConverter = (item) => {
        let result = {};
        result.name = item.name;
        result.desc = item.desc;
        result.isActive= item.isActive;
        return result;
    };

    return Object.freeze({
        converter: convertToDomain,
    }); 
};

module.exports = meetingRoom();

// module.exports = function (id, name, desc, isActive) {
//     this.id = id;
//     this.name = name;
//     this.desc = desc;
//     this.isActive = isActive;
// };
