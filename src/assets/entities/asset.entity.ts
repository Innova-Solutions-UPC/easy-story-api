import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AssetType } from '../enums/asset-type.enum';

@Entity({
  name: 'assets',
})
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  src: string;

  @Column()
  name: string;

  @Column()
  type: AssetType;

  @Column()
  mimetype: string;

  @ManyToOne(() => User, { eager: true })
  owner: User;
}
