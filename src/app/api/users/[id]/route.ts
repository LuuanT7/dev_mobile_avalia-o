import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GetUserController } from '@/app/controllers/user/GetUserController';
import { GetUserService } from '@/services/users/GetUserServices';

const getUserService = new GetUserService();
const getUserController = new GetUserController(getUserService);

interface Params {
  id: string
}
export async function GET(req: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;

  const data = await getUserController.getbyId(id);
  return Response.json(data);
}
// export async function PUT(req: Request, { params }: { params: Promise<{ id: string }>}) {
//   const { id: idStr } = await params;
//   const id = Number(idStr);
//   const body = await req.json();
//   const { name, email } = body;
//   try {
//     const user = await prisma.user.update({ where: { id }, data: { name, email } });
//     return NextResponse.json(user);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
//   const { id: idStr } = await params;
//   const id = Number(idStr);
//   try {
//     await prisma.user.delete({ where: { id } });
//     return NextResponse.json({ ok: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
