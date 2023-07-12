const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add the contact name"],
    },
    Task_Description: {
      type: String,
      required: [true, "Please add the task description"],
    },
    Status: {
      type: Boolean,
      required: [true, "Please add the task status"],
    },
   Due_Date: {
      type: String,
      required: [true, "Please add the task due date"],
    },
    Date_of_completion:{
      type: String,
      required: [true, "Please add the data of completion"],
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
