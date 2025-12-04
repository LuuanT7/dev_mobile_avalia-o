import axios from "axios";
import { UsersFilters, CreateUser, User } from "./userTypes";

export const fetchUsers = async (filter: UsersFilters) => {
  try {
    const res = await axios.get("/api/users", {
      params: {
        name: filter.name, // do seu state

      },
    });
    console.log("✅ Consultores filtrados:", res.data);
    return res.data
  } catch (err) {
    console.error("❌ Erro ao buscar consultores:", err);
  }
};

// export const fetchConsultants = async () => {
//   try {
//     const res = await axios.get("/api/consultants");
//     console.log("Consultores:", res.data);
//     return res.data
//   } catch (error) {
//     console.error("Erro ao buscar consultores:", error);
//   }
// };


export const createUser = async (data: CreateUser) => {
  try {
    const res = await axios.post('/api/users', data);
    return res.data;
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    // Re-lançar o erro para que o componente possa tratá-lo
    throw error;
  }

};