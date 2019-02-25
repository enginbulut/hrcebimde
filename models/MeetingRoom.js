require("../dataaccess/mongo");
// const genericConverter = require('../domain/domainConverter');
const mongoose = require("mongoose");
const { save, convertToModels, convertToDomains } = require("../dataaccess/mongohelper");

const Schema = mongoose.Schema;

schemaOptions = {
    name: {
        type: String,
        required: true,
        unique: true
    },
    desc: String,
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
};



const MeetingRoomSchema = new Schema(schemaOptions);

const MeetingRoomModel = mongoose.model("meetingRooms", MeetingRoomSchema, "meetingRooms");

const convertToModel = (meetingRoom) => {
    let model = new MeetingRoomModel();
    model.name = meetingRoom.name.toLocaleLowerCase();
    model.desc = meetingRoom.desc;
    if (meetingRoom.isActive)
        model.isActive = meetingRoom.isActive;
    delete model._doc._id;
    return model;
};

const convertToDomain = (item) => {
    let result = {};
    result.name = item.name ? item.name.toLocaleLowerCase() : undefined;
    result.desc = item.desc;
    result.isActive = item.isActive;
    return result;
};

const selector = item => {
    return {
        name: item.name.toLocaleLowerCase()
    }
};

const getMeetingRoomByName = async name => {
    const modelItem = await MeetingRoomModel.findOne({ name });
    return modelItem ? convertToDomains(convertToDomain)(modelItem) : undefined;
};

const deleteMeetingRoom = async name => {
    const status = await MeetingRoomModel.findOneAndDelete({ name });
    return status != null;
};

const getRoomsGeneric = async (predicate) => {
    const items = await MeetingRoomModel.find(predicate);
    return items ? convertToDomains(convertToDomain)(items) : [];
};

module.exports = {
    save: save(MeetingRoomModel, convertToModels(convertToModel), selector),
    getMeetingRoomByName,
    deleteMeetingRoom,
    getActiveRooms: getRoomsGeneric({ isActive: true }),
    getAllRooms: getRoomsGeneric({}),
}
