import { Email } from '@/api/user/entities/email.entity';
import { PhoneNumber } from '@/api/user/entities/phone-number.entity';
import { Uuid } from '@/common/types/common.type';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { Repository } from 'typeorm';
import { ErrorCode } from '../../constants/error-code.constant';
import { ValidationException } from '../../exceptions/validation.exception';
import { UserResDto } from './dto/user.res.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneByExternalId(externalId: string): Promise<UserResDto> {
    assert(externalId, 'id is required');
    this.logger.log('Fetching user by external id: ' + externalId);
    const user = await this.userRepository.findOneByOrFail({ externalId });
    if (user.isSuspended) {
      throw new ValidationException(ErrorCode.E0001);
    }
    return user.toDto(UserResDto);
  }

  async create(dto: {
    id: string;
    emails: string[];
    phoneNumbers: string[];
    firstName?: string;
    lastName?: string;
  }) {
    let user = await this.userRepository.findOne({
      where: [
        {
          externalId: dto.id,
        },
      ],
    });

    if (user) {
      throw new ValidationException(ErrorCode.E0002);
    }

    user = new UserEntity({
      externalId: dto.id,
      profileTag: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      emails: dto.emails.map((email, index) => new Email(email, index == 0)),
      phoneNumbers: dto.phoneNumbers.map((number) => new PhoneNumber(number)),
      needsEnrollment: true,
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.debug(`New User Created: ${savedUser}`);

    return savedUser.toDto(UserResDto);
  }

  async remove(id: Uuid) {
    await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.softDelete(id);
  }
}
