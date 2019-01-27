const common = require("../service/common");
//Load input validation
const validateAnnouncementInput = require("../validation/announcement");
//Load Announcement model and Announcement domain
const AnnouncementModel = require("../models/AnnouncementModel");
const Announcement = require("../domain/announcement");
//Load RoleModel
const RoleModel = require("../models/RoleModel");
//Load DepartmentModel
const DepartmentModel = require("../models/DepartmentModel");
//Load BranchModel
const BranchModel = require("../models/BranchModel");

const addAnnouncement = async payload => {
  const { errors, isValid } = validateAnnouncementInput(payload);
  if (!isValid) {
    throw common.helper.wrapError(errors, 400);
  }

  const newAnnouncement = new Announcement(payload.name, payload.description);
  if (payload.startDate) newAnnouncement.startDate = payload.startDate;
  if (payload.endDate) newAnnouncement.endDate = payload.endDate;

  if (payload.roleid) {
    var role = await RoleModel.getRoleById(payload.roleid);
    if (role) newAnnouncement.role = role;
    else {
      errors.role = "Role can not found";
      throw common.helper.wrapError(errors, 404);
    }
  }

  if (payload.departmentid) {
    var department = await DepartmentModel.getDepartmentById(
      payload.departmentid
    );
    if (department) newAnnouncement.department = department;
    else {
      errors.department = "Department can not found";
      throw common.helper.wrapError(errors, 404);
    }
  }

  if (payload.branchid) {
    var branch = await BranchModel.getBranchById(payload.branchid);
    if (branch) newAnnouncement.branch = branch;
    else {
      errors.branch = "Branch can not found";
      throw common.helper.wrapError(errors, 404);
    }
  }

  var result = await AnnouncementModel.save(newAnnouncement);
  newAnnouncement.id = result.id;

  return newAnnouncement;
};

const deleteAnnouncment = async id => {
  const announcement = await AnnouncementModel.findById(id);
  if (!announcement) {
    errors.name = "Announcement can not found";
    throw common.helper.wrapError(errors, 404);
  }

  await AnnouncementModel.deleteById(id);

  return id;
};

const getActiveAnnouncements = async () => {
  const announcements = await AnnouncementModel.getActiveAnnouncements();

  if (announcements.length == 0) {
    errors.name = "There is no announcements found!";
    throw common.helper.wrapError(errors, 404);
  }

  return announcements;
};

//TODO: get annoucements by user

module.exports = {
  addAnnouncement,
  deleteAnnouncment,
  getActiveAnnouncements
};
