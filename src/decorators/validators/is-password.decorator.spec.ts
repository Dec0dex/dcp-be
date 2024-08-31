import { validateSync } from 'class-validator';
import { IsPassword } from './is-password.decorator';

class TestPasswordDto {
  @IsPassword({ message: 'Password is not valid' })
  password: string;
}

describe('IsPassword', () => {
  it('should pass validation for a valid password', () => {
    const dto = new TestPasswordDto();
    dto.password = 'ValidP@ssw0rd';

    const errors = validateSync(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation for an invalid password', () => {
    const dto = new TestPasswordDto();
    dto.password = 'Invalid Password';

    const errors = validateSync(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isPassword).toBe('Password is not valid');
  });

  it('should return default message if no custom message is provided', () => {
    class TestDefaultMessageDto {
      @IsPassword()
      password: string;
    }

    const dto = new TestDefaultMessageDto();
    dto.password = 'Invalid Password';

    const errors = validateSync(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isPassword).toBe('password is invalid');
  });

  it('should pass validation for an empty password', () => {
    const dto = new TestPasswordDto();
    dto.password = '';

    const errors = validateSync(dto);

    expect(errors.length).toBe(0);
  });

  it('should pass validation for a password with special characters', () => {
    const dto = new TestPasswordDto();
    dto.password = '!@#$%^&*123456Aa';

    const errors = validateSync(dto);

    expect(errors.length).toBe(0);
  });
});
