import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/users/users.entity";

@Entity()
export class FileEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string

    @Column()
    orginalName: string

    @Column()
    name: string

    @Column()
    size: number

    @Column()
    extension: string

    @ManyToOne(() => UserEntity, (users) => users.files)
    user: UserEntity
}