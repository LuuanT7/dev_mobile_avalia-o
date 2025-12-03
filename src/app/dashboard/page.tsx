'use client';
import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
// import { createUser, fetchConsultants, fetchFilteredConsultants } from '@/lib/api/users/users';
import logo from '@/assets/logo.png';
import { CreateUser, User } from '@/lib/api/users/userTypes';
import { UserCreateModal } from '@/components/UsersModal';
import { permission } from 'process';
import { CreateClass } from '@/lib/api/class/classTypes';
import { fetchUsers } from '@/lib/api/users/users';
import { formatDate } from '@/utils/FormattedDate';
import { CreateClassModal } from '@/components/ClassModal';
import { ChatModal } from '@/components/ChatModal';




export default function DashboardPage() {
  const [name, setName] = useState(''); // Nome do aluno
  const [email, setEmail] = useState(''); // Email do aluno
  const [users, setUsers] = useState<User[]>([]);
  console.log("🚀 ~ DashboardPage ~ users:", users)
  const [classes, setClasses] = useState("Primeiro A");
  const [chats, setChats] = useState("Primeiro A");


  // useEffect(() => {
  //   const fetch = async () => {
  //     const data = await fetchConsultants()
  //     setConsultant(data)
  //     return data
  //   }
  //   fetch()
  // }, [])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);



  const clienteMock = [
    {
      id: 1,
      name: 'Fulano de Tal',
      email: 'fulano@example.com',
      age: 16,
      permission: 'ADMINISTRADOR',
      criadoEm: '2025-10-21T10:30:00Z',
    },
    {
      id: 2,
      name: 'Cicrano de Tal',
      email: 'cicrano@example.com',
      age: 12,
      permission: 'ESTUDANTE',
      criadoEm: '2025-10-21T10:30:00Z',

    }
  ];

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchUsers({ name });
      // console.log("🚀 ~ fetch ~ data:", data)
      setUsers(data)
    }
    fetch()

  }, [name]);

  // const searchHandler = async () => {
  //   const data = await fetchFilteredConsultants({ name, classes, startDate, endDate });
  //   console.log("🚀 ~ fetch ~ data:", data)
  //   setClients(data.clients)
  // }



  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleOpenCreateClassModal = () => setIsCreateClassModalOpen(true);
  const handleCloseCreateClassModal = () => setIsCreateClassModalOpen(false);

  const handleOpenChatModal = () => setIsChatModalOpen(true);
  const handleCloseChatModal = () => setIsChatModalOpen(false);

  const handleCreateUser = async (user: CreateUser) => {
    try {
      // Caso você implementa a API, substitua para o createUser real e recarregue os dados.
      // await createUser(user);
      setIsCreateModalOpen(false);
      // fetchUsers();
      // Para efeito mock/demo, apenas fecha o modal
    } catch (err) {
      alert("Erro ao criar usuário");
    }
  };

  const handleCreateCLass = async (user: CreateClass) => {
    try {
      // Caso você implementa a API, substitua para o createUser real e recarregue os dados.
      // await createUser(user);
      setIsCreateClassModalOpen(false);
      // fetchUsers();
      // Para efeito mock/demo, apenas fecha o modal
    } catch (err) {
      alert("Erro ao criar usuário");
    }
  };



  return (
    <div className=' w-full h-full'>
      <header className='flex justify-start items-center p-4 border-spacing-2 border-b border-gray-800'>
        <Image src={logo} alt="Varos App" width={100} height={logo.height} priority />
      </header>

      <div className='p-48'>
        <div >
          <h2 className='text-2xl font-bold text-white'>Dashboard</h2>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between  text-white gap-4 mb-4">
          <div className="flex flex-col justify-center items-center px-6 py-4  border border-[#222630] min-w-[200px]">
            <span className="text-sm text-gray-400">Total de Alunos</span>
            {/* <div className="flex items-center gap-2 "> */}
            <span className="text-3xl font-semibold text-white">{users?.length}</span>
            {/* <span className="text-green-500 text-lg">↑</span> */}
            {/* </div> */}
            {/* <span className="text-xs text-gray-500 mt-1">nos últimos 7 dias</span> */}
          </div>

          {/* Center - Filters */}
          <div className='gap 4'>
            <div className='w-full flex align-end justify-end py-2 gap-4'>
              <button className="bg-[#1B3F1B] hover:bg-green-700 text-green-400 font-medium px-6 py-2 rounded-lg transition-colors shadow-md" onClick={handleOpenCreateModal}>
                Cadastrar Aluno +
              </button>
              <button className="bg-[#1B3F1B] hover:bg-green-700 text-green-400 font-medium px-6 py-2 rounded-lg transition-colors shadow-md" onClick={handleOpenCreateClassModal}>
                Cadastrar Classes
              </button>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-3  px-6 py-3 rounded-lg border border-[#222630] flex-1">
              <div className="flex flex-row items-center gap-2">
                <label className="text-xs text-gray-400 mb-1">Nome do Aluno</label>
                <select
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    // searchHandler()
                  }}
                  className="bg-[#222729] border border-[#2a2e38] text-[#B0B7BE] px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  {
                    users?.map((user) => {
                      return (
                        <option key={user.id}>{user?.name}</option>
                      )
                    })
                  }

                </select>
              </div>


              <div className="flex flex-row items-center gap-2">
                <label className="text-xs text-gray-400 mb-1">Classes</label>
                <select
                  value={classes}

                  onChange={(e) => {
                    setClasses(e.target.value)
                    // searchHandler()
                  }}

                  className="bg-[#222729] border border-[#2a2e38] text-[#B0B7BE] px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  {
                    users?.map((user) => {
                      return (
                        <option key={user.id}>{user?.email}</option>
                      )
                    })
                  }

                </select>
              </div>

              <div className="flex flex-row items-center gap-2">
                <label className="text-xs text-gray-400 mb-1">Email</label>
                <select
                  value={email}

                  onChange={(e) => {
                    setEmail(e.target.value)
                    // searchHandler()
                  }}

                  className="bg-[#222729] border border-[#2a2e38] text-[#B0B7BE] px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  {
                    users?.map((user) => {
                      return (
                        <option key={user.id}>{user?.email}</option>
                      )
                    })
                  }

                </select>
              </div>
            </div>



          </div>

        </div>
        <table className="w-full border-collapse ">
          <thead className='border border-[#222630] '>
            <tr className="text-left text-[#B0B7BE] p-6 ">
              <th className="py-6 px-4">Nome</th>
              <th className="py-6 px-4">Email</th>
              <th className="py-6 px-4">Idade</th>
              <th className="py-6 px-4">Classe</th>
              <th className="py-6 px-4">Permissão</th>
              <th className="py-6 px-4">Criado em</th>
            </tr>
          </thead>
          <tbody className='border border-[#222630] bg-[#131516]'>
            {users?.map(u => (
              <tr key={u.id} className="text-left text-[#B0B7BE] border-t border-[#222630] ">
                <td className="px-4 py-6">{u.name}</td>
                <td className="px-4 py-6">{u.email}</td>
                <td className="px-4 py-6">{u.age}</td>
                <td className="px-4 py-6">{u.enrollments[0]?.classRoom?.name}</td>

                <td className="px-4 py-6">{u.user_type === "ADMIN" ? "ADMINISTRADOR" : "ESTUDANTE"}</td>
                <td className="px-4 py-6">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='w-full flex align-end justify-end py-2 gap-4 '>
          <button className="bg-[#1B3F1B] hover:bg-green-700 text-green-400 h-12 font-normal px-6 py-2 rounded-3xl transition-colors shadow-md" onClick={handleOpenChatModal}>
            Chat
          </button>
        </div>
      </div>

      <UserCreateModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateUser}
      />

      <CreateClassModal
        open={isCreateClassModalOpen}
        onClose={handleCloseCreateClassModal}
        onSubmit={handleCreateCLass}
      />
      <ChatModal
        open={isChatModalOpen}
        onClose={handleCloseChatModal}
        onSubmit={(data) => {
          console.log("Chat enviado:", data);
          // setOpenChat(false);
        }}

      />
    </div>
  );
}

