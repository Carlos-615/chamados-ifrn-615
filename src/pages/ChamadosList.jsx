import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { formatDateBR } from "../utils/formatters";
import "./ChamadosList.css";

export function ChamadosList() {
  const [chamados, setChamados] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  // Filtros
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");

  // Estados da tela
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Carrega opções dos selects da API (/tipos, /locais, /prioridades)
  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [resTipos, resLocais, resPrioridades] = await Promise.all([
          api.get("/tipos"),
          api.get("/locais"),
          api.get("/prioridades"),
        ]);
        setTipos(resTipos.data || []);
        setLocais(resLocais.data || []);
        setPrioridades(resPrioridades.data || []);
      } catch (err) {
        console.error("Erro ao carregar opções dos filtros:", err);
      }
    }
    carregarOpcoes();
  }, []);

  // Carrega os chamados com os filtros aplicados
  async function carregarChamados() {
    try {
      setCarregando(true);
      setErro(null);

      const params = {};
      if (busca) params.busca = busca;
      if (status) params.status = status;
      if (tipo) params.tipo = tipo;
      if (local) params.local = local;
      if (prioridade) params.prioridade = prioridade;

      const response = await api.get("/chamados", { params });
      setChamados(response.data || []);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar. Verifique sua chave.");
      setChamados([]);
    } finally {
      setCarregando(false);
    }
  }

  // Atualiza a listagem ao alterar qualquer filtro
  useEffect(() => {
    carregarChamados();
  }, [busca, status, tipo, local, prioridade]);

  return (
    <div id="secao-chamados-lista" className="pagina-chamados">
      {/* Topo: Título e Botão + Abrir chamado */}
      <div id="cabecalho-acoes-lista" className="topo-acoes">
        <h1 className="titulo-secao">Chamados</h1>
        <Link
          to="/novo"
          id="btn-abrir-novo-chamado"
          className="btn-abrir-chamado"
        >
          + Abrir chamado
        </Link>
      </div>

      {/* Painel de Busca e Filtros */}
      <div id="painel-filtros-chamados" className="painel-filtros">
        {/* Campo de Busca por texto */}
        <input
          type="text"
          id="input-busca-texto"
          className="campo-busca"
          placeholder="Buscar por título ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {/* Linha com os 4 Selects de filtro */}
        <div className="grade-filtros">
          <select
            id="filtro-select-status"
            className="select-filtro"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Status ▾</option>
            <option value="aberto">aberto</option>
            <option value="em andamento">em andamento</option>
            <option value="resolvido">resolvido</option>
          </select>

          <select
            id="filtro-select-tipo"
            className="select-filtro"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Tipo ▾</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            id="filtro-select-local"
            className="select-filtro"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          >
            <option value="">Local ▾</option>
            {locais.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            id="filtro-select-prioridade"
            className="select-filtro"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="">Prioridade ▾</option>
            {prioridades.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estados da tela: Carregando, Erro ou Lista Vazia */}
      {carregando && (
        <div id="status-carregando" className="estado-tela">
          Carregando chamados...
        </div>
      )}

      {erro && (
        <div id="status-erro" className="estado-tela estado-tela-erro">
          <p>{erro}</p>
        </div>
      )}

      {!carregando && !erro && chamados.length === 0 && (
        <div id="status-vazio" className="estado-tela">
          Nenhum chamado encontrado.
        </div>
      )}

      {/* Lista de Chamados em Cards */}
      {!carregando && !erro && chamados.length > 0 && (
        <div id="grade-lista-cards" className="grade-chamados">
          {chamados.map((c) => (
            <Link
              key={c.id}
              to={`/chamado/${c.id}`}
              id={`card-chamado-${c.id}`}
              className="card-chamado"
            >
              <div>
                <div className="card-topo-badges">
                  <StatusBadge status={c.status} />
                  <PriorityBadge prioridade={c.prioridade} />
                </div>

                <h2 className="card-titulo">{c.titulo}</h2>

                <p className="card-descricao">
                  {c.descricao || "Sem descrição."}
                </p>
              </div>

              <div className="card-rodape">
                <span className="card-local-tipo">
                  {c.local} • {c.tipo}
                </span>
                <span>{formatDateBR(c.data_abertura)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
