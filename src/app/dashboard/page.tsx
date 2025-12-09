'use client';
import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
// import { createUser, fetchConsultants, fetchFilteredConsultants } from '@/lib/api/users/users';
import logo from '@/assets/logo.png';
import { CreateUser, User } from '@/lib/api/users/userTypes';
import { UserCreateModal, UserFormValues } from '@/components/UsersModal';
import { permission } from 'process';
import { CreateClass, IClassRoom } from '@/lib/api/classRoom/classTypes';
import { createUser, fetchUsers } from '@/lib/api/users/users';
import { formatDate } from '@/utils/FormattedDate';
import { CreateClassModal } from '@/components/ClassModal';
import { ChatModal } from '@/components/ChatModal';
import { ChatLoginModal } from '@/components/ChatLoginModal';
import { fetchClassRoom } from '@/lib/api/classRoom/classRoom';




export default function DashboardPage() {
  // controle de filtros
  const [name, setName] = useState(''); // Nome do aluno
  const [email, setEmail] = useState(''); // Email do aluno
  const [filterClassRoom, setFilterClassRoom] = useState(''); // Filtro de classe


  // Listagem de usuários
  const [users, setUsers] = useState<User[]>([]);
  const [classRoom, setClassRoom] = useState<IClassRoom[]>([]);

  // Dados do chat (preenchidos após login no modal de login)
  const [chatStudentId, setChatStudentId] = useState<string>('');
  const [chatStudentName, setChatStudentName] = useState<string>('');
  const [chatClassRoomName, setChatClassRoomName] = useState<string>('');

  // Controle de modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [isChatLoginModalOpen, setIsChatLoginModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);




  useEffect(() => {
    const fetch = async () => {
      const data = await fetchUsers({ name, email, classRoom: filterClassRoom });
      // console.log("🚀 ~ fetch ~ data:", data)
      setUsers(data)
    }
    fetch()

  }, [name, email, filterClassRoom]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await fetchClassRoom();
        console.log("🚀 ~ fetchClassRoom ~ data:", data)
        if (data && Array.isArray(data)) {
          setClassRoom(data);
        } else {
          console.warn("⚠️ fetchClassRoom retornou dados inválidos:", data);
          setClassRoom([]);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar classes:", error);
        setClassRoom([]);
      }
    }
    fetch()

  }, []);

  // const searchHandler = async () => {
  //   const data = await fetchFilteredConsultants({ name, classes, startDate, endDate });
  //   console.log("🚀 ~ fetch ~ data:", data)
  //   setClients(data.clients)
  // }



  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleOpenCreateClassModal = () => setIsCreateClassModalOpen(true);
  const handleCloseCreateClassModal = () => setIsCreateClassModalOpen(false);

  /**
   * POR QUÊ: Abre o modal de login do chat primeiro.
   * O usuário precisa informar nome e sala antes de entrar no chat.
   */
  const handleOpenChatLogin = () => {
    setIsChatLoginModalOpen(true);
  };

  /**
   * POR QUÊ: Fecha o modal de login e reseta os dados do chat.
   */
  const handleCloseChatLogin = () => {
    setIsChatLoginModalOpen(false);
  };

  /**
   * POR QUÊ: Chamado quando o usuário faz login no chat.
   * Recebe os dados (studentId, studentName, classRoomName) e abre o modal de chat.
   * Também verifica se o aluno pertence àquela sala antes de permitir acesso.
   */
  const handleChatLogin = async (studentId: string, studentName: string, classRoomName: string) => {
    try {
      // Verifica se o aluno pertence àquela sala
      const response = await axios.get(`/api/users/${studentId}/classrooms`);
      const userClassRooms = response.data || [];
      const hasAccess = userClassRooms.some((room: IClassRoom) => room.name === classRoomName);

      if (!hasAccess) {
        alert('Este aluno não pertence a esta sala de aula!');
        return;
      }

      // Se tiver acesso, salva os dados e abre o chat
      setChatStudentId(studentId);
      setChatStudentName(studentName);
      setChatClassRoomName(classRoomName);
      setIsChatLoginModalOpen(false);
      setIsChatModalOpen(true);
    } catch (error) {
      console.error('❌ Erro ao verificar acesso:', error);
      alert('Erro ao verificar acesso à sala. Tente novamente.');
    }
  };

  /**
   * POR QUÊ: Fecha o modal de chat e limpa os dados.
   */
  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
    setChatStudentId('');
    setChatStudentName('');
    setChatClassRoomName('');
  };

  const handleResetFilters = () => {
    setName('');
    setEmail('');
    setFilterClassRoom('');
  };

  const handleCreateUser = async (user: CreateUser) => {
    try {
      const result = await createUser(user);
      console.log("🚀 ~ handleCreateUser ~ result:", result)
      setIsCreateModalOpen(false);
      // Recarregar a lista de usuários
      const data = await fetchUsers({ name });
      setUsers(data);
    } catch (err: any) {
      console.error("Erro ao criar usuário:", err);
      const errorMessage = err?.response?.data?.error || err?.message || "Erro ao criar usuário";
      alert(errorMessage);
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
                  <option value="">Todos</option>
                  {
                    users?.map((user) => {
                      return (
                        <option key={user.id} value={user.name}>{user?.name}</option>
                      )
                    })
                  }

                </select>
              </div>


              <div className="flex flex-row items-center gap-2">
                <label className="text-xs text-gray-400 mb-1">Classes</label>
                <select
                  value={filterClassRoom}

                  onChange={(e) => {
                    setFilterClassRoom(e.target.value)
                    // searchHandler()
                  }}

                  className="bg-[#222729] border border-[#2a2e38] text-[#B0B7BE] px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Todas</option>
                  {
                    classRoom?.map((room) => {
                      return (
                        <option key={room.id} value={room.name}>{room.name}</option>
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
                  <option value="">Todos</option>
                  {
                    users?.map((user) => {
                      return (
                        <option key={user.id} value={user.email}>{user?.email}</option>
                      )
                    })
                  }

                </select>
              </div>

              <button
                onClick={handleResetFilters}
                className="bg-[#2a2e38] hover:bg-[#3a3e48] text-[#B0B7BE] font-medium px-4 py-2 rounded-md transition-colors shadow-md text-sm"
              >
                Limpar Filtros
              </button>
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
          <button
            className="bg-[#1B3F1B] hover:bg-green-700 text-green-400 h-12 font-normal px-6 py-2 rounded-3xl transition-colors shadow-md"
            onClick={handleOpenChatLogin}
          >
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
      {/* 
        POR QUÊ: Modal de login do chat.
        Permite que o usuário selecione nome e sala antes de entrar no chat.
      */}
      <ChatLoginModal
        open={isChatLoginModalOpen}
        onClose={handleCloseChatLogin}
        onLogin={handleChatLogin}
        users={users}
        classRooms={classRoom}
      />

      {/* 
        POR QUÊ: Modal do chat em si.
        Só abre após o login ser feito com sucesso.
        Recebe os dados do aluno e sala selecionados no modal de login.
      */}
      <ChatModal
        open={isChatModalOpen}
        onClose={handleCloseChatModal}
        studentId={chatStudentId}
        studentName={chatStudentName}
        classRooms={classRoom}
        userClassRooms={classRoom.filter(room => room.name === chatClassRoomName)}
      />
    </div>
  );
}

