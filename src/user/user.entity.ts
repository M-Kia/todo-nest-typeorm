import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  // CreateDateColumn,
  // DeleteDateColumn,
  // UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  // @CreateDateColumn({
  //   name: 'created_at',
  //   type: 'timestamp with time zone',
  //   comment: 'user created date',
  // })
  // created_at: Date;

  // @UpdateDateColumn({
  //   name: 'updated_at',
  //   type: 'timestamp with time zone',
  //   comment: 'user updated date',
  // })
  // updated_at: Date;

  // @DeleteDateColumn({
  //   name: 'deleted_at',
  //   type: 'timestamp with time zone',
  //   comment: 'user deleted date',
  // })
  // deleted_at: Date;
}
