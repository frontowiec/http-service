import React, { useEffect, useState } from "react";

interface User {
  name: string;
  gender: string;
  birthday: string;
  avatar: string;
}

const getUsers = () => {
  return fetch("http://localhost:4000/api/users").then(response =>
    response.json()
  ) as Promise<{ users: User[] }>;
};

const App = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(({ users }) => setUsers(users));
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user.name}>{user.name}</li>
      ))}
    </ul>
  );
};

export default App;
