import { Max, Min } from 'class-validator';
import 'reflect-metadata';
import { NumberField, StringField } from '../decorators/field.decorators';
import validateConfig from './validate-config'; // Adjust import based on your actual file structure

class TestConfig {
  @StringField()
  TEST_STRING: string;

  @NumberField()
  @Min(1)
  @Max(10)
  TEST_INT: number;
}

describe('validateConfig', () => {
  it('should validate a correct configuration', () => {
    const config = {
      TEST_STRING: 'valid_string',
      TEST_INT: 5,
    };

    const result = validateConfig(config, TestConfig);

    expect(result).toEqual({
      TEST_STRING: 'valid_string',
      TEST_INT: 5,
    });
  });

  it('should implicit cast field values', () => {
    const config = {
      TEST_STRING: 123,
      TEST_INT: 5,
    };

    expect(() => validateConfig(config, TestConfig)).not.toThrowError();
  });

  it('should throw an error for invalid configuration (integer)', () => {
    const config = {
      TEST_STRING: 'valid_string',
      TEST_INT: 20, // Invalid value, should be between 1 and 10
    };

    expect(() => validateConfig(config, TestConfig)).toThrowError(
      '\nError in TEST_INT: \n+ max: TEST_INT must not be greater than 10',
    );
  });

  it('should throw an error for multiple validation failures', () => {
    const config = {
      TEST_STRING: 123, // Invalid type, should be a string
      TEST_INT: -5, // Invalid value, should be between 1 and 10
    };

    expect(() => validateConfig(config, TestConfig)).toThrowError();
  });

  it('should handle missing required properties', () => {
    const config = {
      TEST_INT: 5, // Missing TEST_STRING
    };

    expect(() => validateConfig(config, TestConfig)).toThrowError(
      '\nError in TEST_STRING: \n+ isString: TEST_STRING must be a string',
    );
  });
});
