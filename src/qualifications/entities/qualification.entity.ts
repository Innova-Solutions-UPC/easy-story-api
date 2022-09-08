import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'qualifications',
})
export class Qualification {
  @PrimaryGeneratedColumn()
  id: number;
}
