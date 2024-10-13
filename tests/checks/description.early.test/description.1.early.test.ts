
// Unit tests for: description


import { StatusCheck } from "@/types/checks";
import description from '../../../src/checks/description';


// Mock interface for Repo
interface MockRepo {
  description?: string;
  homepage?: string;
}

describe('description() description method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return success status when description is present', () => {
      const mockRepo: MockRepo = {
        description: 'This is a valid description.',
      } as any;

      const result: StatusCheck = description(mockRepo as any);

      expect(result.status).toBe('success');
      expect(result.description).toBe('You have a repo description.');
      expect(result.extra).toBe('No action required.');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return error status when description is missing', () => {
      const mockRepo: MockRepo = {} as any;

      const result: StatusCheck = description(mockRepo as any);

      expect(result.status).toBe('error');
      expect(result.description).toBe('There is no repo description at the top right.');
      expect(result.extra).toBe('It is important to write a concise description about your repo.');
    });

    it('should return warning status when description is too short', () => {
      const mockRepo: MockRepo = {
        description: 'Short',
      } as any;

      const result: StatusCheck = description(mockRepo as any);

      expect(result.status).toBe('warning');
      expect(result.description).toBe('Your description may be too short.');
      expect(result.extra).toBe('Try to include more information.');
    });

    it('should return warning status when description is too long', () => {
      const longDescription = 'A'.repeat(201);
      const mockRepo: MockRepo = {
        description: longDescription,
      } as any;

      const result: StatusCheck = description(mockRepo as any);

      expect(result.status).toBe('warning');
      expect(result.description).toBe('Your description may be too long.');
      expect(result.extra).toBe('Try reducing the length of your description.');
    });

    it('should return warning status when description contains homepage URL', () => {
      const mockRepo: MockRepo = {
        description: 'This is a description with a URL http://example.com',
        homepage: 'http://example.com',
      } as any;

      const result: StatusCheck = description(mockRepo as any);

      expect(result.status).toBe('warning');
      expect(result.description).toBe('Your description contains a duplicate of the url.');
      expect(result.extra).toBe('You can remove the url from the description.');
    });
  });
});

// End of unit tests for: description
