import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column(
        {
            length: 60
        }
    )
    email: string;

    @Column(
        {
            length: 40
        }
    )
    login: string;

    @Column()
    password: string;

    @Column()
    iv: string;

    @Column()
    salt: string;

    @Column(
        {
            default: false
        }
    )
    active: boolean;

    @Column()
    activationLink: string | null;
}