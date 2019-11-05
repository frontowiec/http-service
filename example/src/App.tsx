import React, { useEffect, useState } from "react";
import { AjaxError, HttpService } from "http-service";
import ErrorBoundary from "react-error-boundary";

export const httpService = new HttpService({
  host: "http://localhost:4000/api",
  enabledMock: process.env.NODE_ENV === "test",
  mockDelay: 100,
  reqInterceptor(req) {
    return { ...req, headers: { Authorization: "its-not-real-token" } };
  },
  resInterceptor(res) {
    return res.then((r: any) => {
      return {
        users: r.users.map((user: User) => ({
          ...user,
          name: user.name.toUpperCase()
        }))
      } as any;
    });
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

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<AjaxError | null>(null);

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
    <ul data-testid="app-users-list">
      {users.map(user => (
        <li key={user.name}>{user.name}</li>
      ))}
    </ul>
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
