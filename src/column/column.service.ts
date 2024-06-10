import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Column } from './column.entity';
import { ColumnCreateDto } from './dto/column-create.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class ColumnService {
  constructor(private readonly repository: Repository<Column>) {}

  create(dto: ColumnCreateDto, user: User): Promise<Column> {
    const column = this.repository.create({
      title: dto.title,
      hasSendMail: dto.hasSendMail,
    });

    column.owner = user;

    return this.repository.save(column);
  }

  find(user: User, title?: string): Promise<Column[]> {
    return this.repository.find({
      where: { title, owner: { id: user.id } },
    });
  }

  findOne(id: number, user: User): Promise<Column> {
    if (!id) {
      return null;
    }

    return this.repository.findOne({ where: { id, owner: { id: user.id } } });
  }

  async update(
    id: number,
    attributes: Partial<Column>,
    user: User,
  ): Promise<Column> {
    const column = await this.findOne(id, user);

    if (!column) {
      throw new NotFoundException('Column not found!');
    }

    Object.assign(column, attributes);

    return this.repository.save(column);
  }

  async remove(id: number, user: User): Promise<Column> {
    const column = await this.findOne(id, user);

    if (!column) {
      throw new NotFoundException('Column not found!');
    }

    return this.repository.remove(column);
  }
}
