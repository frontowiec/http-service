import React, { useEffect, useState } from "react";
import { HttpService, AjaxError } from "http-service";
import ErrorBoundary from "react-error-boundary";

export const httpService = new HttpService({
  host: "http://localhost:4000/api",
  enabledMock: process.env.NODE_ENV === "test",
  mockDelay: 100,
  reqInterceptor(req) {
    return { ...req, headers: { Authorization: "its-not-real-token" } };
  },
  resInterceptor(res) {
    return res;
  }
});

export interface User {
  name: string;
  gender: string;
  birthday: string;
  avatar: string;
}

const getUsers = () => {
  return httpService.get<{ users: User[] }>("/users");
};

const postUsers = () => {
  return httpService.post<{ user: User }, { id: number }>("/users", { id: 1 });
};

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<AjaxError | null>(null);

  const addRandomUser = () => {
    postUsers()
      .then(({ user }) => {
        setUsers([user, ...users]);
      })
      .catch(e => {
        setError(e);
      });
  };

  useEffect(() => {
    getUsers()
      .then(({ users }) => setUsers(users))
      .catch(e => {
        setError(e);
      });
  }, []);

  if (error) {
    throw error;
  }

  if (users.length === 0) {
    return <strong>Loading...</strong>;
  }

  return (
    <div>
      <button data-testid="add-user-button" onClick={() => addRandomUser()}>
        Add random user
      </button>
      <ul data-testid="app-users-list">
        {users.map((user, index) => (
          <li key={user.name} data-testid={`app-users-list-item-${index}`}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default () => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <strong data-testid="error-state">{error!.message}</strong>
      )}
    >
      <App />
    </ErrorBoundary>
  );
};
