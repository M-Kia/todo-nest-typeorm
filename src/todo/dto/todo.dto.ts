import { Expose, Transform } from 'class-transformer';
import { Column } from 'src/column/column.entity';

export class TodoDto {
  @Expose()
  id: number;

  @Expose()
  description: string;

  @Expose()
  order: number;

  @Expose()
  column: Column;

  @Transform(({ obj }) => obj.owner.id)
  @Expose()
  owner_id: number;
}
