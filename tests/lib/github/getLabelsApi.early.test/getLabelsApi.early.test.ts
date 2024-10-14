
// Unit tests for: getLabelsApi


import { Label } from "@/models/github/label";
import extractOwnerRepo from "../../../../src/lib/github/extractOwnerRepo";
import getLabelsApi from '../../../../src/lib/github/getLabelsApi';


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

describe('getLabelsApi() getLabelsApi method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should fetch labels successfully for a valid repo URL', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      const mockLabels: Label[] = [{ name: 'bug' }, { name: 'feature' }];
      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: 'owner', repo: 'repo' });
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockLabels),
      });

      // Act
      const labels = await getLabelsApi(repoUrl);

      // Assert
      expect(extractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/labels',
        { next: { revalidate: 3600 } }
      );
      expect(labels).toEqual(mockLabels);
    });
  });

  describe('Edge Cases', () => {
    it('should handle an invalid repo URL gracefully', async () => {
      // Arrange
      const repoUrl = 'invalid-url';
      (extractOwnerRepo as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid URL');
      });

      // Act & Assert
      await expect(getLabelsApi(repoUrl)).rejects.toThrow('Invalid URL');
      expect(extractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle fetch errors gracefully', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: 'owner', repo: 'repo' });
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Act & Assert
      await expect(getLabelsApi(repoUrl)).rejects.toThrow('Network error');
      expect(extractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/labels',
        { next: { revalidate: 3600 } }
      );
    });

    it('should handle non-JSON responses gracefully', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      (extractOwnerRepo as jest.Mock).mockReturnValue({ owner: 'owner', repo: 'repo' });
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      // Act & Assert
      await expect(getLabelsApi(repoUrl)).rejects.toThrow('Invalid JSON');
      expect(extractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/labels',
        { next: { revalidate: 3600 } }
      );
    });
  });
});

// End of unit tests for: getLabelsApi
