import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./ChamadosList.css";

export function ChamadosList() {
  const [chamados, setChamados] = useState([]);
  const [filtros, setFiltros] = useState({ tipos: [], locais: [], prioridades: [] });
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    Promise.all([api.get("/tipos"), api.get("/locais"), api.get("/prioridades")])
      .then(([t, l, p]) => setFiltros({ tipos: t.data, locais: l.data, prioridades: p.data }))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setCarregando(true);
    const params = { busca, status, tipo, local, prioridade };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);

    api.get("/chamados", { params })
      .then((res) => { setChamados(res.data); setErro(null); })
      .catch(() => setErro("Não foi possível carregar. Verifique sua chave."))
      .finally(() => setCarregando(false));
  }, [busca, status, tipo, local, prioridade]);

  return (
    <div className="pagina-lista">
      <div className="lista-topo">
        <h1>Chamados</h1>
        <Link to="/novo" className="btn-verde">+ Abrir chamado</Link>
      </div>

      <div className="lista-filtros">
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="campo-busca"
        />
        <div className="linha-selects">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Status ▾</option>
            <option value="aberto">aberto</option>
            <option value="em andamento">em andamento</option>
            <option value="resolvido">resolvido</option>
          </select>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Tipo ▾</option>
            {filtros.tipos.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={local} onChange={(e) => setLocal(e.target.value)}>
            <option value="">Local ▾</option>
            {filtros.locais.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
            <option value="">Prioridade ▾</option>
            {filtros.prioridades.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {carregando && <p className="msg">Carregando chamados...</p>}
      {erro && <p className="msg-erro">{erro}</p>}
      {!carregando && !erro && chamados.length === 0 && <p className="msg">Nenhum chamado encontrado.</p>}

      <div className="grade-cards">
        {!carregando && !erro && chamados.map((c) => (
          <Link key={c.id} to={`/chamado/${c.id}`} className="card">
            <div className="card-topo">
              <span className={`badge ${c.status.replace(" ", "")}`}>{c.status}</span>
              <span className={`badge ${c.prioridade}`}>{c.prioridade}</span>
            </div>
            <h3>{c.titulo}</h3>
            <p className="desc">{c.descricao || "Sem descrição."}</p>
            <div className="card-rodape">
              <span>{c.local} • {c.tipo}</span>
              <span>{c.data_abertura ? c.data_abertura.split("-").reverse().join("/") : ""}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
