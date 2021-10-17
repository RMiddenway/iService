const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskType: { type: String },
  taskTitle: { type: String },
  taskDescription: { type: String },
  suburb: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  taskDate: { type: Date },
  budgetType: { type: String },
  budgetValue: { type: Number },
  taskImageId: { type: String },
  hiddenBy: [String],
  userId: { type: String },
  expertId: { type: String },
  status: {
    type: String,
    enum: ["open", "accepted", "completed", "paid", "cancelled"],
    default: "open",
  },
  finalCost: { type: Number },
});
taskSchema.index({
  taskTitle: "text",
  taskDescription: "text",
  suburb: "text",
});
module.exports = mongoose.model("Task", taskSchema);
