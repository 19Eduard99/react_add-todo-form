import { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';

export const App = () => {
  const users = [...usersFromServer];

  const [selectedUser, setSelectedUser] = useState('0');
  const [todos, setTodos] = useState(
    [...todosFromServer].map(todo => ({
      ...todo,
      user: users.find(user => user.id === todo.userId),
    })),
  );

  const [inputTitle, setInputTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [selectEroor, setSelectError] = useState(false);

  const setId = () => {
    const maxId = Math.max(...todos.map(todo => todo.id));

    return maxId + 1;
  };

  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUser === '0' || !inputTitle.trim()) {
      setSelectError(selectedUser === '0');
      setTitleError(!inputTitle.trim());

      return;
    }

    setInputTitle('');
    setSelectedUser('0');
    setTitleError(false);
    setTodos(prevTodos => [
      ...prevTodos,
      {
        id: setId(),
        title: inputTitle,
        completed: false,
        userId: +selectedUser,
        user: users.find(user => user.id === +selectedUser),
      },
    ]);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handlerSubmit} action="/api/todos" method="POST">
        <div className="field">
          <label htmlFor="titleInput">Title: </label>
          <input
            type="text"
            name="title"
            id="titleInput"
            data-cy="titleInput"
            value={inputTitle}
            placeholder="Enter a title"
            onChange={e => {
              setInputTitle(e.target.value);
              setTitleError(false);
            }}
          />
          {titleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="userSelect">User: </label>
          <select
            data-cy="userSelect"
            name="userId"
            id="userSelect"
            value={selectedUser}
            required
            onChange={e => {
              setSelectedUser(e.target.value);
              setSelectError(false);
            }}
          >
            <option value="0" disabled>
              Choose a user
            </option>

            {users.map(user => {
              return (
                <option value={user.id} key={user.id}>
                  {user.name}
                </option>
              );
            })}
          </select>

          {selectEroor && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
