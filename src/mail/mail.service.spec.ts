import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

// Mock the MailerService
const mockMailerService = {
  sendMail: jest.fn(),
};

describe('MailService', () => {
  let mailService: MailService;

  beforeEach(async () => {
    // Create a testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  describe('sendEmailVerification', () => {
    it('should call mailerService.sendMail with correct parameters', async () => {
      const email = 'test@example.com';
      const token = '12345';
      const url = `example.com/auth/verify-email?token=${token}`;

      // Mock the sendMail function to resolve successfully
      mockMailerService.sendMail.mockResolvedValue({});

      await mailService.sendEmailVerification(email, token);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'Email Verification',
        template: 'email-verification',
        context: {
          email,
          url,
        },
      });
    });
  });
});
