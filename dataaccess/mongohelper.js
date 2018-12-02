const { Model } = require("mongoose");
const util = require("util");

("use strict");
const save = (
  mongomodel = Model,
  modelconvertor = Function(),
  selector = Function()
) => async entities => {
  let models = modelconvertor ? modelconvertor(entities) : entities;
  if (!models) {
    return;
  }
  if (util.isArray(models)) {
    if (models.length == 0) {
      return;
    }
    let bulk = mongomodel.collection.initializeOrderedBulkOp();
    for (const model of models) {
      bulk
        .find(selector(model))
        .upsert()
        .updateOne(model);
    }
    await bulk.execute();
  } else {
    await mongomodel.findOneAndUpdate(selector(models), models, {
      upsert: true
    });
  }
  return models;
};

const convertToModels = modelconvertor => entities => {
  if (util.isArray(entities)) {
    return entities.map(entity => modelconvertor(entity));
  }
  return modelconvertor(entities);
};

module.exports = {
  save: save,
  convertToModels: convertToModels
};
