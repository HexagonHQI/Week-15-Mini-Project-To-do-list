import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const unsubscribe = db.collection('todos').onSnapshot(snapshot => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todosData);
    });
    return () => unsubscribe();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    await db.collection('todos').add({ text: inputText, completed: false });
    setInputText('');
  };

  const handleToggleTodo = async (id) => {
    const todoRef = db.collection('todos').doc(id);
    const todo = await todoRef.get();
    const completed = !todo.data().completed;

    await todoRef.update({ completed });
  };

  const handleDeleteTodo = async (id) => {
    await db.collection('todos').doc(id).delete();
  };

  return (
    <div className="todo-list">
      <h1>Todo List</h1>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => handleToggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
