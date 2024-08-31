import { DataSource } from 'typeorm';
import { AbstractEntity } from './abstract.entity'; // Adjust the import path as necessary

// Create a mock class extending AbstractEntity for testing purposes
class TestEntity extends AbstractEntity {}

describe('AbstractEntity', () => {
  let testEntity: TestEntity;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    // Initialize the test entity
    testEntity = new TestEntity();
    testEntity.createdAt = new Date();
    testEntity.createdBy = 'user1';
    testEntity.updatedAt = new Date();
    testEntity.updatedBy = 'user2';

    // Create a mock DataSource with Jest
    mockDataSource = {
      entityMetadatasMap: new Map(),
    } as jest.Mocked<DataSource>;

    // Initialize entityMetadatasMap.get as a jest mock function
    mockDataSource.entityMetadatasMap.get = jest.fn();
  });

  describe('toDto', () => {
    it('should convert the entity to the specified DTO class', () => {
      class TestDto {
        createdAt: Date;
        createdBy: string;
        updatedAt: Date;
        updatedBy: string;
      }

      const dto = testEntity.toDto(TestDto);
      expect(dto).toBeInstanceOf(TestDto);
      expect(dto.createdAt).toEqual(testEntity.createdAt);
      expect(dto.createdBy).toEqual(testEntity.createdBy);
      expect(dto.updatedAt).toEqual(testEntity.updatedAt);
      expect(dto.updatedBy).toEqual(testEntity.updatedBy);
    });
  });

  describe('useDataSource', () => {
    it('should reorder columns based on the @Order decorator', () => {
      // Create a mock metadata for the entity
      const mockEntityMetadata = {
        columns: [
          { target: TestEntity, propertyName: 'createdAt' },
          { target: TestEntity, propertyName: 'updatedAt' },
          { target: TestEntity, propertyName: 'test' },
        ],
      };

      // Set up the mock to return our mock metadata
      (mockDataSource.entityMetadatasMap.get as jest.Mock).mockReturnValue(
        mockEntityMetadata,
      );

      // Call the static method
      AbstractEntity.useDataSource(mockDataSource);

      // Verify that the columns were reordered correctly
      const reorderedColumns = mockEntityMetadata.columns;
      expect(reorderedColumns[0].propertyName).toBe('test');
      expect(reorderedColumns[1].propertyName).toBe('createdAt');
    });
  });
});
