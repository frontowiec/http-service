import React from "react";
import App, { httpService, User } from "./App";
import { render, wait } from "@testing-library/react";

it("renders without crashing", async () => {
  httpService.mock.get<{ users: User[] }>("/users", {
    users: [
      {
        name: "Jan Kowalski",
        gender: "man",
        avatar: "http://www.avatar.com/jk",
        birthday: new Date().toLocaleDateString()
      }
    ]
  });
  const { getByTestId, debug } = render(<App />);

  await wait(() => {
    debug();

    expect(getByTestId("app-users-list")).toBeDefined();
  });
});
