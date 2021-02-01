import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EnhancedBaseEntity } from './enhanced-base.entity';
import { User } from './user.entity';

@Entity({ name: 'email' })
export class Email extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar'
  })
  email: string;

  @ManyToOne(
    () => User,
    user => user.emails,
    { lazy: true }
  )
  user: User;

  @Column({
    type: 'varchar'
  })
  type: string;

  @Column({
    type: 'timestamp',
    default: new Date()
  })
  sent?: Date;

  @Column({
    type: 'varchar'
  })
  uuid: string;

  @Column({
    type: 'boolean',
    default: true
  })
  isActive: boolean;
}
