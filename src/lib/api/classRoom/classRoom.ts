import axios from "axios";

export const fetchClassRoom = async () => {
  try {
    const res = await axios.get("/api/classRoom");
    return res.data || [];
  } catch (err) {
    console.error("❌ Erro ao buscar Classes:", err);
    // Retornar array vazio em caso de erro para não quebrar o componente
    return [];
  }
};