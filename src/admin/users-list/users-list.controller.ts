import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersListService } from './users-list.service';

@UseGuards(JwtAuthGuard)
@Controller('users-list')
export class UsersListController {
  constructor(private readonly userListService: UsersListService) {}
  @Get('/get-list')
  public async get_all_users() {
    return await this.userListService.get_all_users();
  }

  @Get('/get-profile/:id')
  public async get_profile_by_id(@Param('id', ParseIntPipe) userId: number) {
    return await this.userListService.get_profile_by_id(userId);
  }
}
