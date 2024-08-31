import 'reflect-metadata';
import { SelectQueryBuilder } from 'typeorm';
import Paginator, {
  buildPaginator,
  Order,
  PaginationOptions,
} from './cursor-pagination';

// Mock the SelectQueryBuilder class from 'typeorm'
jest.mock('typeorm', () => ({
  SelectQueryBuilder: jest.fn().mockImplementation(() => ({
    andWhere: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue([]),
  })),
}));

describe('Paginator', () => {
  let paginator: Paginator<any>;
  const mockEntity = function () {} as any; // Replace with an actual mock entity or type if needed

  beforeEach(() => {
    paginator = new Paginator(mockEntity, ['id']);
  });

  it('should initialize with default values', () => {
    expect(paginator).toBeDefined();
    expect(paginator['limit']).toBe(100);
    expect(paginator['order']).toBe(Order.DESC);
  });

  it('should set alias correctly', () => {
    paginator.setAlias('customAlias');
    // Ensure that the alias is set correctly
    expect(paginator['alias']).toBe('customAlias');
  });

  it('should set and use afterCursor correctly', () => {
    paginator.setAfterCursor('cursorValue');
    // Verify that the afterCursor is set correctly
    expect(paginator['afterCursor']).toBe('cursorValue');
  });

  it('should set and use beforeCursor correctly', () => {
    paginator.setBeforeCursor('cursorValue');
    // Verify that the beforeCursor is set correctly
    expect(paginator['beforeCursor']).toBe('cursorValue');
  });

  it('should set and use limit correctly', () => {
    paginator.setLimit(50);
    // Verify that the limit is set correctly
    expect(paginator['limit']).toBe(50);
  });

  it('should set and use order correctly', () => {
    paginator.setOrder(Order.ASC);
    // Verify that the order is set correctly
    expect(paginator['order']).toBe(Order.ASC);
  });

  it('should build paging query correctly', async () => {
    const builder = new SelectQueryBuilder(mockEntity);
    builder.getMany = jest.fn().mockResolvedValue([]);
    const result = await paginator.paginate(builder);
    expect(result).toEqual({
      data: [],
      cursor: { beforeCursor: null, afterCursor: null },
    });
  });

  describe('buildPaginator function', () => {
    it('should build paginator with default options', () => {
      const paginator = buildPaginator({ entity: mockEntity });
      expect(paginator).toBeInstanceOf(Paginator);
      expect(paginator['paginationKeys']).toEqual(['id']);
    });

    it('should build paginator with custom options', () => {
      const options: PaginationOptions<any> = {
        entity: mockEntity,
        alias: 'customAlias',
        query: {
          afterCursor: 'afterCursorValue',
          beforeCursor: 'beforeCursorValue',
          limit: 10,
          order: Order.ASC,
        },
        paginationKeys: ['id', 'name'],
      };
      const paginator = buildPaginator(options);
      expect(paginator).toBeInstanceOf(Paginator);
      expect(paginator['alias']).toBe('customAlias');
      expect(paginator['afterCursor']).toBe('afterCursorValue');
      expect(paginator['beforeCursor']).toBe('beforeCursorValue');
      expect(paginator['limit']).toBe(10);
      expect(paginator['order']).toBe(Order.ASC);
      expect(paginator['paginationKeys']).toEqual(['id', 'name']);
    });
  });
});
