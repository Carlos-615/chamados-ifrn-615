import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./ChamadoDetail.css";

export function ChamadoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [responsavel, setResponsavel] = useState("");
  const [solucao, setSolucao] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    api.get(`/chamados/${id}`)
      .then((res) => setChamado(res.data))
      .catch(() => setErro("Não foi possível carregar o chamado."))
      .finally(() => setCarregando(false));
  }, [id]);

  const handleIniciar = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/chamados/${id}/iniciar`, { responsavel });
      setChamado(res.data);
    } catch { alert("Erro ao iniciar atendimento."); }
  };

  const handleResolver = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/chamados/${id}/resolver`, { solucao });
      setChamado(res.data);
    } catch { alert("Erro ao resolver chamado."); }
  };

  const handleExcluir = async () => {
    try {
      await api.delete(`/chamados/${id}`);
      navigate("/");
    } catch { alert("Erro ao excluir chamado."); }
  };

  if (carregando) return <p className="msg">Carregando chamado...</p>;
  if (erro || !chamado) return <p className="msg-erro">{erro}</p>;

  const resolvido = chamado.status === "resolvido";

  return (
    <div className="pagina-detalhe">
      <Link to="/" className="voltar">← Voltar</Link>

      <div className="card-detalhe">
        <div className="card-topo">
          <span className={`badge ${chamado.status.replace(" ", "")}`}>{chamado.status}</span>
          <span className={`badge ${chamado.prioridade}`}>{chamado.prioridade}</span>
        </div>

        <h2>{chamado.titulo}</h2>
        <div className="detalhe-info">
          <p><strong>Descrição:</strong> {chamado.descricao || "Sem descrição"}</p>
          <p><strong>Tipo:</strong> {chamado.tipo}</p>
          <p><strong>Local:</strong> {chamado.local}</p>
          <p><strong>Aberto em:</strong> {chamado.data_abertura ? chamado.data_abertura.split("-").reverse().join("/") : ""}</p>
          <p><strong>Responsável:</strong> {chamado.responsavel || "Nenhum ainda"}</p>
          {resolvido && (
            <>
              <p><strong>Solução:</strong> {chamado.solucao}</p>
              {chamado.data_resolucao && (
                <p><strong>Data de resolução:</strong> {chamado.data_resolucao.split("-").reverse().join("/")}</p>
              )}
            </>
          )}
        </div>

        <div className="acoes">
          {!resolvido ? (
            <Link to={`/editar/${chamado.id}`} className="btn-cinza">Editar</Link>
          ) : (
            <span className="bloqueado">Resolvido não pode ser editado</span>
          )}
          <button onClick={() => setModal(true)} className="btn-vermelho">Excluir</button>
        </div>

        <div className="proxima-etapa">
          <h3>Próxima etapa</h3>
          <p className="sub">aberto: iniciar atendimento · em andamento: resolver</p>

          {chamado.status === "aberto" && (
            <form onSubmit={handleIniciar} className="form-etapa">
              <input
                required
                placeholder="Nome do Responsável..."
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
              <button type="submit" className="btn-amarelo">Iniciar</button>
            </form>
          )}

          {chamado.status === "em andamento" && (
            <form onSubmit={handleResolver} className="form-etapa-col">
              <textarea
                required
                rows={2}
                placeholder="Descreva a Solução..."
                value={solucao}
                onChange={(e) => setSolucao(e.target.value)}
              />
              <button type="submit" className="btn-verde">Resolver</button>
            </form>
          )}

          {resolvido && <p className="sucesso">✅ Chamado finalizado e resolvido.</p>}
        </div>
      </div>

      {modal && (
        <div className="modal">
          <div className="modal-box">
            <h3>Confirmação</h3>
            <p>Tem certeza que deseja excluir este chamado?</p>
            <div className="modal-acoes">
              <button onClick={() => setModal(false)} className="btn-cinza">Cancelar</button>
              <button onClick={handleExcluir} className="btn-vermelho">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
