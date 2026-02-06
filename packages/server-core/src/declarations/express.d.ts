import type { PassportEntity } from '../modules/passport/entities/passport.entity';
import type { UserEntity } from '../modules/user/entities/user.entity';
import type { RoleEntity } from 'src/modules/permission/entities/role.entity';

declare global {
  namespace Express {
    interface Request {
      __passport: PassportEntity | null;
      __user: UserEntity | null;
      __roles: RoleEntity[];
    }
  }
}
