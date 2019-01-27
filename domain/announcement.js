module.exports = function(
  name,
  description,
  startDate,
  endDate,
  id,
  branch,
  department,
  role
) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.startDate = startDate;
  this.endDate = endDate;
  this.branch = branch;
  this.department = department;
  this.role = role;
};
