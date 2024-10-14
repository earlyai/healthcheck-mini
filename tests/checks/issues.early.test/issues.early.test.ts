
// Unit tests for: issues


import { StatusCheck } from "@/types/checks";
import issues from '../../../src/checks/issues';


// Define a mock interface to simulate the Repo class
interface MockRepo {
  open_issues: number;
}

describe('issues() issues method', () => {
  // Happy path tests
  describe("Happy Path", () => {
    it("should return success status when open issues are greater than max", () => {
      // Arrange
      const mockRepo: MockRepo = { open_issues: 21 } as any;

      // Act
      const result: StatusCheck = issues(mockRepo as any);

      // Assert
      expect(result.status).toBe("success");
      expect(result.description).toBe("You have open issues.");
      expect(result.extra).toBe("No action required.");
    });

    it("should return warning status when open issues are between min and max", () => {
      // Arrange
      const mockRepo: MockRepo = { open_issues: 10 } as any;

      // Act
      const result: StatusCheck = issues(mockRepo as any);

      // Assert
      expect(result.status).toBe("warning");
      expect(result.description).toBe("You have some open issues.");
      expect(result.extra).toBe("Are there any bugs or features ideas you have?");
    });

    it("should return error status when open issues are less than min", () => {
      // Arrange
      const mockRepo: MockRepo = { open_issues: 3 } as any;

      // Act
      const result: StatusCheck = issues(mockRepo as any);

      // Assert
      expect(result.status).toBe("error");
      expect(result.description).toBe("There are not enough open issues.");
      expect(result.extra).toBe("Try creating some more, or asking the community for ideas.");
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should return warning status when open issues are exactly at min", () => {
      // Arrange
      const mockRepo: MockRepo = { open_issues: 5 } as any;

      // Act
      const result: StatusCheck = issues(mockRepo as any);

      // Assert
      expect(result.status).toBe("warning");
      expect(result.description).toBe("You have some open issues.");
      expect(result.extra).toBe("Are there any bugs or features ideas you have?");
    });

    it("should return warning status when open issues are exactly at max", () => {
      // Arrange
      const mockRepo: MockRepo = { open_issues: 20 } as any;

      // Act
      const result: StatusCheck = issues(mockRepo as any);

      // Assert
      expect(result.status).toBe("warning");
      expect(result.description).toBe("You have some open issues.");
      expect(result.extra).toBe("Are there any bugs or features ideas you have?");
    });

    it("should handle zero open issues gracefully", () => {
      // Arrange
      const mockRepo: MockRepo = { open_issues: 0 } as any;

      // Act
      const result: StatusCheck = issues(mockRepo as any);

      // Assert
      expect(result.status).toBe("error");
      expect(result.description).toBe("There are not enough open issues.");
      expect(result.extra).toBe("Try creating some more, or asking the community for ideas.");
    });

    it("should handle negative open issues gracefully", () => {
      // Arrange
      const mockRepo: MockRepo = { open_issues: -1 } as any;

      // Act
      const result: StatusCheck = issues(mockRepo as any);

      // Assert
      expect(result.status).toBe("error");
      expect(result.description).toBe("There are not enough open issues.");
      expect(result.extra).toBe("Try creating some more, or asking the community for ideas.");
    });
  });
});

// End of unit tests for: issues
