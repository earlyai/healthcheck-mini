
// Unit tests for: topics


import { StatusCheck } from "@/types/checks";
import topics from '../../../src/checks/topics';


// Mock interface for Repo
interface MockRepo {
  topics: string[];
}

describe('topics() topics method', () => {
  let mockRepo: MockRepo;

  beforeEach(() => {
    // Initialize mockRepo with default values
    mockRepo = {
      topics: [],
    };
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return success when topics length is within the range', () => {
      // Test description: Ensure the function returns success when the number of topics is within the acceptable range.
      mockRepo.topics = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5', 'topic6'];
      const result: StatusCheck = topics(mockRepo as any);
      expect(result.status).toBe('success');
      expect(result.description).toBe('You have a good number of repo topics.');
      expect(result.extra).toBe('No action required.');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return error when there are no topics', () => {
      // Test description: Ensure the function returns an error when there are no topics.
      mockRepo.topics = [];
      const result: StatusCheck = topics(mockRepo as any);
      expect(result.status).toBe('error');
      expect(result.description).toBe('There are no repo topics at the top right.');
      expect(result.extra).toBe('It is important to be discoverable using topics.');
    });

    it('should return warning when topics length is less than minimum', () => {
      // Test description: Ensure the function returns a warning when the number of topics is less than the minimum required.
      mockRepo.topics = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5'];
      const result: StatusCheck = topics(mockRepo as any);
      expect(result.status).toBe('warning');
      expect(result.description).toBe('You should add some more topics.');
      expect(result.extra).toBe('Try to include more topics.');
    });

    it('should return warning when topics length is more than maximum', () => {
      // Test description: Ensure the function returns a warning when the number of topics exceeds the maximum allowed.
      mockRepo.topics = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5', 'topic6', 'topic7', 'topic8', 'topic9', 'topic10', 'topic11', 'topic12', 'topic13'];
      const result: StatusCheck = topics(mockRepo as any);
      expect(result.status).toBe('warning');
      expect(result.description).toBe('You may have too many topics.');
      expect(result.extra).toBe('Try reducing the amount of your topics.');
    });
  });
});

// End of unit tests for: topics
