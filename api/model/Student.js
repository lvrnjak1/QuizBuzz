const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    surname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    }
});

studentSchema.pre('remove', async function (next) {
    const Classroom = this.model('Classroom');
    const Quiz = this.model('Quiz');
    await Classroom.updateMany({ students: this._id.toString() }, { $pull: { students: this._id.toString() } });
    await Quiz.updateMany({ 'students.id': this._id.toString() }, { $pull: { students: { id: this._id.toString() } } });
    next();
});

studentSchema.statics.updateById = async (id, body) => {
    const student = await Student.findById(id);
    Object.keys(body).forEach(key => student[key] = body[key]);
    await student.save();
    return student;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
