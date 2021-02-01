import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Email } from './email.entity';

import { EnhancedBaseEntity } from './enhanced-base.entity';

@Entity({ name: 'users', synchronize: false })
export class User extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true
  })
  email: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 26
  })
  username: string;

  @Column({
    type: 'boolean',
    default: false
  })
  isEmailConfirmed: boolean;

  @OneToMany(
    () => Email,
    email => email.user,
    { lazy: true }
  )
  emails: Email[];
}
