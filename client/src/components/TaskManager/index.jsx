
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const API_URL = 'http://localhost:3000/api';  // Make sure this port matches your .env

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add this near the top of your fetchTasks function
const fetchTasks = async () => {
  try {
      console.log('Attempting to fetch tasks...');
      const response = await axios.get(`${API_URL}/tasks`);
      console.log('Response:', response.data);
      setTasks(response.data);
      setLoading(false);
  } catch (err) {
      console.error('Error details:', err);  // Add this line
      setError('Error fetching tasks');
      setLoading(false);
  }
};

  // Add task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        title: taskTitle,
        priority,
      });
      setTasks([response.data, ...tasks]);
      setTaskTitle('');
    } catch (err) {
      setError('Error adding task');
    }
  };

  // Toggle task completion
  const toggleComplete = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      const response = await axios.put(`${API_URL}/tasks/${id}`, {
        completed: !task.completed
      });
      setTasks(tasks.map(task => 
        task._id === id ? response.data : task
      ));
    } catch (err) {
      setError('Error updating task');
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError('Error deleting task');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Task Manager</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className={styles.input}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={styles.select}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button type="submit" className={styles.addButton}>
          Add Task
        </button>
      </form>

      <div className={styles.taskList}>
        {tasks.map(task => (
          <div 
            key={task._id} 
            className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}
          >
            <div className={styles.taskContent}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task._id)}
                className={styles.checkbox}
              />
              <span className={styles.taskTitle}>{task.title}</span>
              <span className={`${styles.priority} ${styles[task.priority]}`}>
                {task.priority}
              </span>
            </div>
            <button 
              onClick={() => deleteTask(task._id)}
              className={styles.deleteButton}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;