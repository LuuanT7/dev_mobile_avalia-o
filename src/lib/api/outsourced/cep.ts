import axios from "axios";




// Cliente leve para uso no front-end (não retorna NextResponse)
export type ViaCepResponse = {
    cep?: string;
    logradouro?: string;
    complemento?: string;
    bairro?: string;
    localidade?: string; // cidade
    uf?: string;         // estado
    ibge?: string;
    gia?: string;
    ddd?: string;
    siafi?: string;
    erro?: boolean;
};

export async function fetchCep(zipCode: string): Promise<ViaCepResponse | null> {
    const onlyDigits = (zipCode || "").replace(/\D/g, "");
    if (onlyDigits.length !== 8) return null;
    const { data } = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${onlyDigits}/json/`);
    if (!data || (data as ViaCepResponse).erro) return null;
    return data as ViaCepResponse;
}