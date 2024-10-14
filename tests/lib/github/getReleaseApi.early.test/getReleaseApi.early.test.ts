
// Unit tests for: getReleaseApi


import extractOwnerRepo from "../../../../src/lib/github/extractOwnerRepo";
import getReleaseApi from '../../../../src/lib/github/getReleaseApi';


// Mocking extractOwnerRepo
jest.mock("../../../../src/lib/github/extractOwnerRepo", () => {
  const actual = jest.requireActual("../../../../src/lib/github/extractOwnerRepo");
  return {
    __esModule: true,
    ...actual,
    default: jest.fn(),
  };
});

describe('getReleaseApi() getReleaseApi method', () => {
  const mockExtractOwnerRepo = extractOwnerRepo as jest.MockedFunction<typeof extractOwnerRepo>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should fetch the latest release data for a valid repository URL', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      const mockResponse = { tag_name: 'v1.0.0' };
      mockExtractOwnerRepo.mockReturnValue({ owner: 'owner', repo: 'repo' });
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
        })
      ) as jest.Mock;

      // Act
      const result = await getReleaseApi(repoUrl);

      // Assert
      expect(mockExtractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/releases/latest',
        { next: { revalidate: 3600 } }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Edge Cases', () => {
    it('should handle a non-existent repository gracefully', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/nonexistent-repo';
      mockExtractOwnerRepo.mockReturnValue({ owner: 'owner', repo: 'nonexistent-repo' });
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.reject(new Error('Not Found')),
        })
      ) as jest.Mock;

      // Act & Assert
      await expect(getReleaseApi(repoUrl)).rejects.toThrow('Not Found');
      expect(mockExtractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/nonexistent-repo/releases/latest',
        { next: { revalidate: 3600 } }
      );
    });

    it('should handle invalid JSON response gracefully', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      mockExtractOwnerRepo.mockReturnValue({ owner: 'owner', repo: 'repo' });
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.reject(new SyntaxError('Unexpected token')),
        })
      ) as jest.Mock;

      // Act & Assert
      await expect(getReleaseApi(repoUrl)).rejects.toThrow(SyntaxError);
      expect(mockExtractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/releases/latest',
        { next: { revalidate: 3600 } }
      );
    });

    it('should handle network errors gracefully', async () => {
      // Arrange
      const repoUrl = 'https://github.com/owner/repo';
      mockExtractOwnerRepo.mockReturnValue({ owner: 'owner', repo: 'repo' });
      global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;

      // Act & Assert
      await expect(getReleaseApi(repoUrl)).rejects.toThrow('Network Error');
      expect(mockExtractOwnerRepo).toHaveBeenCalledWith(repoUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/releases/latest',
        { next: { revalidate: 3600 } }
      );
    });
  });
});

// End of unit tests for: getReleaseApi
