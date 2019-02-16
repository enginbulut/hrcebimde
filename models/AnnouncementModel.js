require("../dataaccess/mongo");
const Announcement = require("../domain/announcement");
const mongoose = require("mongoose");
const { save, convertToModels } = require("../dataaccess/mongohelper");
const { addDays } = require("../service/common").helper;

const Schema = mongoose.Schema;
const afterAWeek = addDays(7);
//Create Schema
const AnnouncementSchema = new Schema({
  branch: {
    type: Schema.Types.ObjectId,
    ref: "branches"
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "departments"
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "roles"
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: afterAWeek
  }
});

const AnnouncementModel = mongoose.model(
  "announcements",
  AnnouncementSchema,
  "announcements"
);

const convertToModel = (announcement = new Announcement()) => {
  let model = new AnnouncementModel();
  model.name = announcement.name;
  model.description = announcement.description;

  model._doc._id = mongoose.Types.ObjectId(announcement.id);

  if (announcement.startDate) model.startDate = announcement.startDate;
  if (announcement.endDate) model.endDate = announcement.endDate;
  if (announcement.role) model.role = announcement.role.id;
  if (announcement.branch) model.branch = announcement.branch.id;
  if (announcement.department) model.department = announcement.department.id;

  return model;
};

const announcementSelector = announcement => {
  return {
    _id: announcement.id
  };
};

const getActiveAnnouncements = async () => {
  const announcementModels = await AnnouncementModel.find({
    $and: [
      { startDate: { $lte: Date.now() } },
      { endDate: { $gte: Date.now() } }
    ]
  })
    .populate("role", ["name", "permissioncode"])
    .populate("branch", ["id", "name"])
    .populate("department", ["id", "name"]);

  return announcementModels.length > 0
    ? announcementModels.map(
        announcementModel =>
          new Announcement(
            announcementModel.name,
            announcementModel.description,
            announcementModel.startDate,
            announcementModel.endDate,
            announcementModel.id,
            announcementModel.branch,
            announcementModel.department,
            announcementModel.role
          )
      )
    : [];
};

const findById = async id => {
  const announcementModel = await AnnouncementModel.findById(id)
    .populate("role", ["name", "permissioncode"])
    .populate("branch", ["id", "name"])
    .populate("department", ["id", "name"]);
  return announcementModel
    ? new Announcement(
        announcementModel.name,
        announcementModel.description,
        announcementModel.startDate,
        announcementModel.endDate,
        announcementModel.id,
        announcementModel.branch,
        announcementModel.department,
        announcementModel.role
      )
    : undefined;
};

const deleteById = async id => {
  await AnnouncementModel.findByIdAndDelete(id);
};

module.exports = {
  save: save(
    AnnouncementModel,
    convertToModels(convertToModel),
    announcementSelector
  ),
  getActiveAnnouncements,
  findById,
  deleteById
};
