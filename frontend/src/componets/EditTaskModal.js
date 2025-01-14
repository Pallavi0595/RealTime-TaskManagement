import React, { useState, useEffect } from "react";
import "./EditTaskModal.css";



const EditTaskModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (task) {
      setName(task.name);
      setStatus(task.status);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Task name cannot be empty.");
      return;
    }

    onTaskUpdated({ ...task, name, status });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Task</h3>
        <form onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Task Name"
    value={name}
    className="input-field"
    onChange={(e) => setName(e.target.value)}
  />
  <select
    value={status}
    className="select-field"
    onChange={(e) => setStatus(e.target.value)}
  >
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>
  <div className="button-row">
    <button className="update-task-btn" type="submit">
      Update Task
    </button>
    <button type="button" className="cancel-btn" onClick={onClose}>
      Cancel
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default EditTaskModal;
