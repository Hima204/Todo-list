import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import axios from "axios";

// Mock axios
jest.mock("axios");

describe("To-Do App", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("adds a task and checks if it appears", async () => {
    // Initial fetch returns empty list
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<App />);

    // Simulate user typing a new task
    const input = screen.getByPlaceholderText("Add a task...");
    fireEvent.change(input, { target: { value: "Learn Testing" } });

    // Mock POST request for creating a todo
    axios.post.mockResolvedValueOnce({});

    // After adding, mock GET to return the new todo
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "1",
          title: "Learn Testing",
          completed: false,
          pinned: false,
        },
      ],
    });

    // Click the Add button
    fireEvent.click(screen.getByText("Add"));

    // Wait for the new todo to appear
    await waitFor(() =>
      expect(screen.getByText("Learn Testing")).toBeInTheDocument()
    );
  });
  test("marks a task as complete and checks status update", async () => {
    // Initial fetch returns one incomplete todo
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "2",
          title: "Write tests",
          completed: false,
          pinned: false,
        },
      ],
    });

    render(<App />);

    // Wait for the todo to appear
    expect(await screen.findByText("Write tests")).toBeInTheDocument();

    // Mock PUT request for updating todo
    axios.put.mockResolvedValueOnce({});

    // After update, mock GET to return the completed todo
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "2",
          title: "Write tests",
          completed: true,
          pinned: false,
        },
      ],
    });

    // Click the checkbox to mark as complete
    fireEvent.click(screen.getByRole("checkbox"));

    // Wait for the completed style to be applied
    await waitFor(() => {
      const todoText = screen.getByText("Write tests");
      expect(todoText).toHaveClass("completed");
    });
  });
});
