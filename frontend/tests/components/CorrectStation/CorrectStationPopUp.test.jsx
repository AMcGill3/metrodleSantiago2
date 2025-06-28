import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CorrectStation } from "../../../src/components/CorrectStation/CorrectStation.jsx";

describe("CorrectStation", () => {
  it("renders the correct station name", () => {
    const mockStation = {
      name: "Plaza de Armas",
      lines: ["3", "5"],
      coordinates: [839.5, 456.5],
    };
    render(<CorrectStation targetStation={mockStation} />);

    expect(screen.getByText("La próxima estación es:")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Plaza de Armas"
    );
    expect(screen.getByText("Deje bajar antes de subir")).toBeInTheDocument();
  });
});