import { Entity, Column } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @Column({
    type: 'integer',
    name: 'id',
    primary: true,
    generated: 'increment',
  })
  id: number;

  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  login: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
