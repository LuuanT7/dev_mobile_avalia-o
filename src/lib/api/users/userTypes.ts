import { Enrollment } from "@prisma/client";

export interface User {
    id: number;
    name: string;
    email: string;
    age: string;
    user_type: 'ADMIN' | 'STUDENTS'
    enrollments: {
        classRoom: {
            name: string;
        }
    }[];
    createdAt: Date;
    updatedAt: Date
};

export type CreateUser = {
    password: string
    name: string;
    email: string;
    age: string;
    userType: 'ADMIN' | 'STUDENTS'
    classRoomId: string

};

export interface UsersFilters {
    name?: string,
    email?: string,
    classRoom?: string,

}