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
}
