import {
  Controller,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  MemberManagementService
} from './member_management.service';
import { MemberManageActionDto } from './types/member_management.types';

@UseGuards(JwtAuthGuard)
@Controller('member-management')
export class MemberManagementController {
  constructor(
    private readonly memberManagementService: MemberManagementService,
  ) {}

  /**
   * Handle generic member management action
   * PATCH /member-management/action/:id
   */
  @Patch('/action/:id')
  async handleMemberAction(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: MemberManageActionDto,
  ) {
    return this.memberManagementService.handle_member_action(id, body);
  }

  /**
   * Update Status (Approve / Deactivate / Activate)
   * PATCH /member-management/update-status/:id
   */
  @Patch('/update-status/:id')
  async updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { action: MemberManageActionDto['action']; reason?: string },
  ) {
    return this.memberManagementService.handle_member_action(id, {
      action: body.action,
      reason: body.reason,
    });
  }

  /**
   * Block Account Route
   * PATCH /member-management/block/:id
   */
  @Patch('/block/:id')
  async blockUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason?: string },
  ) {
    return this.memberManagementService.handle_member_action(id, {
      action: 'block',
      reason: body.reason,
    });
  }

  /**
   * Unblock Account Route
   * PATCH /member-management/unblock/:id
   */
  @Patch('/unblock/:id')
  async unblockUser(@Param('id', ParseIntPipe) id: number) {
    return this.memberManagementService.handle_member_action(id, {
      action: 'unblock',
    });
  }

  /**
   * Suspend Account Route
   * PATCH /member-management/suspend/:id
   */
  @Patch('/suspend/:id')
  async suspendUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason?: string },
  ) {
    return this.memberManagementService.handle_member_action(id, {
      action: 'suspend',
      reason: body.reason,
    });
  }

  /**
   * Unsuspend Account Route
   * PATCH /member-management/unsuspend/:id
   */
  @Patch('/unsuspend/:id')
  async unsuspendUser(@Param('id', ParseIntPipe) id: number) {
    return this.memberManagementService.handle_member_action(id, {
      action: 'unsuspend',
    });
  }

  /**
   * Delete User (Soft Delete)
   * DELETE /member-management/delete/:id
   */
  @Delete('/delete/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason?: string },
  ) {
    return this.memberManagementService.handle_member_action(id, {
      action: 'delete',
      reason: body.reason,
    });
  }
}
