import { mock } from 'ts-mockito';
import { CursorPaginationDto } from './cursor-pagination.dto';
import { CursorPaginatedDto } from './paginated.dto';

describe('CursorPaginatedDto', () => {
  it('should correctly initialize with provided values', () => {
    const paginationMeta = mock<CursorPaginationDto>();
    const data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    const dto = new CursorPaginatedDto(data, paginationMeta);

    // Assertions
    expect(dto.data).toEqual(data);
    expect(dto.pagination).toBe(paginationMeta);
  });
});
