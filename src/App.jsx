import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar.jsx";
import { ChamadosList } from "./pages/ChamadosList.jsx";
import { ChamadoDetail } from "./pages/ChamadoDetail.jsx";
import { ChamadoForm } from "./pages/ChamadoForm.jsx";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div id="aplicacao-raiz" className="app-container">
        {/* Cabeçalho do sistema */}
        <Navbar />

        {/* Área de conteúdo principal das rotas */}
        <main id="conteudo-pagina" className="conteudo-principal">
          <Routes>
            <Route path="/" element={<ChamadosList />} />
            <Route path="/novo" element={<ChamadoForm />} />
            <Route path="/editar/:id" element={<ChamadoForm />} />
            <Route path="/chamado/:id" element={<ChamadoDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Rodapé com informações do IFRN e da disciplina */}
        <footer id="rodape-principal" className="rodape-sistema">
          <p className="rodape-instituicao">
            Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Norte (IFRN)
          </p>
          <p className="rodape-subtitulo">
            Campus Pau dos Ferros · Técnico Integrado em Informática · Programação para Internet
          </p>
          <p className="rodape-api">
            Sistema de Chamados de Manutenção · API: api-chamados.jefersonqueiroga.com.br
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
