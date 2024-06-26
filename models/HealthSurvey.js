import mongoose from 'mongoose';

const healthSurveySchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  fruits_vegetables: Number, // Assuming this represents servings per day
  fast_food: Number, // Frequency of fast food consumption per week
  diet: String, // Type of diet (e.g., vegetarian, vegan, Mediterranean, etc.)
  health_rating: Number, // Overall health rating (1-5)
  gpa: String, // GPA or academic performance
  course: String,
  study_hours: Number,
  extracurricular: String,
  sleep_hours: Number,
  stress_level: Number, // If applicable in the new context
  class_attendance: Number,
});

export default mongoose.models.HealthSurvey || mongoose.model('HealthSurvey', healthSurveySchema);
