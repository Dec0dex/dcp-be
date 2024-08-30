import { ApiModule } from '@/api/api.module';
import { MailModule } from '@/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import generateModulesSet from './modules-set'; // Adjust the import path accordingly

describe('generateModulesSet', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should include all modules when MODULES_SET is "monolith"', () => {
    process.env.MODULES_SET = 'monolith';

    const modules = generateModulesSet();

    expect(modules).toBeDefined();
    expect(modules).toEqual(expect.arrayContaining([ApiModule, MailModule]));
  });

  it('should include all modules when MODULES_SET is "api"', () => {
    process.env.MODULES_SET = 'api';

    const modules = generateModulesSet();

    expect(modules).toBeDefined();
    expect(modules).toEqual(expect.arrayContaining([ApiModule, MailModule]));
  });

  it('should log an error for unsupported MODULES_SET values', () => {
    process.env.MODULES_SET = 'unsupported';

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const modules = generateModulesSet();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Unsupported modules set: unsupported',
    );

    // Since unsupported modules set might not include all expected modules, just ensure ConfigModule is present
    expect(modules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          module: ConfigModule,
        }),
      ]),
    );

    consoleErrorSpy.mockRestore();
  });
});
