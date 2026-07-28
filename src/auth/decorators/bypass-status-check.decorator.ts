import { SetMetadata } from '@nestjs/common';

export const BYPASS_STATUS_CHECK_KEY = 'bypassStatusCheck';
export const BypassStatusCheck = () =>
  SetMetadata(BYPASS_STATUS_CHECK_KEY, true);
