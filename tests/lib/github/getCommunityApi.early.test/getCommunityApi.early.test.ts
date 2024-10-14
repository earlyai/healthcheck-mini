
// Unit tests for: getCommunityApi


import { Community } from "@/models/github/community";
import extractOwnerRepo from "../../../../src/lib/github/extractOwnerRepo";
import getCommunityApi from '../../../../src/lib/github/getCommunityApi';


// Import necessary modules and functions
// Mock the extractOwnerRepo function
jest.mock("../../../../src/lib/github/extractOwnerRepo", () => {
  const actual = jest.requireActual("../../../../src/lib/github/extractOwnerRepo");
  return {
    ...actual,
    default: jest.fn(),
  };
});

// Mock the global fetch function
global.fetch = jest.fn();

describe('getCommunityApi() getCommunityApi method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should fetch community profile data successfully', async () => {
      // Arrange
      const mockRepoUrl = 'https://github.com/owner/repo';
      const mockOwner = 'owner';
      const mockRepo = 'repo';
      const mockCommunityData: Community = { /* mock community data */ };

      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: mockOwner, repo: mockRepo });
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockCommunityData),
      });

      // Act
      const result = await getCommunityApi(mockRepoUrl);

      // Assert
      expect(extractOwnerRepo).toHaveBeenCalledWith(mockRepoUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.github.com/repos/${mockOwner}/${mockRepo}/community/profile`,
        { next: { revalidate: 3600 } }
      );
      expect(result).toEqual(mockCommunityData);
    });
  });

  describe('Edge Cases', () => {
    it('should handle fetch failure gracefully', async () => {
      // Arrange
      const mockRepoUrl = 'https://github.com/owner/repo';
      const mockOwner = 'owner';
      const mockRepo = 'repo';

      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: mockOwner, repo: mockRepo });
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Act & Assert
      await expect(getCommunityApi(mockRepoUrl)).rejects.toThrow('Network error');
    });

    it('should handle invalid JSON response gracefully', async () => {
      // Arrange
      const mockRepoUrl = 'https://github.com/owner/repo';
      const mockOwner = 'owner';
      const mockRepo = 'repo';

      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: mockOwner, repo: mockRepo });
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      // Act & Assert
      await expect(getCommunityApi(mockRepoUrl)).rejects.toThrow('Invalid JSON');
    });

    it('should handle invalid repo URL gracefully', async () => {
      // Arrange
      const mockRepoUrl = 'invalid-url';

      (extractOwnerRepo as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid URL');
      });

      // Act & Assert
      await expect(getCommunityApi(mockRepoUrl)).rejects.toThrow('Invalid URL');
    });
  });
});

// End of unit tests for: getCommunityApi
