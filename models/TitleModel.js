require("../dataaccess/mongo");
const Title = require("../domain/title");
const mongoose = require("mongoose");
const { save, convertToModels } = require("../dataaccess/mongohelper");

const Schema = mongoose.Schema;

//Create Schema
const TitleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String
  }
});

const TitleModel = mongoose.model("titles", TitleSchema, "titles");

const convertToModel = (title = new Title()) => {
  let model = new TitleModel();
  model.name = title.name;
  model.desc = title.desc;
  model._doc._id = mongoose.Types.ObjectId(title.id);

  return model;
};

const titleSelector = title => {
  return {
    _id: title.id
  };
};

const getTitleList = async () => {
  const titleModels = await TitleModel.find({});

  return titleModels.length > 0
    ? titleModels.map(
        titleModel => new Title(titleModel.id, titleModel.name, titleModel.desc)
      )
    : [];
};

const deleteById = async id => {
  await TitleModel.findByIdAndDelete(id);
};

const getTitleById = async id => {
  const titleModel = await TitleModel.findById(id);
  return titleModel
    ? new Title(roleModel.id, titleModel.name, titleModel.desc)
    : undefined;
};

const getTitleByName = async name => {
  const titleModel = await TitleModel.findOne({ name });
  return titleModel
    ? new Title(titleModel.id, titleModel.name, titleModel.desc)
    : undefined;
};

module.exports = {
  save: save(TitleModel, convertToModels(convertToModel), titleSelector),
  getTitleList,
  deleteById,
  getTitleById,
  getTitleByName
};
