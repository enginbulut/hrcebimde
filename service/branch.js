const common = require("../service/common");
//Load input validation
const validateBranchInput = require("../validation/branch");
//Load Branch model and branch domain
const BranchModel = require("../models/BranchModel");
const Branch = require("../domain/branch");

const addBranch = async payload => {
  const { errors, isValid } = validateBranchInput(payload);
  if (!isValid) {
    throw common.helper.wrapError(errors, 400);
  }

  let branch = await BranchModel.getBranchByName(payload.name);

  if (branch) {
    errors.name = "Branch name already exists";
    throw common.helper.wrapError(errors, 400);
  }

  const newBranch = new Branch(
    null,
    payload.name,
    payload.city,
    payload.address,
    payload.desc
  );

  var result = await BranchModel.save(newBranch);
  newBranch.id = result.id;

  return newBranch;
};

const getBranches = async () => {
  const branches = await BranchModel.getBranchList();

  if (branches.length == 0) {
    errors.name = "There are no branch found!";
    throw common.helper.wrapError(errors, 404);
  }

  return branches;
};

const deleteBranch = async id => {
  const branch = await BranchModel.getBranchById(id);
  if (!branch) {
    errors.name = "Branch can not found";
    throw common.helper.wrapError(errors, 404);
  }
  //TODO: we should check that this department is assigned to any employee
  await BranchModel.deleteById(id);

  return id;
};

module.exports = {
  addBranch,
  getBranches,
  deleteBranch
};
