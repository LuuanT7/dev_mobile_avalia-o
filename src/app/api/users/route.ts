import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GetUserController } from '@/app/controllers/user/GetUserController';
import { GetUserService } from '@/services/users/GetUserServices';
import { CreateUser } from '@/lib/api/users/userTypes';
import { CreateUserService } from '@/services/users/CreateUserService';
import { CreateUserController } from '@/app/controllers/user/CreateUserController';


const getUserService = new GetUserService();
const getUserController = new GetUserController(getUserService);
const createUserService = new CreateUserService();
const createUserController = new CreateUserController(createUserService);


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const classRoom = searchParams.get("classRoom");


    const where = {
        name, classRoom, id
    }

    const data = await getUserController.getAll(where);
    return Response.json(data);
}

export async function POST(req: Request) {
    const body = await req.json() as CreateUser;


    const data = await createUserController.create(body);
    return Response.json(data);
}