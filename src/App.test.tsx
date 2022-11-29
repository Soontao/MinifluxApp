import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders without crashing", async () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
  expect(await screen.findByText("Token")).toBeInTheDocument();
});
