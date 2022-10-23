import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'profiles',
})
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, type: 'varchar' })
  firstName: string;

  @Column({ length: 50, type: 'varchar' })
  lastName: string;

  @Column({ length: 250, type: 'varchar', default: '' })
  bio: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  get initials(): string {
    return `${this.firstName[0]}${this.lastName[0]}`;
  }

  @Expose()
  get profilePicture(): string {
    return `https://ui-avatars.com/api/?name=${this.initials}`;
  }
}
