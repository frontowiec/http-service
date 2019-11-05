import React from "react";
import {
  render,
  wait,
  waitForElement,
  fireEvent
} from "@testing-library/react";
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

  const { getByTestId } = render(<App />);

  await wait(() => {
    expect(getByTestId("app-users-list")).toBeDefined();
  });

  clear();
});

it("renders error page when api call crashing", async () => {
  // mute console.error
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  const clear = httpService.mock.get<AjaxError<{ message: string }>>("/users", {
    name: "Ajax Error",
    status: 500,
    message: "Internal Server Error",
    response: { message: "Internal Server Error" }
  });

  const { getByTestId } = render(<App />);

  await wait(() => {
    expect(getByTestId("error-state")).toBeDefined();
  });

  consoleSpy.mockRestore();
  clear();
});

it("should add random user", async function() {
  const clearGet = httpService.mock.get<{ users: User[] }>("/users", {
    users: [
      {
        name: "Jan Kowalski",
        gender: "man",
        avatar: "http://www.avatar.com/jk",
        birthday: new Date().toLocaleDateString()
      }
    ]
  });

  const clearPost = httpService.mock.post<{ user: User }>("/users", {
    user: {
      avatar: "http//avatar.io",
      gender: "woman",
      name: "Jessica Alba",
      birthday: new Date().toLocaleDateString()
    }
  });

  const { getByTestId } = render(<App />);

  const addUserButton = await waitForElement(() =>
    getByTestId("add-user-button")
  );

  expect(addUserButton).toBeDefined();

  fireEvent.click(addUserButton);

  const addedListItem = await waitForElement(() =>
    getByTestId("app-users-list-item-1")
  );

  expect(addedListItem).toBeDefined();

  clearGet();
  clearPost();
});

it("should handle failed add random user action", async function() {
  // mute console.error
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  const clearGet = httpService.mock.get<{ users: User[] }>("/users", {
    users: [
      {
        name: "Jan Kowalski",
        gender: "man",
        avatar: "http://www.avatar.com/jk",
        birthday: new Date().toLocaleDateString()
      }
    ]
  });

  const clearPost = httpService.mock.post<AjaxError<{ message: string }>>(
    "/users",
    {
      name: "Ajax error",
      status: 500,
      message: "Internal Server Error",
      response: { message: "Internal Server Error" }
    }
  );

  const { getByTestId } = render(<App />);

  const addUserButton = await waitForElement(() =>
    getByTestId("add-user-button")
  );

  fireEvent.click(addUserButton);

  const errorPage = await waitForElement(() => getByTestId("error-state"));

  expect(errorPage).toBeDefined();

  clearGet();
  clearPost();
  consoleSpy.mockRestore();
});
