import { OffsetPaginationDto } from '@/common/dto/offset-pagination/offset-pagination.dto';
import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { SelectQueryBuilder } from 'typeorm';
import { paginate } from './offset-pagination';

// Mock SelectQueryBuilder
jest.mock('typeorm', () => ({
  SelectQueryBuilder: jest.fn().mockImplementation(() => ({
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getCount: jest.fn(),
  })),
}));

describe('paginate', () => {
  let builder: SelectQueryBuilder<any>;

  beforeEach(() => {
    builder = new SelectQueryBuilder<any>({} as any);
  });

  it('should return entities and metaDto with default options', async () => {
    const pageOptionsDto = new PageOptionsDto({ limit: 10, page: 1 });
    const entities = [{ id: 1 }, { id: 2 }] as any[];
    builder.getMany = jest.fn().mockResolvedValue(entities);
    builder.getCount = jest.fn().mockResolvedValue(20);

    const [result, metaDto] = await paginate(builder, pageOptionsDto);

    expect(result).toEqual(entities);
    expect(metaDto).toBeInstanceOf(OffsetPaginationDto);
    expect(metaDto.totalRecords).toBe(20);
    expect(metaDto.limit).toBe(pageOptionsDto.limit);
    expect(metaDto.currentPage).toBe(pageOptionsDto.page);
  });

  it('should skip and take with custom options', async () => {
    const pageOptionsDto = new PageOptionsDto({ limit: 5, page: 2 });

    const entities = [{ id: 1 }, { id: 2 }] as any[];
    builder.getMany = jest.fn().mockResolvedValue(entities);
    builder.getCount = jest.fn().mockResolvedValue(15);

    const [result, metaDto] = await paginate(builder, pageOptionsDto);

    expect(builder.skip).toHaveBeenCalledWith(pageOptionsDto.offset);
    expect(builder.take).toHaveBeenCalledWith(pageOptionsDto.limit);
    expect(result).toEqual(entities);
    expect(metaDto.totalRecords).toBe(15);
    expect(metaDto.limit).toBe(pageOptionsDto.limit);
    expect(metaDto.currentPage).toBe(pageOptionsDto.page);
  });

  it('should handle skipCount and takeAll options', async () => {
    const pageOptionsDto = new PageOptionsDto({ limit: 5, page: 2 });

    const entities = [{ id: 1 }, { id: 2 }] as any[];
    builder.getMany = jest.fn().mockResolvedValue(entities);

    // No count query due to skipCount option
    const [result, metaDto] = await paginate(builder, pageOptionsDto, {
      skipCount: true,
    });

    expect(builder.skip).toHaveBeenCalledWith(pageOptionsDto.offset);
    expect(builder.take).toHaveBeenCalledWith(pageOptionsDto.limit);
    expect(builder.getCount).not.toHaveBeenCalled();
    expect(result).toEqual(entities);
    expect(metaDto.totalRecords).toBe(-1); // Since skipCount is true, count is not queried
    expect(metaDto.limit).toBe(pageOptionsDto.limit);
    expect(metaDto.currentPage).toBe(pageOptionsDto.page);
  });

  it('should handle takeAll option', async () => {
    const pageOptionsDto = new PageOptionsDto();

    const entities = [{ id: 1 }, { id: 2 }] as any[];
    builder.getMany = jest.fn().mockResolvedValue(entities);

    // No skip and take due to takeAll option
    const [result, metaDto] = await paginate(builder, pageOptionsDto, {
      takeAll: true,
    });

    expect(builder.skip).not.toHaveBeenCalled();
    expect(builder.take).not.toHaveBeenCalled();
    expect(result).toEqual(entities);
    expect(metaDto.totalRecords).toBe(-1); // Count should not be fetched due to takeAll option
    expect(metaDto.limit).toBe(pageOptionsDto.limit);
    expect(metaDto.currentPage).toBe(pageOptionsDto.page);
  });
});
