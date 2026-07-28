export interface MemberManageActionDto {
  action:
    | 'approve'
    | 'block'
    | 'unblock'
    | 'suspend'
    | 'unsuspend'
    | 'deactivate'
    | 'activate'
    | 'delete';
  reason?: string;
}
