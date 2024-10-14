
// Unit tests for: release


import { StatusCheck } from "@/types/checks";
import { differenceInDays } from "date-fns";
import release from '../../../src/checks/release';

// Import necessary modules and functions


// Import necessary modules and functions
// Mock the differenceInDays function from date-fns
jest.mock("date-fns", () => ({
  differenceInDays: jest.fn(),
}));

// Define a mock interface for Release
interface MockRelease {
  created_at: string | null;
}

// Test suite for the release function
describe('release() release method', () => {
  let mockRelease: MockRelease;

  beforeEach(() => {
    // Initialize the mockRelease object before each test
    mockRelease = {
      created_at: null,
    };
  });

  // Happy path tests
  describe('Happy Path', () => {
    it('should return success when the release is recent (<= 30 days)', () => {
      // Arrange
      mockRelease.created_at = '2023-09-01';
      (differenceInDays as jest.Mock).mockReturnValue(20);

      // Act
      const result: StatusCheck = release(mockRelease as any);

      // Assert
      expect(result.status).toBe('success');
      expect(result.description).toBe('Your project has a recent release.');
      expect(result.extra).toBe('No action required.');
    });

    it('should return warning when the release is between 31 and 89 days', () => {
      // Arrange
      mockRelease.created_at = '2023-07-01';
      (differenceInDays as jest.Mock).mockReturnValue(60);

      // Act
      const result: StatusCheck = release(mockRelease as any);

      // Assert
      expect(result.status).toBe('warning');
      expect(result.description).toBe('Your project might need a more recent release.');
      expect(result.extra).toBe('Are there any improvments you wish to collect together and release?');
    });

    it('should return error when the release is 90 or more days old', () => {
      // Arrange
      mockRelease.created_at = '2023-05-01';
      (differenceInDays as jest.Mock).mockReturnValue(100);

      // Act
      const result: StatusCheck = release(mockRelease as any);

      // Assert
      expect(result.status).toBe('error');
      expect(result.description).toBe('There has been no release for 100 days.');
      expect(result.extra).toBe('Are there any features or bugs that can be implemented?');
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should return error when created_at is null', () => {
      // Arrange
      mockRelease.created_at = null;

      // Act
      const result: StatusCheck = release(mockRelease as any);

      // Assert
      expect(result.status).toBe('error');
      expect(result.description).toBe('There are no releases.');
      expect(result.extra).toBe('If your project is ready for people to use, it is recommended to create a release.');
    });

    it('should handle the exact boundary of 30 days correctly', () => {
      // Arrange
      mockRelease.created_at = '2023-09-01';
      (differenceInDays as jest.Mock).mockReturnValue(30);

      // Act
      const result: StatusCheck = release(mockRelease as any);

      // Assert
      expect(result.status).toBe('success');
      expect(result.description).toBe('Your project has a recent release.');
      expect(result.extra).toBe('No action required.');
    });

    it('should handle the exact boundary of 90 days correctly', () => {
      // Arrange
      mockRelease.created_at = '2023-06-01';
      (differenceInDays as jest.Mock).mockReturnValue(90);

      // Act
      const result: StatusCheck = release(mockRelease as any);

      // Assert
      expect(result.status).toBe('error');
      expect(result.description).toBe('There has been no release for 90 days.');
      expect(result.extra).toBe('Are there any features or bugs that can be implemented?');
    });
  });
});

// End of unit tests for: release
