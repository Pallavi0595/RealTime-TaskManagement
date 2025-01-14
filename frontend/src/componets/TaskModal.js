import React, { useState } from "react";
import { addTask } from "../api"; 
import './TaskModal.css';
const TaskModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [taskData, setTaskData] = useState({ name: "", status: "Pending" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (!taskData.name.trim()) {
      setMessage("Task name cannot be empty.");
      return;
    }

    setLoading(true);
    setMessage(""); 

    try {
      const result = await addTask(taskData); 
      setMessage("Task added successfully!");
      onTaskAdded(result); 
      setTaskData({ name: "", status: "Pending" });
    } catch (error) {
      setMessage("Error saving task: " + error.message);
    } finally {
      setLoading(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Task</h2>
        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Task Name"
            value={taskData.name}
            onChange={handleChange}
          />
          <select name="status" value={taskData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          
          <button type="submit" disabled={loading} className="submit-task-btn">
            {loading ? "Save..." : "Save"}
          </button>
        </form>
        <button onClick={onClose} className="close-modal-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TaskModal;

