module.exports = function (user, startDate, branch, department, workScheduleType, title, gender = 'male') {
    //TODO : discuss about required fields
    // if(!startDate || !branch || !department || !workScheduleType || !title)
    //     throw new Error('required fields can not be empty');
    this.user = user;
    this.startDate = startDate;
    this.branch = branch;
    this.department = department;
    this.workScheduleType = workScheduleType;
    this.title = title;
    this.gender = gender;
};
