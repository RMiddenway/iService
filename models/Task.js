const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskType: { type: String },
  taskTitle: { type: String },
  taskDescription: { type: String },
  suburb: { type: String },
  taskDate: { type: Date },
  budgetType: { type: String },
  budgetValue: { type: Number },
  taskImageId: { type: String },
  hiddenBy: [String],
});
taskSchema.index({
  taskTitle: "text",
  taskDescription: "text",
  suburb: "text",
});
module.exports = mongoose.model("Task", taskSchema);
