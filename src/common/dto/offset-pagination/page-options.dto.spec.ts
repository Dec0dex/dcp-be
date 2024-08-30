import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_LIMIT,
  Order,
} from '@/constants/app.constant';
import { PageOptionsDto } from './page-options.dto';

// Mock the default values
describe('PageOptionsDto', () => {
  it('should initialize with default values', () => {
    const dto = new PageOptionsDto();

    // Assertions
    expect(dto.limit).toBe(DEFAULT_PAGE_LIMIT);
    expect(dto.page).toBe(DEFAULT_CURRENT_PAGE);
    expect(dto.q).toBeUndefined();
    expect(dto.order).toBe(Order.ASC);
    expect(dto.offset).toBe(0);
  });

  it('should correctly initialize with provided values', () => {
    const dto = new PageOptionsDto();
    (dto as any).limit = 20;
    (dto as any).page = 2;
    (dto as any).q = 'test';
    (dto as any).order = Order.DESC;

    // Assertions
    expect(dto.limit).toBe(20);
    expect(dto.page).toBe(2);
    expect(dto.q).toBe('test');
    expect(dto.order).toBe(Order.DESC);
    expect(dto.offset).toBe(20); // (2 - 1) * 20
  });

  it('should handle offset calculation correctly', () => {
    const dto = new PageOptionsDto();
    (dto as any).limit = 10;
    (dto as any).page = 3;

    // Assertions
    expect(dto.offset).toBe(20); // (3 - 1) * 10
  });
});
