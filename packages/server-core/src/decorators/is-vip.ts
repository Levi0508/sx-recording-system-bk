import { SetMetadata } from '@nestjs/common';

export const IsVIP = () => {
  return SetMetadata('IsVIP', true);
};
