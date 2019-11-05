import React from "react";
import { render, wait } from "@testing-library/react";
import { AjaxError } from "http-service";

import App, { httpService, User } from "./App";

it("renders without crashing", async () => {
  const clear = httpService.mock.get<{ users: User[] }>("/users", {
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
    expect(getByTestId("app-users-list")).toBeDefined();
    debug();
  });

  clear();
});

it("renders error page when api call crashing", async () => {
  // mute console.error
  jest.spyOn(console, "error").mockImplementation(() => {});

  httpService.mock.get<AjaxError<{ message: string }>>("/users", {
    name: "Ajax Error",
    status: 500,
    message: "Internal Server Error",
    response: { message: "Internal Server Error" }
  });

  const { getByTestId, debug } = render(<App />);

  await wait(() => {
    expect(getByTestId("error-state")).toBeDefined();
    debug();
  });
});
