import { Expose } from 'class-transformer';

export class ColumnDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  hasSendMail: boolean;
}
