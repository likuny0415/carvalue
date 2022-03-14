import { Exclude } from "class-transformer";
import { AfterInsert, AfterUpdate, AfterRemove, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ unique: true})
    email: string;

    @Column()
    password: string;


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