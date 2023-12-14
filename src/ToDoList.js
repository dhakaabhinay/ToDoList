import React, { useState, useEffect } from 'react'
import './ToDo.css'

const TodoApp = () => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data)
        } else {
          console.error('Invalid data format:', data)
          setTasks([])
        }
      })
      .catch((error) => console.error('Error fetching tasks:', error))
  }, [])

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObj = { title: newTask, completed: false }
      setTasks([newTaskObj, ...tasks])
      setNewTask('')
      fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaskObj),
      })
        .then((response) => response.json())
        .then((data) => console.log('Task added successfully:', data))
        .catch((error) => console.error('Error adding task:', error))
    }
  }

  const handleToggleComplete = (index) => {
    const updatedTasks = [...tasks]
    updatedTasks[index].completed = !updatedTasks[index].completed
    setTasks(updatedTasks)

    fetch(`https://jsonplaceholder.typicode.com/todos/${tasks[index].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTasks[index]),
    })
      .then((response) => response.json())
      .then((data) => console.log('Task updated successfully:', data))
      .catch((error) => console.error('Error updating task:', error))
  }

  const handleRemoveTask = (index) => {
    const taskId = tasks[index].id
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(updatedTasks)

    fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => console.log('Task deleted successfully:', data))
      .catch((error) => console.error('Error deleting task:', error))
  }

  return (
    <div>
      <h1 className="Todo_list">Todo App</h1>
      <div className="todo_input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Check Box</th>
            <th>Task</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(index)}
                />
              </td>
              <td
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              >
                {task?.title}
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleRemoveTask(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TodoApp
