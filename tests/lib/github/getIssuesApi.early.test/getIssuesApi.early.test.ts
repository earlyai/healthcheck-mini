
// Unit tests for: getIssuesApi


import { Issue } from "@/models/github/issue";
import extractOwnerRepo from "../../../../src/lib/github/extractOwnerRepo";
import getIssuesApi from '../../../../src/lib/github/getIssuesApi';


// Mock the extractOwnerRepo function
jest.mock("../../../../src/lib/github/extractOwnerRepo", () => {
  const actual = jest.requireActual("../../../../src/lib/github/extractOwnerRepo");
  return {
    __esModule: true,
    ...actual,
    default: jest.fn(),
  };
});

describe('getIssuesApi() getIssuesApi method', () => {
  const mockExtractOwnerRepo = extractOwnerRepo as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should fetch issues successfully for a valid repo URL', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      const mockIssues: Issue[] = [{ id: 1, title: 'Issue 1' }, { id: 2, title: 'Issue 2' }];
      mockExtractOwnerRepo.mockReturnValue({ owner: 'owner', repo: 'repo' });
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockIssues),
        })
      ) as jest.Mock;

      // Act
      const issues = await getIssuesApi(repoUrl);

      // Assert
      expect(mockExtractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/repos/owner/repo/issues', {
        next: { revalidate: 3600 },
      });
      expect(issues).toEqual(mockIssues);
    });
  });

  describe('Edge Cases', () => {
    it('should handle an empty repo URL gracefully', async () => {
      // Arrange
      const repoUrl = '';
      mockExtractOwnerRepo.mockReturnValue({ owner: '', repo: '' });
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve([]),
        })
      ) as jest.Mock;

      // Act
      const issues = await getIssuesApi(repoUrl);

      // Assert
      expect(mockExtractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/repos//issues', {
        next: { revalidate: 3600 },
      });
      expect(issues).toEqual([]);
    });

    it('should handle fetch errors gracefully', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      mockExtractOwnerRepo.mockReturnValue({ owner: 'owner', repo: 'repo' });
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock;

      // Act & Assert
      await expect(getIssuesApi(repoUrl)).rejects.toThrow('Network error');
      expect(mockExtractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/repos/owner/repo/issues', {
        next: { revalidate: 3600 },
      });
    });

    it('should handle non-JSON responses gracefully', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      mockExtractOwnerRepo.mockReturnValue({ owner: 'owner', repo: 'repo' });
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.reject(new Error('Invalid JSON')),
        })
      ) as jest.Mock;

      // Act & Assert
      await expect(getIssuesApi(repoUrl)).rejects.toThrow('Invalid JSON');
      expect(mockExtractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/repos/owner/repo/issues', {
        next: { revalidate: 3600 },
      });
    });
  });
});

// End of unit tests for: getIssuesApi
