import { mock } from 'ts-mockito';
import { OffsetPaginationDto } from './offset-pagination.dto';
import { PageOptionsDto } from './page-options.dto';
import { OffsetPaginatedDto } from './paginated.dto';

describe('OffsetPaginatedDto', () => {
  it('should correctly initialize with provided values', () => {
    const paginationMeta = new OffsetPaginationDto(10, mock<PageOptionsDto>());
    const data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    const dto = new OffsetPaginatedDto(data, paginationMeta);

    // Assertions
    expect(dto.data).toEqual(data);
    expect(dto.pagination).toBe(paginationMeta);
  });

  it('should expose properties correctly', () => {
    const paginationMeta = new OffsetPaginationDto(10, mock<PageOptionsDto>());
    const data = [{ id: 1, name: 'Item 1' }];

    const dto = new OffsetPaginatedDto(data, paginationMeta);

    // Use class-transformer to check exposed properties
    const exposedDto = JSON.parse(JSON.stringify(dto));

    // Assertions
    expect(exposedDto.data).toEqual(data);
    expect(exposedDto.pagination).toBeDefined();
  });
});
