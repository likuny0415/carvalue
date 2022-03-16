import { Exclude } from "class-transformer";
import { Report } from "src/report/report.entity";
import { AfterInsert, AfterUpdate, AfterRemove, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ unique: true})
    email: string;

    @Column()
    password: string;

    @Column({ default: true})
    admin: boolean

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[]

    @AfterInsert()
    insertLog() {
        console.log("User with id " + this.id + " has been created");
    }

    @AfterRemove()
    removeLog() {
        console.log("User with id " + this.id + " has been removed");
    }

    @AfterUpdate()
    updateLog() {
        console.log("User with id " + this.id + " has been updated");
    }
}