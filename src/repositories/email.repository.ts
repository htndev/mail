import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Email } from '../entities/email.entity';
import { User } from '../entities/user.entity';

@Injectable()
@EntityRepository(Email)
export class EmailRepository extends Repository<Email> {
  async findByEmail(email: string): Promise<Email> {
    return this.findOne({ email });
  }

  async findByType(type: string): Promise<Email[]> {
    return this.find({ type });
  }

  async createEmail({
    email,
    type,
    user,
    uuid
  }: {
    email: string;
    type: string;
    user: User;
    uuid: string;
  }): Promise<Email> {
    const newEmail = new Email();

    newEmail.email = email;
    newEmail.type = type;
    newEmail.user = user;
    newEmail.uuid = uuid;

    return newEmail.save();
  }
}
