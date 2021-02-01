import { User } from '../../entities/user.entity';

export interface Email {
  to: string;
  subject: string;
  body: string;
  type: EmailType;
  user: User;
  uuid?: string;
}

export enum EmailType {
  ConfirmEmail = 'confirm-email'
}
