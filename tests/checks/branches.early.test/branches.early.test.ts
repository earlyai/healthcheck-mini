
// Unit tests for: branches


import { StatusCheck } from "@/types/checks";
import branches from '../../../src/checks/branches';


// Define a mock interface for Branch
interface MockBranch {
  name: string;
}

// Test suite for the branches function
describe('branches() branches method', () => {
  // Happy path tests
  describe('Happy Path', () => {
    it('should return success status when branches length is less than or equal to min', () => {
      // Arrange
      const mockBranches: MockBranch[] = Array(5).fill({ name: 'branch' }) as any;

      // Act
      const result: StatusCheck = branches(mockBranches);

      // Assert
      expect(result.status).toBe('success');
      expect(result.description).toBe('You have a small amount of branches.');
      expect(result.extra).toBe('No action required');
    });

    it('should return warning status when branches length is between min and max', () => {
      // Arrange
      const mockBranches: MockBranch[] = Array(7).fill({ name: 'branch' }) as any;

      // Act
      const result: StatusCheck = branches(mockBranches);

      // Assert
      expect(result.status).toBe('warning');
      expect(result.description).toBe('You have 7 number of branches which is higher than the recommended');
      expect(result.extra).toBe('Are any of these branhes stale and can be deleted?');
    });

    it('should return error status when branches length is greater than max', () => {
      // Arrange
      const mockBranches: MockBranch[] = Array(11).fill({ name: 'branch' }) as any;

      // Act
      const result: StatusCheck = branches(mockBranches);

      // Assert
      expect(result.status).toBe('error');
      expect(result.description).toBe('You have a high number of branches, which can cause confusion.');
      expect(result.extra).toBe('Can any of these branches be removed?');
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should return unknown status with no data available when branches is null', () => {
      // Arrange
      const mockBranches = null as any;

      // Act
      const result: StatusCheck = branches(mockBranches);

      // Assert
      expect(result.status).toBe('unknown');
      expect(result.description).toBe('No data available');
      expect(result.extra).toBe('-');
    });

    it('should return success status when branches length is exactly min', () => {
      // Arrange
      const mockBranches: MockBranch[] = Array(5).fill({ name: 'branch' }) as any;

      // Act
      const result: StatusCheck = branches(mockBranches);

      // Assert
      expect(result.status).toBe('success');
      expect(result.description).toBe('You have a small amount of branches.');
      expect(result.extra).toBe('No action required');
    });

    it('should return warning status when branches length is exactly max', () => {
      // Arrange
      const mockBranches: MockBranch[] = Array(10).fill({ name: 'branch' }) as any;

      // Act
      const result: StatusCheck = branches(mockBranches);

      // Assert
      expect(result.status).toBe('warning');
      expect(result.description).toBe('You have 10 number of branches which is higher than the recommended');
      expect(result.extra).toBe('Are any of these branhes stale and can be deleted?');
    });
  });
});

// End of unit tests for: branches
