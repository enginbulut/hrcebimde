require("../dataaccess/mongo");
// const genericConverter = require('../domain/domainConverter');
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

schemaOptions = {
    meetingRoomId: {
        type: Schema.Types.ObjectId,
        ref: "meetingRooms",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    desc: String
};

const MeetingRoomBooksSchema = new Schema(schemaOptions);

const MeetingRoomBookModel = mongoose.model("meetingRoomBooks", MeetingRoomBooksSchema, "meetingRoomBooks");

// const convertToModel = (meetingRoom) => {
//     let model = new MeetingRoomBookModel();
//     model. = meetingRoom.name.toLocaleLowerCase();
//     model.desc = meetingRoom.desc;
//     if (meetingRoom.isActive)
//         model.isActive = meetingRoom.isActive;
//     delete model._doc._id;
//     return model;
// };

// const convertToDomain = (item) => {
//     let result = {};
//     result.name = item.name ? item.name.toLocaleLowerCase() : undefined;
//     result.desc = item.desc;
//     result.isActive = item.isActive;
//     return result;
// };

// const selector = item => {
//     return {
//         name: item.name.toLocaleLowerCase()
//     }
// };

const saveMeetingRoomBook = async (meetingRoomId, userId, startDate, endDate, desc = null) => {
    //2019-03-27T13:00 => T18:00
    const isRoomAvailable = await MeetingRoomBookModel.find({
        meetingRoomId: meetingRoomId,
        $and: [
            { startDate: { $lt: endDate } },
            { endDate: { $gt: startDate } }
        ]
    });
    const isUserAvailable = await MeetingRoomBookModel.find({
        userId: userId,
        $and: [
            { startDate: { $lt: endDate } },
            { endDate: { $gt: startDate } }
        ]
    });

    if (isRoomAvailable.length == 0 && isUserAvailable.length == 0) {
        let item = new MeetingRoomBookModel();
        item.meetingRoomId = new mongoose.mongo.ObjectID(meetingRoomId);
        item.userId = new mongoose.mongo.ObjectID(userId);
        item.startDate = startDate;
        item.endDate = endDate;
        item.desc = desc;
        await item.save();
        return item;
    } else {
        let error = {};
        if (isRoomAvailable.length > 0)
            error.roomError = 'meeting room is not available';
        if (isUserAvailable.length > 0)
            error.userError = 'user is not available';
        return error;
    }
};

module.exports = {
    saveMeetingRoomBook
    // save: save(MeetingRoomModel, convertToModels(convertToModel), selector),
    // getMeetingRoomByName,
    // deleteMeetingRoom,
    // getActiveRooms: () => getRoomsGeneric({ isActive: true }),
    // getAllRooms: () => getRoomsGeneric({}),
}
