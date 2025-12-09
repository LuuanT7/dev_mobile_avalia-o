/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * POR QUÊ: NÃO usamos standalone porque precisamos do servidor customizado
   * O servidor customizado (src/server/server.ts) precisa rodar em TypeScript
   * Standalone criaria um servidor.js próprio que não suporta nosso WebSocket
   */
}
module.exports = nextConfig;
