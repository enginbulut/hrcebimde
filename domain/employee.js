'use strict';


function employee() {



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
        result.user = item.user;
        result.startDate = item.startDate;
        result.branch = item.branch;
        result.department = item.department;
        result.workScheduleType = item.workScheduleType;
        result.title = item.title;
        result.gender = item.gender ? item.gender : 'male';
        return result;
    };

    return Object.freeze({
        converter: convertToDomain,
    });
};

module.exports = employee();