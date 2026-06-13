import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JoiValidationPipe } from '../common';
import { JwtPayload } from '../common/interfaces';
import { changePasswordSchema, updateProfileSchema } from './schemas';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.getProfile(user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update profile' })
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body(new JoiValidationPipe(updateProfileSchema))
    body: { name?: string; email?: string; locale?: string },
  ) {
    return this.usersService.updateProfile(user.sub, body);
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Change password' })
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body(new JoiValidationPipe(changePasswordSchema))
    body: { currentPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(
      user.sub,
      body.currentPassword,
      body.newPassword,
    );
  }
}
