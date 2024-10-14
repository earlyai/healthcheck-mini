
// Unit tests for: activity


import { StatusCheck } from "@/types/checks";
import activity from '../../../src/checks/activity';



// Mock interface for Repo
interface MockRepo {
  pushed_at: string;
}

describe('activity() activity method', () => {
  let mockRepo: MockRepo;

  beforeEach(() => {
    // Initialize mockRepo with a default pushed_at date
    mockRepo = {
      pushed_at: new Date().toISOString(),
    };
  });

  describe('Happy Path', () => {
    it('should return success status when the last push was within 7 days', () => {
      // Set pushed_at to 5 days ago
      mockRepo.pushed_at = new Date(new Date().setDate(new Date().getDate() - 5)).toISOString();

      const result: StatusCheck = activity(mockRepo as any);

      expect(result.status).toBe('success');
      expect(result.description).toBe('Your project is active.');
      expect(result.extra).toBe('No action required.');
    });

    it('should return warning status when the last push was between 8 and 29 days ago', () => {
      // Set pushed_at to 15 days ago
      mockRepo.pushed_at = new Date(new Date().setDate(new Date().getDate() - 15)).toISOString();

      const result: StatusCheck = activity(mockRepo as any);

      expect(result.status).toBe('warning');
      expect(result.description).toBe('Your project needs more recent activity.');
      expect(result.extra).toBe('Are there any bugs that can be fixed?');
    });

    it('should return error status when the last push was 30 or more days ago', () => {
      // Set pushed_at to 35 days ago
      mockRepo.pushed_at = new Date(new Date().setDate(new Date().getDate() - 35)).toISOString();

      const result: StatusCheck = activity(mockRepo as any);

      expect(result.status).toBe('error');
      expect(result.description).toBe('There has been no activity for 35 days.');
      expect(result.extra).toBe('Are there any features that can be implemented?');
    });
  });

  describe('Edge Cases', () => {
    it('should handle exactly 7 days since last push as success', () => {
      // Set pushed_at to exactly 7 days ago
      mockRepo.pushed_at = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();

      const result: StatusCheck = activity(mockRepo as any);

      expect(result.status).toBe('success');
      expect(result.description).toBe('Your project is active.');
      expect(result.extra).toBe('No action required.');
    });

    it('should handle exactly 30 days since last push as error', () => {
      // Set pushed_at to exactly 30 days ago
      mockRepo.pushed_at = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();

      const result: StatusCheck = activity(mockRepo as any);

      expect(result.status).toBe('error');
      expect(result.description).toBe('There has been no activity for 30 days.');
      expect(result.extra).toBe('Are there any features that can be implemented?');
    });

    it('should throw an error if pushed_at is missing', () => {
      // Remove pushed_at property
      delete mockRepo.pushed_at;

      expect(() => activity(mockRepo as any)).toThrowError('Cannot read properties of undefined (reading \'pushed_at\')');
    });

    it('should throw an error if pushed_at is an invalid date', () => {
      // Set pushed_at to an invalid date
      mockRepo.pushed_at = 'invalid-date';

      expect(() => activity(mockRepo as any)).toThrowError('Invalid time value');
    });
  });
});

// End of unit tests for: activity
