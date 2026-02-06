import { SetMetadata } from '@nestjs/common';

export const StatementAction = (action: string | string[]) => {
  return SetMetadata(
    'StatementAction',
    Array.isArray(action) ? action : [action],
  );
};
