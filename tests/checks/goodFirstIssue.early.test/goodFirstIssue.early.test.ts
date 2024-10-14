
// Unit tests for: goodFirstIssue


import { StatusCheck } from "@/types/checks";
import goodFirstIssue from '../../../src/checks/goodFirstIssue';


// Mock interface to simulate the Issue class
interface MockIssue {
  labels: string[];
}

// Test suite for goodFirstIssue function
describe('goodFirstIssue() goodFirstIssue method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    it('should return success when there are more than 3 good first issues', () => {
      const mockIssues: MockIssue[] = [
        { labels: ['good first issue'] },
        { labels: ['good first issue'] },
        { labels: ['good first issue'] },
        { labels: ['good first issue'] },
      ] as any;

      const result: StatusCheck = goodFirstIssue(mockIssues as any);

      expect(result.status).toBe('success');
      expect(result.description).toBe(
        'Great you have open issues with the label good first issue that are ready to be assigned'
      );
      expect(result.extra).toBe('No action required');
    });

    it('should return warning when there are 3 or fewer good first issues', () => {
      const mockIssues: MockIssue[] = [
        { labels: ['good first issue'] },
        { labels: ['good first issue'] },
        { labels: ['good first issue'] },
      ] as any;

      const result: StatusCheck = goodFirstIssue(mockIssues as any);

      expect(result.status).toBe('warning');
      expect(result.description).toBe(
        'You currently only have 3 issue that has the label good first issue and is not already assigned'
      );
      expect(result.extra).toBe('These need to be open and not already assigned');
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should return error when there are no good first issues', () => {
      const mockIssues: MockIssue[] = [
        { labels: ['bug'] },
        { labels: ['enhancement'] },
      ] as any;

      const result: StatusCheck = goodFirstIssue(mockIssues as any);

      expect(result.status).toBe('error');
      expect(result.description).toBe(
        'You have no open and unassigned good first issues'
      );
      expect(result.extra).toBe(
        'You will not be appearing in the issue and label search on GitHub'
      );
    });

    it('should handle mixed case labels correctly', () => {
      const mockIssues: MockIssue[] = [
        { labels: ['Good First Issue'] },
        { labels: ['good-first-issue'] },
      ] as any;

      const result: StatusCheck = goodFirstIssue(mockIssues as any);

      expect(result.status).toBe('warning');
      expect(result.description).toBe(
        'You currently only have 2 issue that has the label good first issue and is not already assigned'
      );
      expect(result.extra).toBe('These need to be open and not already assigned');
    });

    it('should return error when issues array is empty', () => {
      const mockIssues: MockIssue[] = [] as any;

      const result: StatusCheck = goodFirstIssue(mockIssues as any);

      expect(result.status).toBe('error');
      expect(result.description).toBe(
        'You have no open and unassigned good first issues'
      );
      expect(result.extra).toBe(
        'You will not be appearing in the issue and label search on GitHub'
      );
    });
  });
});

// End of unit tests for: goodFirstIssue
