import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'qualifications',
})
export class Qualification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
}
