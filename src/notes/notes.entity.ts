import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/users/users.entity";

@Entity()
export class NotesEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 50,
    })
    title: string;

    @Column({
        length: 5000,
    })
    description: string;

    @Column({
        default: null,
    })
    startDate: string | null;

    @Column({
        default: null,
    })
    endDate: string | null;

    @Column()
    delete: boolean;

    @Column({
        default: null,
    })
    email: string | null;

    @Column()
    create: string;

    @ManyToOne(() => UserEntity, (users) => users.notes)
    user: UserEntity

}