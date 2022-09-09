import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'bookmarks',
})
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
