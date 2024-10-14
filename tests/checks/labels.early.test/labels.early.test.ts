
// Unit tests for: labels


import { Label } from "@/models/github/label";
import { StatusCheck } from "@/types/checks";
import labels from '../../../src/checks/labels';


describe('labels() labels method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return success status when labels length is greater than or equal to max', () => {
      const inputLabels: Label[] = Array(12).fill({
        id: 1,
        node_id: 'node1',
        url: 'http://example.com',
        name: 'label',
        color: 'ffffff',
        default: false,
        description: 'A label',
      });

      const expected: StatusCheck = {
        title: 'Labels',
        status: 'success',
        description: 'You have multiple custom labels.',
        extra: 'No action required.',
      };

      expect(labels(inputLabels)).toEqual(expected);
    });

    it('should return warning status when labels length is between min and max', () => {
      const inputLabels: Label[] = Array(5).fill({
        id: 1,
        node_id: 'node1',
        url: 'http://example.com',
        name: 'label',
        color: 'ffffff',
        default: false,
        description: 'A label',
      });

      const expected: StatusCheck = {
        title: 'Labels',
        status: 'warning',
        description: 'You might need more custom labels.',
        extra: 'Try creating some more, have a look at other repos for ideas.',
      };

      expect(labels(inputLabels)).toEqual(expected);
    });

    it('should return error status when labels length is less than or equal to min', () => {
      const inputLabels: Label[] = Array(3).fill({
        id: 1,
        node_id: 'node1',
        url: 'http://example.com',
        name: 'label',
        color: 'ffffff',
        default: false,
        description: 'A label',
      });

      const expected: StatusCheck = {
        title: 'Labels',
        status: 'error',
        description: 'There are not enough custom labels.',
        extra: 'This is useful for filtering issues.',
      };

      expect(labels(inputLabels)).toEqual(expected);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle an empty array of labels', () => {
      const inputLabels: Label[] = [];

      const expected: StatusCheck = {
        title: 'Labels',
        status: 'error',
        description: 'There are not enough custom labels.',
        extra: 'This is useful for filtering issues.',
      };

      expect(labels(inputLabels)).toEqual(expected);
    });

    it('should handle exactly min number of labels', () => {
      const inputLabels: Label[] = Array(3).fill({
        id: 1,
        node_id: 'node1',
        url: 'http://example.com',
        name: 'label',
        color: 'ffffff',
        default: false,
        description: 'A label',
      });

      const expected: StatusCheck = {
        title: 'Labels',
        status: 'error',
        description: 'There are not enough custom labels.',
        extra: 'This is useful for filtering issues.',
      };

      expect(labels(inputLabels)).toEqual(expected);
    });

    it('should handle exactly max number of labels', () => {
      const inputLabels: Label[] = Array(12).fill({
        id: 1,
        node_id: 'node1',
        url: 'http://example.com',
        name: 'label',
        color: 'ffffff',
        default: false,
        description: 'A label',
      });

      const expected: StatusCheck = {
        title: 'Labels',
        status: 'success',
        description: 'You have multiple custom labels.',
        extra: 'No action required.',
      };

      expect(labels(inputLabels)).toEqual(expected);
    });
  });
});

// End of unit tests for: labels
