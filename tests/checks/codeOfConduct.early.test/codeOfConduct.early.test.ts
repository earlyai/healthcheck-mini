
// Unit tests for: codeOfConduct


import { StatusCheck } from "@/types/checks";
import codeOfConduct from '../../../src/checks/codeOfConduct';


// Mock interface for Community
interface MockCommunity {
  files?: {
    code_of_conduct?: boolean;
  };
}

describe('codeOfConduct() codeOfConduct method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return success status when code_of_conduct file is present', () => {
      // Arrange: Create a mock community with a code_of_conduct file
      const mockCommunity: MockCommunity = {
        files: {
          code_of_conduct: true,
        },
      } as any;

      // Act: Call the function with the mock community
      const result: StatusCheck = codeOfConduct(mockCommunity as any);

      // Assert: Verify the result is as expected
      expect(result.status).toBe('success');
      expect(result.description).toBe('You have a CoC.');
      expect(result.extra).toBe('No action required.');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return error status when files object is undefined', () => {
      // Arrange: Create a mock community with no files
      const mockCommunity: MockCommunity = {} as any;

      // Act: Call the function with the mock community
      const result: StatusCheck = codeOfConduct(mockCommunity as any);

      // Assert: Verify the result is as expected
      expect(result.status).toBe('error');
      expect(result.description).toBe('You do not have a CoC in your repo.');
      expect(result.extra).toBe('This is important for people to know your project and community is safe.');
    });

    it('should return error status when code_of_conduct file is not present', () => {
      // Arrange: Create a mock community with files but no code_of_conduct
      const mockCommunity: MockCommunity = {
        files: {},
      } as any;

      // Act: Call the function with the mock community
      const result: StatusCheck = codeOfConduct(mockCommunity as any);

      // Assert: Verify the result is as expected
      expect(result.status).toBe('error');
      expect(result.description).toBe('You do not have a CoC in your repo.');
      expect(result.extra).toBe('This is important for people to know your project and community is safe.');
    });
  });
});

// End of unit tests for: codeOfConduct
