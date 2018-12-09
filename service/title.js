const utils = require("../service/utils");
const common = require("../service/common");
//Load input validation
const validateTitleInput = require("../validation/title");

//Load Title model and title domain
const TitleModel = require("../models/TitleModel");
const Title = require("../domain/title");

const addTitle = async payload => {
  const { errors, isValid } = validateTitleInput(payload);
  if (!isValid) {
    throw common.helper.wrapError(errors, 400);
  }

  let title = await TitleModel.getTitleByName(payload.name);

  if (title) {
    errors.name = "Title name already exists";
    throw common.helper.wrapError(errors, 400);
  }

  const newTitle = new Title(null, payload.name, payload.desc);

  var result = await TitleModel.save(newTitle);
  newTitle.id = result.id;

  return newTitle;
};

const getTitles = async () => {
  const titles = await TitleModel.getTitleList();

  if (titles.length == 0) {
    errors.name = "There are no title found!";
    throw common.helper.wrapError(errors, 404);
  }

  return roles;
};

const deleteTitle = async id => {
  const title = await TitleModel.getTitleById(id);
  if (!title) {
    errors.name = "Title can not found";
    throw common.helper.wrapError(errors, 404);
  }
  //TODO: we should check that this title is assigned to any employees
  await TitleModel.deleteById(id);

  return id;
};

module.exports = {
  addTitle,
  getTitles,
  deleteTitle
};
