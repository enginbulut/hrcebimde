require("../dataaccess/mongo");
const Branch = require("../domain/branch");
const mongoose = require("mongoose");
const { save, convertToModels } = require("../dataaccess/mongohelper");

//Create Schema
const BranchSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  address: {
    type: String
  }
});

const BranchModel = mongoose.model("branches", BranchSchema, "branches");

const convertToModel = (branch = new Branch()) => {
  let model = new BranchModel();
  model.name = branch.name;
  model.desc = branch.desc;
  model.city = branch.city;
  model.address = branch.address;
  model._doc._id = mongoose.Types.ObjectId(branch.id);

  return model;
};

const branchSelector = branch => {
  return {
    _id: branch.id
  };
};

const getBranchList = async () => {
  const branchModels = await BranchModel.find({});

  return branchModels.length > 0
    ? branchModels.map(
        branchModel =>
          new Branch(
            branchModel.id,
            branchModel.name,
            branchModel.city,
            branchModel.address,
            branchModel.desc
          )
      )
    : [];
};

const deleteById = async id => {
  await BranchModel.findByIdAndDelete(id);
};

const getBranchById = async id => {
  const branchModel = await BranchModel.findById(id);
  return branchModel
    ? new Branch(
        branchModel.id,
        branchModel.name,
        branchModel.city,
        branchModel.address,
        branchModel.desc
      )
    : undefined;
};

const getBranchByName = async name => {
  const branchModel = await BranchModel.findOne({ name });
  return branchModel
    ? new Branch(
        branchModel.id,
        branchModel.name,
        branchModel.city,
        branchModel.address,
        branchModel.desc
      )
    : undefined;
};

module.exports = {
  save: save(BranchModel, convertToModels(convertToModel), branchSelector),
  getBranchList,
  deleteById,
  getBranchById,
  getBranchByName
};
