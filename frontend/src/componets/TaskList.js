import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { io } from "socket.io-client";
import "./TaskList.css";
import { getTasks, deleteTask, updateTaskStatus, addTask } from "../api"; 
import TaskModal from "./TaskModal";
import EditTaskModal from "./EditTaskModal";
import { FaTrashAlt } from "react-icons/fa";


const socket = io("http://localhost:5000"); 
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);


  const fetchTasks = async () => {
    try {
      const taskList = await getTasks();
      setTasks(taskList);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  useEffect(() => {
    socket.on("task-updated", (data) => {
      if (data.type === "added") {
        setTasks((prevTasks) => [...prevTasks, data.task]);
        toast.success(`Task "${data.task.name}" added successfully!`);
      } else if (data.type === "deleted") {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== data.taskId)
        );
        toast.warn(`Task deleted successfully.`);
      } else if (data.type === "updated") {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === data.task.id ? data.task : task
          )
        );
        toast.info(`Task "${data.task.name}" updated.`);
      }
    });

    return () => {
      socket.off("task-updated");
    };
  }, []);


  const handleAddTask = () => setModalOpen(true);

  const handleTaskAdded = async (newTask) => {
    try {
      const addedTask = await addTask(newTask);
      setTasks((prevTasks) => [...prevTasks, addedTask]);
      toast.success(`Task "${addedTask.name}" added successfully!`);
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task.");
    }
  };


  const handleEditClick = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };


  const handleTaskUpdated = async (updatedTask) => {
    try {
      await updateTaskStatus(updatedTask.id, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      setEditModalOpen(false);
      toast.info(`Task "${updatedTask.name}" updated successfully.`);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.warn("Task deleted successfully.");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  return (
    <div className="task-list-container">
      <h1>Real-Time Task Management Dashboard</h1>
      <button onClick={handleAddTask} className="add-task-btn">
        Add Task
      </button>

      <table className="task-table">
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Task Name</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.name}</td>
              <td>{task.status}</td>
              <td>{task.createdAt}</td>
              <td>
                <span
                  className="edit-icon"
                  onClick={() => handleEditClick(task)}
                >
                  ✏️
                </span>
                <FaTrashAlt
                  className="icon delete-icon"
                  onClick={() => handleDeleteTask(task.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onTaskAdded={handleTaskAdded}
      />

  
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={selectedTask}
        onTaskUpdated={handleTaskUpdated}
      />


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default TaskList;
