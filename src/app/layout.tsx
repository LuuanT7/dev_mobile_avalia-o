import React from 'react';
import './globals.css'


export const metadata = {
  title: 'Varos App',
  description: 'CRUD simples de usuários'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className=" bg-[#131313] ">
        <main className="">
          {children}
        </main>
      </body>
    </html>
  );
}
