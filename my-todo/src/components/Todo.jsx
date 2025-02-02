import React from 'react';
import './Todo.css';
import { useState, useRef, useEffect } from 'react';
import { MdDelete } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns'; 

function Todo() {
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState([]);
    const [editId, setEditID] = useState(0);
    const [error, setError] = useState('');
    const [draggingIndex, setDraggingIndex] = useState(null); 
    const handleSubmit = (e) => {
        e.preventDefault();
        addTodo();
    };

    const addTodo = () => {
        const newTodo = todo.trim();

        if (newTodo === '') {
            setError('Todo cannot be empty!');
            return;
        }

        if (todos.some((t) => t.list.toLowerCase() === newTodo.toLowerCase())) {
            setError('Todo already exists!');
            return;
        }

        if (editId) {
            const updatedTodos = todos.map((to) =>
                to.id === editId ? { ...to, list: newTodo } : to
            );
            setTodos(updatedTodos);
            setEditID(0);
        } else {
            setTodos([
                ...todos,
                { list: newTodo, id: Date.now(), status: false, createdAt: new Date() },
            ]);
        }
        setTodo('');
        setError('');
    };

    const inputRef = useRef(null);
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const OnDelete = (id) => {
        setTodos(todos.filter((to) => to.id !== id));
    };

    const OnComplete = (id) => {
        const complete = todos.map((list) => {
            if (list.id === id) {
                return { ...list, status: !list.status };
            }
            return list;
        });
        setTodos(complete);
    };

    const onEdit = (id) => {
        const editTodo = todos.find((to) => to.id === id);
        setTodo(editTodo.list);
        setEditID(editTodo.id);
    };

    const onDragStart = (index) => {
        setDraggingIndex(index);
    };

    const onDragOver = (index) => {
        if (draggingIndex === null || draggingIndex === index) return;
        const newTodos = [...todos];
        const [draggedTodo] = newTodos.splice(draggingIndex, 1);
        newTodos.splice(index, 0, draggedTodo);
        setTodos(newTodos);
        setDraggingIndex(index);
    };

    const onDragEnd = () => {
        setDraggingIndex(null);
    };

    return (
        <div className='container'>
            <h2>TODO App</h2>
            <form className='form-group' onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={todo}
                    ref={inputRef}
                    placeholder='Enter your todo'
                    className='form-control'
                    onChange={(event) => {
                        setTodo(event.target.value);
                        setError('');
                    }}
                />
                <button type="submit">{editId ? 'EDIT' : 'ADD'}</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <div className='list'>
                <ul>
                    {todos.map((to, index) => (
                        <li
                            key={to.id}
                            className='list-items'
                            draggable
                            onDragStart={() => onDragStart(index)}
                            onDragOver={() => onDragOver(index)}
                            onDragEnd={onDragEnd}
                        >
                            <div
                                className='list-item-list'
                                id={to.status ? 'list-item' : ''}
                            >
                                {to.list} 
                                <span className='time-stamp'>
                                    ({formatDistanceToNow(new Date(to.createdAt))} ago)
                                </span>
                            </div>
                            <span>
                                <IoMdDoneAll
                                    className='list-item-icons'
                                    id='complete'
                                    title='Complete'
                                    onClick={() => OnComplete(to.id)}
                                />
                                <FaRegEdit
                                    className='list-item-icons'
                                    id='edit'
                                    title='Edit'
                                    onClick={() => onEdit(to.id)}
                                />
                                <MdDelete
                                    className='list-item-icons'
                                    id='delete'
                                    title='Delete'
                                    onClick={() => OnDelete(to.id)}
                                />
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Todo;
