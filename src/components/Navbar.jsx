import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Navbar.css";

export function Navbar() {
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    async function carregarAluno() {
      try {
        const response = await api.get("/eu");
        setAluno(response.data);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }
    carregarAluno();
  }, []);

  return (
    <header id="cabecalho-principal" className="cabecalho-sistema">
      <div className="cabecalho-container">
        <Link to="/" id="link-inicio" className="logo-link">
          <span className="logo-icone" aria-hidden="true">🛠️</span>
          <span className="logo-texto">Sistema de Chamados - IFRN</span>
        </Link>

        <div id="info-usuario-topo" className="usuario-tag">
          {aluno ? (
            <span>
              Olá, <strong>{aluno.nome}</strong>
            </span>
          ) : (
            <span className="usuario-carregando">Carregando usuário...</span>
          )}
        </div>
      </div>
    </header>
  );
}
