import mongoose from 'mongoose';

const healthSurveySchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    fruits_vegetables: Number,
    fast_food: Number,
    diet: String,
    health_rating: Number,
    gpa: String,
    course: String,
    study_hours: Number,
    extracurricular: String,
    sleep_hours: Number,
    stress_level: Number,
    class_attendance: Number,
});

export default mongoose.models.HealthSurvey || mongoose.model('HealthSurvey', healthSurveySchema);