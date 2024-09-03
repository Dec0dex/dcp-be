import { ApiAuth } from '@/decorators/http.decorators';
import { Session } from '@/decorators/session.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserResDto } from './dto/user.res.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiAuth({
    type: UserResDto,
    summary: 'Get current user',
  })
  @Get('me')
  async getCurrentUser(
    @Session() session: SessionContainer,
  ): Promise<UserResDto> {
    return await this.userService.findOneByExternalId(session.getUserId());
  }
}
