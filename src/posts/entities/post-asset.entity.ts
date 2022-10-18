import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostAssetType } from '../enums/post-asset-type.enum';
import { Post } from './post.entity';

@Entity({
  name: 'post_assets',
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
  type: PostAssetType;

  @Column({ default: 0 })
  size: number;

  @Column()
  mimetype: string;

  @ManyToOne(() => Post, (post) => post.assets, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, { eager: true })
  owner: User;
}
