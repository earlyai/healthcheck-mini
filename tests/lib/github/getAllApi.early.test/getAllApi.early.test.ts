
// Unit tests for: getAllApi


import getAllApi from '../../../../src/lib/github/getAllApi';
import getBranchesApi from "../../../../src/lib/github/getBranchesApi";
import getCommunityApi from "../../../../src/lib/github/getCommunityApi";
import getIssuesApi from "../../../../src/lib/github/getIssuesApi";
import getLabelsApi from "../../../../src/lib/github/getLabelsApi";
import getReleaseApi from "../../../../src/lib/github/getReleaseApi";
import getRepoApi from "../../../../src/lib/github/getRepoApi";


// Mocking the imported functions
jest.mock("../../../../src/lib/github/getRepoApi", () => {
  const actual = jest.requireActual("../../../../src/lib/github/getRepoApi");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../../src/lib/github/getIssuesApi", () => {
  const actual = jest.requireActual("../../../../src/lib/github/getIssuesApi");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../../src/lib/github/getCommunityApi", () => {
  const actual = jest.requireActual("../../../../src/lib/github/getCommunityApi");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../../src/lib/github/getBranchesApi", () => {
  const actual = jest.requireActual("../../../../src/lib/github/getBranchesApi");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../../src/lib/github/getReleaseApi", () => {
  const actual = jest.requireActual("../../../../src/lib/github/getReleaseApi");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../../src/lib/github/getLabelsApi", () => {
  const actual = jest.requireActual("../../../../src/lib/github/getLabelsApi");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

describe('getAllApi() getAllApi method', () => {
  const mockRepoData = { id: 1, name: 'repo' };
  const mockIssuesData = [{ id: 1, title: 'issue' }];
  const mockCommunityData = { id: 1, name: 'community' };
  const mockBranchesData = [{ id: 1, name: 'branch' }];
  const mockReleaseData = { id: 1, version: 'v1.0' };
  const mockLabelsData = [{ id: 1, name: 'label' }];

  beforeEach(() => {
    (getRepoApi as jest.Mock).mockResolvedValue(mockRepoData);
    (getIssuesApi as jest.Mock).mockResolvedValue(mockIssuesData);
    (getCommunityApi as jest.Mock).mockResolvedValue(mockCommunityData);
    (getBranchesApi as jest.Mock).mockResolvedValue(mockBranchesData);
    (getReleaseApi as jest.Mock).mockResolvedValue(mockReleaseData);
    (getLabelsApi as jest.Mock).mockResolvedValue(mockLabelsData);
  });

  describe('Happy Path', () => {
    it('should return all data correctly when all API calls succeed', async () => {
      const repoUrl = 'https://api.github.com/repos/user/repo';
      const result = await getAllApi(repoUrl);

      expect(result).toEqual({
        repo: mockRepoData,
        issues: mockIssuesData,
        community: mockCommunityData,
        branches: mockBranchesData,
        release: mockReleaseData,
        labels: mockLabelsData,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty repoUrl gracefully', async () => {
      const repoUrl = '';
      const result = await getAllApi(repoUrl);

      expect(result).toEqual({
        repo: mockRepoData,
        issues: mockIssuesData,
        community: mockCommunityData,
        branches: mockBranchesData,
        release: mockReleaseData,
        labels: mockLabelsData,
      });
    });

    it('should handle API call failures gracefully', async () => {
      (getRepoApi as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const repoUrl = 'https://api.github.com/repos/user/repo';
      await expect(getAllApi(repoUrl)).rejects.toThrow('API Error');
    });
  });
});

// End of unit tests for: getAllApi
