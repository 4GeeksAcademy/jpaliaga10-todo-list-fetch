import React, { useEffect, useState } from "react";

const Home = () => {
    const [task, setTask] = useState("");
    const [user, setUser] = useState();

    const createUser = async () => {
        await fetch('https://playground.4geeks.com/todo/users/jpaliaga10', {
            method: 'POST'
        }).then(resp => {
            if (resp.ok) {
                alert('Usuario creado correctamente');
                getUser();
            }
        });
    };

    const getUser = async () => {
        await fetch('https://playground.4geeks.com/todo/users/jpaliaga10')
            .then(resp => {
                if (!resp.ok) {
                    createUser();
                }
                return resp.json();
            })
            .then(user => setUser(user));
    };

    useEffect(() => {
        getUser();
    }, []);

    const createTask = async () => {
        if (!task || !task.trim()) {
            alert('El valor de la tarea no puede ser vacío');
            return;
        }

        await fetch('https://playground.4geeks.com/todo/todos/jpaliaga10', {
            method: 'POST',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                label: task,
                is_done: false
            })
        }).then(resp => {
            if (resp.ok) {
                return resp.json();
            }
        }).then(respJson => {
            const newUser = {
                ...user,
                todos: [...user.todos, respJson]
            };
            setUser(newUser);
            setTask("");
        });
    };

    const deleteTask = async (taskId) => {
        const id = parseInt(taskId);
        await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: 'DELETE'
        }).then(resp => {
            if (resp.ok) {
                const updatedUserTasks = user.todos.filter(item => item.id !== id);
                const newUser = {
                    ...user,
                    todos: updatedUserTasks
                };
                setUser(newUser);
            }
        }).catch(error => {
            console.error('Error al eliminar la tarea:', error);
        });
    };

    return (
        <div className="container">
            <h1>Todos</h1>
            <div className="todolist">
                <input
                    placeholder="What do you need to do"
                    onChange={(evt) => setTask(evt.target.value)}
                    onKeyDown={(evt) => evt.key === 'Enter' && createTask()}
                    type="text"
                    value={task}
                />
            </div>
            <div className="row">
                <div>
                    {user && user.todos.map((item) => (
                        <p key={item.id}>
                            {item.label}
                            <i className="far fa-trash-alt" onClick={() => deleteTask(item.id)}></i>
                        </p>
                    ))}
                </div>
                <p className="text-center">
                    {user && user.todos.length ?
                        <span>Tienes {user.todos.length} tareas pendientes</span> :
                        <span>No hay tareas pendientes</span>}
                </p>
                <button onClick={() => setUser(null)}>Eliminar Usuario</button>
            </div>
        </div>
    );
};

export default Home;
