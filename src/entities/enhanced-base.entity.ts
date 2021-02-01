import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class EnhancedBaseEntity extends BaseEntity {
  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
