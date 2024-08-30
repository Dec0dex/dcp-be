import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import generateModulesSet from './utils/modules-set';

jest.mock('./utils/modules-set', () => jest.fn());

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    // Mock the return value of generateModulesSet
    (generateModulesSet as jest.Mock).mockReturnValue([
      /* Add your mocked modules here */
    ]);

    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should call generateModulesSet', () => {
    expect(generateModulesSet).toHaveBeenCalled();
  });

  it('should have the correct imported modules', () => {
    const importedModules = module.get(AppModule);
    // Here you can add assertions to check the modules imported by AppModule
    // For example, if generateModulesSet returns a specific set of modules:
    expect(importedModules).toBeDefined();
    // Additional assertions based on what you expect in the module
  });
});
