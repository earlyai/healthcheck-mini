
// Unit tests for: getRepoApi


import { Repo } from "@/models/github/repo";
import extractOwnerRepo from "../../../../src/lib/github/extractOwnerRepo";
import getRepoApi from '../../../../src/lib/github/getRepoApi';


// Import necessary modules and functions
// Mock the extractOwnerRepo function
jest.mock("../../../../src/lib/github/extractOwnerRepo", () => {
  const actual = jest.requireActual("../../../../src/lib/github/extractOwnerRepo");
  return {
    ...actual,
    default: jest.fn(),
    __esModule: true,
  };
});
// Mock the global fetch function
global.fetch = jest.fn();

describe('getRepoApi() getRepoApi method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should fetch and return repo data successfully', async () => {
      // Arrange
      const mockRepoUrl = 'https://github.com/owner/repo';
      const mockOwner = 'owner';
      const mockRepo = 'repo';
      const mockRepoData: Repo = { /* mock repo data */ };

      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: mockOwner, repo: mockRepo });
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockRepoData),
      });

      // Act
      const result = await getRepoApi(mockRepoUrl);

      // Assert
      expect(extractOwnerRepo).toHaveBeenCalledWith(mockRepoUrl);
      expect(global.fetch).toHaveBeenCalledWith(`https://api.github.com/repos/${mockOwner}/${mockRepo}`, {
        next: { revalidate: 3600 },
      });
      expect(result).toEqual(mockRepoData);
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid repo URL gracefully', async () => {
      // Arrange
      const invalidRepoUrl = 'invalid-url';
      (extractOwnerRepo as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid URL');
      });

      // Act & Assert
      await expect(getRepoApi(invalidRepoUrl)).rejects.toThrow('Invalid URL');
      expect(extractOwnerRepo).toHaveBeenCalledWith(invalidRepoUrl);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle fetch failure gracefully', async () => {
      // Arrange
      const mockRepoUrl = 'https://github.com/owner/repo';
      const mockOwner = 'owner';
      const mockRepo = 'repo';

      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: mockOwner, repo: mockRepo });
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      // Act & Assert
      await expect(getRepoApi(mockRepoUrl)).rejects.toThrow('Fetch failed');
      expect(extractOwnerRepo).toHaveBeenCalledWith(mockRepoUrl);
      expect(global.fetch).toHaveBeenCalledWith(`https://api.github.com/repos/${mockOwner}/${mockRepo}`, {
        next: { revalidate: 3600 },
      });
    });

    it('should handle non-JSON response gracefully', async () => {
      // Arrange
      const mockRepoUrl = 'https://github.com/owner/repo';
      const mockOwner = 'owner';
      const mockRepo = 'repo';

      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: mockOwner, repo: mockRepo });
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      // Act & Assert
      await expect(getRepoApi(mockRepoUrl)).rejects.toThrow('Invalid JSON');
      expect(extractOwnerRepo).toHaveBeenCalledWith(mockRepoUrl);
      expect(global.fetch).toHaveBeenCalledWith(`https://api.github.com/repos/${mockOwner}/${mockRepo}`, {
        next: { revalidate: 3600 },
      });
    });
  });
});

// End of unit tests for: getRepoApi
