import { IsString, validate } from 'class-validator';
import { IsNullable } from './is-nullable.decorator'; // Replace with the correct path

class TestClass {
  @IsNullable()
  @IsString()
  nullableString?: string | null;
}

describe('IsNullable', () => {
  it('should allow null values', async () => {
    const instance = new TestClass();
    instance.nullableString = null;

    const errors = await validate(instance);
    expect(errors.length).toBe(0); // No errors expected
  });

  it('should allow valid non-null values', async () => {
    const instance = new TestClass();
    instance.nullableString = 'Valid String';

    const errors = await validate(instance);
    expect(errors.length).toBe(0); // No errors expected
  });

  it('should fail validation for invalid non-null values', async () => {
    const instance = new TestClass();
    instance.nullableString = 123 as any; // Invalid: Not a string

    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0); // Expect errors
    expect(errors[0].constraints?.isString).toBeDefined();
  });

  it('should fail validation when a required field is undefined', async () => {
    const instance = new TestClass();

    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0); // Expect errors
    expect(errors[0].constraints?.isString).toBeDefined();
  });
});
