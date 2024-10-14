
// Unit tests for: license


import { StatusCheck } from "@/types/checks";
import license from '../../../src/checks/license';


// Mock interface for Community
interface MockCommunity {
  files?: {
    license?: boolean;
  };
}

describe('license() license method', () => {
  // Happy Path Tests
  describe("Happy Path", () => {
    it("should return success status when a license file is present", () => {
      // Arrange: Create a mock community with a license file
      const mockCommunity: MockCommunity = {
        files: {
          license: true,
        },
      } as any;

      // Act: Call the license function
      const result: StatusCheck = license(mockCommunity as any);

      // Assert: Check if the result is as expected
      expect(result.status).toBe("success");
      expect(result.description).toBe("You have a license.");
      expect(result.extra).toBe("No action required.");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return error status when no files object is present", () => {
      // Arrange: Create a mock community without files
      const mockCommunity: MockCommunity = {} as any;

      // Act: Call the license function
      const result: StatusCheck = license(mockCommunity as any);

      // Assert: Check if the result is as expected
      expect(result.status).toBe("error");
      expect(result.description).toBe("You do not have a license in your repo.");
      expect(result.extra).toBe("This does not mean it is moe Open Source but less.");
    });

    it("should return error status when files object is present but no license file", () => {
      // Arrange: Create a mock community with files but no license
      const mockCommunity: MockCommunity = {
        files: {},
      } as any;

      // Act: Call the license function
      const result: StatusCheck = license(mockCommunity as any);

      // Assert: Check if the result is as expected
      expect(result.status).toBe("error");
      expect(result.description).toBe("You do not have a license in your repo.");
      expect(result.extra).toBe("This does not mean it is moe Open Source but less.");
    });
  });
});

// End of unit tests for: license
