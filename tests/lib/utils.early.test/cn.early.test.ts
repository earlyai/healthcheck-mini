
// Unit tests for: cn


import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cn } from '../../../src/lib/utils';



// Mocking the ClassValue type
type MockClassValue = {
  className: string;
  isActive: boolean;
};

// Mocking the clsx function
jest.mock("clsx", () => ({
  clsx: jest.fn(),
}));

// Mocking the twMerge function
jest.mock("tailwind-merge", () => ({
  twMerge: jest.fn(),
}));

// Importing the cn function
describe('cn() cn method', () => {
  beforeEach(() => {
    // Resetting mocks before each test
    (clsx as jest.Mock).mockReset();
    (twMerge as jest.Mock).mockReset();
  });

  // Happy path tests
  describe("Happy path", () => {
    it("should return merged class names when valid class values are provided", () => {
      // Arrange
      const mockInput1: MockClassValue = { className: "text-center", isActive: true } as any;
      const mockInput2: MockClassValue = { className: "bg-blue-500", isActive: true } as any;
      (clsx as jest.Mock).mockReturnValue("text-center bg-blue-500" as any);
      (twMerge as jest.Mock).mockReturnValue("text-center bg-blue-500" as any);

      // Act
      const result = cn(mockInput1, mockInput2);

      // Assert
      expect(clsx).toHaveBeenCalledWith([mockInput1, mockInput2] as any);
      expect(twMerge).toHaveBeenCalledWith("text-center bg-blue-500" as any);
      expect(result).toBe("text-center bg-blue-500");
    });
  });

  // Edge case tests
  describe("Edge cases", () => {
    it("should handle empty input gracefully", () => {
      // Arrange
      (clsx as jest.Mock).mockReturnValue("" as any);
      (twMerge as jest.Mock).mockReturnValue("" as any);

      // Act
      const result = cn();

      // Assert
      expect(clsx).toHaveBeenCalledWith([] as any);
      expect(twMerge).toHaveBeenCalledWith("" as any);
      expect(result).toBe("");
    });

    it("should handle null and undefined values in input", () => {
      // Arrange
      const mockInput1: MockClassValue = { className: "text-center", isActive: true } as any;
      (clsx as jest.Mock).mockReturnValue("text-center" as any);
      (twMerge as jest.Mock).mockReturnValue("text-center" as any);

      // Act
      const result = cn(mockInput1, null as any, undefined as any);

      // Assert
      expect(clsx).toHaveBeenCalledWith([mockInput1, null, undefined] as any);
      expect(twMerge).toHaveBeenCalledWith("text-center" as any);
      expect(result).toBe("text-center");
    });

    it("should handle inputs with false isActive property", () => {
      // Arrange
      const mockInput1: MockClassValue = { className: "text-center", isActive: false } as any;
      (clsx as jest.Mock).mockReturnValue("" as any);
      (twMerge as jest.Mock).mockReturnValue("" as any);

      // Act
      const result = cn(mockInput1);

      // Assert
      expect(clsx).toHaveBeenCalledWith([mockInput1] as any);
      expect(twMerge).toHaveBeenCalledWith("" as any);
      expect(result).toBe("");
    });
  });
});

// End of unit tests for: cn
