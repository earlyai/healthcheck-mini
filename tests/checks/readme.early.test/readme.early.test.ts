
// Unit tests for: readme


import { StatusCheck } from "@/types/checks";
import readme from '../../../src/checks/readme';


// Mock interface to simulate the Community class
interface MockCommunity {
  files?: {
    readme?: boolean;
  };
}

describe('readme() readme method', () => {
  // Happy path tests
  describe("Happy Path", () => {
    it("should return success when a README file is present", () => {
      // Arrange: Create a mock community with a README file
      const mockCommunity: MockCommunity = {
        files: {
          readme: true,
        },
      } as any;

      // Act: Call the readme function
      const result: StatusCheck = readme(mockCommunity as any);

      // Assert: Verify the response
      expect(result.status).toBe("success");
      expect(result.description).toBe("You have a README file.");
      expect(result.extra).toBe("No action required.");
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should return error when no files object is present", () => {
      // Arrange: Create a mock community without files
      const mockCommunity: MockCommunity = {} as any;

      // Act: Call the readme function
      const result: StatusCheck = readme(mockCommunity as any);

      // Assert: Verify the response
      expect(result.status).toBe("error");
      expect(result.description).toBe("You do not have a readme.md file in your repo.");
      expect(result.extra).toBe("This is the most important file in your project.");
    });

    it("should return error when files object is present but README is missing", () => {
      // Arrange: Create a mock community with files but no README
      const mockCommunity: MockCommunity = {
        files: {},
      } as any;

      // Act: Call the readme function
      const result: StatusCheck = readme(mockCommunity as any);

      // Assert: Verify the response
      expect(result.status).toBe("error");
      expect(result.description).toBe("You do not have a readme.md file in your repo.");
      expect(result.extra).toBe("This is the most important file in your project.");
    });
  });
});

// End of unit tests for: readme
