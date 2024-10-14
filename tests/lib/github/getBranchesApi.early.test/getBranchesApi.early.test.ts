
// Unit tests for: getBranchesApi


import { Branch } from "@/models/github/branch";
import extractOwnerRepo from "../../../../src/lib/github/extractOwnerRepo";
import getBranchesApi from '../../../../src/lib/github/getBranchesApi';


// Mock the extractOwnerRepo function
jest.mock("../../../../src/lib/github/extractOwnerRepo", () => {
  const actual = jest.requireActual("../../../../src/lib/github/extractOwnerRepo");
  return {
    __esModule: true,
    ...actual,
    default: jest.fn(),
  };
});

// Mock the global fetch function
global.fetch = jest.fn();

describe('getBranchesApi() getBranchesApi method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should return branch data when given a valid repo URL', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      const mockBranches: Branch[] = [{ name: 'main' }, { name: 'dev' }];
      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: 'owner', repo: 'repo' });
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockBranches),
      });

      // Act
      const result = await getBranchesApi(repoUrl);

      // Assert
      expect(extractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/branches',
        { next: { revalidate: 3600 } }
      );
      expect(result).toEqual(mockBranches);
    });
  });

  describe('Edge Cases', () => {
    it('should handle an empty repo URL gracefully', async () => {
      // Arrange
      const repoUrl = '';
      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: '', repo: '' });
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue([]),
      });

      // Act
      const result = await getBranchesApi(repoUrl);

      // Assert
      expect(extractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos//branches',
        { next: { revalidate: 3600 } }
      );
      expect(result).toEqual([]);
    });

    it('should handle fetch errors gracefully', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: 'owner', repo: 'repo' });
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Act & Assert
      await expect(getBranchesApi(repoUrl)).rejects.toThrow('Network error');
    });

    it('should handle non-JSON responses gracefully', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: 'owner', repo: 'repo' });
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      // Act & Assert
      await expect(getBranchesApi(repoUrl)).rejects.toThrow('Invalid JSON');
    });
  });
});

// End of unit tests for: getBranchesApi
