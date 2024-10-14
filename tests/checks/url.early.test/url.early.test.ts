
// Unit tests for: url


import { StatusCheck } from "@/types/checks";
import url from '../../../src/checks/url';


// Define the MockRepo interface to simulate the Repo class
interface MockRepo {
  homepage?: string;
}

describe('url() url method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    it('should return success status when repo has a homepage', () => {
      // Arrange: Create a mock repo with a homepage
      const mockRepo: MockRepo = {
        homepage: 'https://example.com',
      } as any;

      // Act: Call the url function with the mock repo
      const result: StatusCheck = url(mockRepo as any);

      // Assert: Verify the response
      expect(result.status).toBe('success');
      expect(result.description).toBe('You have a project url.');
      expect(result.extra).toBe('No action required.');
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should return error status when repo does not have a homepage', () => {
      // Arrange: Create a mock repo without a homepage
      const mockRepo: MockRepo = {} as any;

      // Act: Call the url function with the mock repo
      const result: StatusCheck = url(mockRepo as any);

      // Assert: Verify the response
      expect(result.status).toBe('error');
      expect(result.description).toBe(
        'There is no repo url under the description at the top right.'
      );
      expect(result.extra).toBe(
        'If you do not have a project url, you can add the website or docs url.'
      );
    });

    it('should handle undefined homepage gracefully', () => {
      // Arrange: Create a mock repo with an undefined homepage
      const mockRepo: MockRepo = {
        homepage: undefined,
      } as any;

      // Act: Call the url function with the mock repo
      const result: StatusCheck = url(mockRepo as any);

      // Assert: Verify the response
      expect(result.status).toBe('error');
      expect(result.description).toBe(
        'There is no repo url under the description at the top right.'
      );
      expect(result.extra).toBe(
        'If you do not have a project url, you can add the website or docs url.'
      );
    });

    it('should handle null homepage gracefully', () => {
      // Arrange: Create a mock repo with a null homepage
      const mockRepo: MockRepo = {
        homepage: null,
      } as any;

      // Act: Call the url function with the mock repo
      const result: StatusCheck = url(mockRepo as any);

      // Assert: Verify the response
      expect(result.status).toBe('error');
      expect(result.description).toBe(
        'There is no repo url under the description at the top right.'
      );
      expect(result.extra).toBe(
        'If you do not have a project url, you can add the website or docs url.'
      );
    });
  });
});

// End of unit tests for: url
