
// Unit tests for: checkSummary


import { checkSummary } from '../../../src/checks/index';


// Mocking the necessary modules
jest.mock("../../../src/checks/description", () => {
  const actual = jest.requireActual("../../../src/checks/description");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/url", () => {
  const actual = jest.requireActual("../../../src/checks/url");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/topics", () => {
  const actual = jest.requireActual("../../../src/checks/topics");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/activity", () => {
  const actual = jest.requireActual("../../../src/checks/activity");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/issues", () => {
  const actual = jest.requireActual("../../../src/checks/issues");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/defaultBranch", () => {
  const actual = jest.requireActual("../../../src/checks/defaultBranch");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/goodFirstIssue", () => {
  const actual = jest.requireActual("../../../src/checks/goodFirstIssue");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/branches", () => {
  const actual = jest.requireActual("../../../src/checks/branches");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/release", () => {
  const actual = jest.requireActual("../../../src/checks/release");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/readme", () => {
  const actual = jest.requireActual("../../../src/checks/readme");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/license", () => {
  const actual = jest.requireActual("../../../src/checks/license");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/contributing", () => {
  const actual = jest.requireActual("../../../src/checks/contributing");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/pullRequestTemplate", () => {
  const actual = jest.requireActual("../../../src/checks/pullRequestTemplate");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/codeOfConduct", () => {
  const actual = jest.requireActual("../../../src/checks/codeOfConduct");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("../../../src/checks/labels", () => {
  const actual = jest.requireActual("../../../src/checks/labels");
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(),
  };
});

// MockStatusCheck interface
interface MockStatusCheck {
  status: 'success' | 'warning' | 'error';
}

// Test suite for checkSummary
describe('checkSummary() checkSummary method', () => {
  describe('Happy Path', () => {
    it('should correctly count the number of success, warning, and error statuses', () => {
      const checks: MockStatusCheck[] = [
        { status: 'success' },
        { status: 'success' },
        { status: 'warning' },
        { status: 'error' },
        { status: 'error' },
      ] as any;

      const result = checkSummary(checks as any);

      expect(result).toEqual({
        success: 2,
        warning: 1,
        error: 2,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return zero counts when no checks are provided', () => {
      const checks: MockStatusCheck[] = [] as any;

      const result = checkSummary(checks as any);

      expect(result).toEqual({
        success: 0,
        warning: 0,
        error: 0,
      });
    });

    it('should handle all checks being of one status type', () => {
      const checks: MockStatusCheck[] = [
        { status: 'success' },
        { status: 'success' },
        { status: 'success' },
      ] as any;

      const result = checkSummary(checks as any);

      expect(result).toEqual({
        success: 3,
        warning: 0,
        error: 0,
      });
    });

    it('should handle mixed status types with zero success', () => {
      const checks: MockStatusCheck[] = [
        { status: 'warning' },
        { status: 'error' },
        { status: 'error' },
      ] as any;

      const result = checkSummary(checks as any);

      expect(result).toEqual({
        success: 0,
        warning: 1,
        error: 2,
      });
    });
  });
});

// End of unit tests for: checkSummary
