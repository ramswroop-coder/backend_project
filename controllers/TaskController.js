const asyncHandler = require("express-async-handler");
const Task = require("../models/TaskModel");
//@desc Get all Tasks
//@route GET /api/Tasks
//@access private

const getTasks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number from query parameter
  const limit = parseInt(req.query.limit) || 10; // Number of tasks to display per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const filters = { user_id: req.user.id }; // Default filter: tasks belonging to the user

  // Apply additional filters if provided in query parameters
  if (req.query.status) {
    filters.Status = req.query.status;
  }

  const sortOptions = {
    Status: 1, // Sort by Status in ascending order
    
  };

  const count = await Task.countDocuments(filters);

  const tasks = await Task.find(filters)
    .sort(sortOptions)
    .skip(startIndex)
    .limit(limit);

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    totalTasks: count,
  };

  res.status(200).json({ tasks, pagination });
});


//@desc Create New Task
//@route POST /api/Tasks
//@access private
const createTask = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { name, Task_Description ,Due_Date} = req.body;
  if (!name || !Task_Description||!Due_Date) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const task = await Task.create({
    user_id: req.user.id,
    name,
    Task_Description,
    Due_Date,
    Status:false,
    Date_of_completion:"None",
  });

  res.status(201).json(task);
});

//@desc Get Task
//@route GET /api/Tasks/:id
//@access private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  res.status(200).json(task);
});

//@desc Update Task
//@route PUT /api/Tasks/:id
//@access private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user Tasks");
  }

  const updatedtask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedtask);
});

//@desc Delete Task
//@route DELETE /api/Tasks/:id
//@access private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  if (task.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user Tasks");
  }
  await Task.deleteOne({ _id: req.params.id });
  res.status(200).json(task);
});

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
