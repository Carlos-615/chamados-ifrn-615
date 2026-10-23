import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./ChamadoForm.css";

export function ChamadoForm() {
  const { id } = useParams();
  const isEdicao = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    tipo: "",
    local: "",
    prioridade: "",
    data_abertura: new Date().toISOString().split("T")[0],
  });
  const [opcoes, setOpcoes] = useState({ tipos: [], locais: [], prioridades: [] });
  const [resolvido, setResolvido] = useState(false);
  const [msgErro, setMsgErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/tipos"), api.get("/locais"), api.get("/prioridades")])
      .then(([t, l, p]) => {
        setOpcoes({ tipos: t.data, locais: l.data, prioridades: p.data });
        if (!isEdicao) {
          setForm((f) => ({ ...f, tipo: t.data[0], local: l.data[0], prioridade: p.data[0] }));
        }
      })
      .catch(console.error);

    if (isEdicao) {
      api.get(`/chamados/${id}`)
        .then((res) => {
          const c = res.data;
          if (c.status === "resolvido") setResolvido(true);
          setForm({
            titulo: c.titulo || "",
            descricao: c.descricao || "",
            tipo: c.tipo || "",
            local: c.local || "",
            prioridade: c.prioridade || "",
            data_abertura: c.data_abertura || "",
          });
        })
        .catch(console.error)
        .finally(() => setCarregando(false));
    } else {
      setCarregando(false);
    }
  }, [id, isEdicao]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsgErro("");
    try {
      if (isEdicao) {
        await api.put(`/chamados/${id}`, form);
        navigate(`/chamado/${id}`);
      } else {
        const res = await api.post("/chamados", form);
        navigate(`/chamado/${res.data.id}`);
      }
    } catch (err) {
      setMsgErro("Erro ao salvar chamado. Verifique os dados.");
    }
  };

  if (carregando) return <p className="msg">Carregando formulário...</p>;

  if (isEdicao && resolvido) {
    return (
      <div className="card-bloqueado">
        <h2>Chamado Resolvido</h2>
        <p>Chamados resolvidos não podem ser editados.</p>
        <Link to={`/chamado/${id}`} className="btn-cinza">Voltar ao chamado</Link>
      </div>
    );
  }

  return (
    <div className="pagina-form">
      <Link to="/" className="voltar">← Voltar</Link>

      <div className="card-form">
        <h2>{isEdicao ? "Editar chamado" : "Abrir chamado"}</h2>
        {msgErro && <p className="msg-erro">{msgErro}</p>}

        <form onSubmit={handleSubmit} className="form">
          <label>Título</label>
          <input name="titulo" required minLength={3} maxLength={80} value={form.titulo} onChange={handleChange} />

          <label>Descrição</label>
          <textarea name="descricao" rows={3} maxLength={500} value={form.descricao} onChange={handleChange} />

          <div className="linha-campos">
            <div>
              <label>Tipo</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} required>
                {opcoes.tipos.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label>Local</label>
              <select name="local" value={form.local} onChange={handleChange} required>
                {opcoes.locais.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="linha-campos">
            <div>
              <label>Prioridade</label>
              <select name="prioridade" value={form.prioridade} onChange={handleChange} required>
                {opcoes.prioridades.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label>Data de abertura</label>
              <input type="date" name="data_abertura" value={form.data_abertura} onChange={handleChange} required />
            </div>
          </div>

          <div className="botoes">
            <button type="button" onClick={() => navigate(isEdicao ? `/chamado/${id}` : "/")} className="btn-cinza">
              Cancelar
            </button>
            <button type="submit" className="btn-verde">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}