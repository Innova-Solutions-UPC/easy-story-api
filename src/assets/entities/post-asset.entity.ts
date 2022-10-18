import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AssetType } from '../enums/asset-type.enum';

@Entity({
  name: 'assets',
})
export class PostAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  src: string;

  @Column()
  name: string;

  @Column()
  type: AssetType;

  @Column({ default: 0 })
  size: number;

  @Column()
  mimetype: string;

  @ManyToOne(() => User, { eager: true })
  owner: User;
}
