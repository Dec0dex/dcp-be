import { TransformFnParams } from 'class-transformer';
import { instance, mock, when } from 'ts-mockito';
import { lowerCaseTransformer } from './lower-case.transformer'; // Replace with the correct path

// MockParams function to create mocked TransformFnParams
function mockParams(value: string | null | undefined): TransformFnParams {
  const mockParams = mock<TransformFnParams>();
  when(mockParams.value).thenReturn(value);
  return instance(mockParams);
}

describe('lowerCaseTransformer', () => {
  it('should transform the string to lowercase and trim spaces', () => {
    const params = mockParams('  Hello World  ');
    expect(lowerCaseTransformer(params)).toBe('hello world');
  });

  it('should return an empty string when the input is an empty string', () => {
    const params = mockParams('');
    expect(lowerCaseTransformer(params)).toBe('');
  });

  it('should return undefined when the input is undefined', () => {
    const params = mockParams(undefined);
    expect(lowerCaseTransformer(params)).toBeUndefined();
  });

  it('should handle strings with special characters', () => {
    const params = mockParams('  HéLLô WørLD  ');
    expect(lowerCaseTransformer(params)).toBe('héllô wørld');
  });
});
