import { SetMetadata } from '@nestjs/common';
import { Permision } from '../enums';

export const PERMISIONS_KEY = 'permisions';
export const RequiredPermisions = (...permisions: Permision[]) =>
  SetMetadata(PERMISIONS_KEY, permisions);
