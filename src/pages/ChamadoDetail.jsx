import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { ConfirmModal } from "../components/ConfirmModal";
import { formatDateBR } from "../utils/formatters";
import "./ChamadoDetail.css";

export function ChamadoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Estados dos inputs da próxima etapa
  const [responsavel, setResponsavel] = useState("");
  const [solucao, setSolucao] = useState("");
  const [enviandoEtapa, setEnviandoEtapa] = useState(false);
  const [mensagemEtapa, setMensagemEtapa] = useState("");

  // Estado da confirmação de exclusão
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  // Busca dados do chamado
  async function carregarChamado() {
    try {
      setCarregando(true);
      setErro(null);
      const response = await api.get(`/chamados/${id}`);
      setChamado(response.data);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar o chamado.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarChamado();
  }, [id]);

  // Ação: Iniciar Atendimento (aberto -> em andamento)
  async function handleIniciar(e) {
    e.preventDefault();
    if (!responsavel.trim()) return;

    try {
      setEnviandoEtapa(true);
      setMensagemEtapa("");
      const response = await api.patch(`/chamados/${id}/iniciar`, {
        responsavel: responsavel.trim(),
      });
      setChamado(response.data);
      setResponsavel("");
      setMensagemEtapa("Atendimento iniciado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar atendimento.");
    } finally {
      setEnviandoEtapa(false);
    }
  }

  // Ação: Resolver Chamado (em andamento -> resolvido)
  async function handleResolver(e) {
    e.preventDefault();
    if (!solucao.trim()) return;

    try {
      setEnviandoEtapa(true);
      setMensagemEtapa("");
      const response = await api.patch(`/chamados/${id}/resolver`, {
        solucao: solucao.trim(),
      });
      setChamado(response.data);
      setSolucao("");
      setMensagemEtapa("Chamado resolvido com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao resolver chamado.");
    } finally {
      setEnviandoEtapa(false);
    }
  }

  // Ação: Excluir chamado com confirmação
  async function handleConfirmarExcluir() {
    try {
      await api.delete(`/chamados/${id}`);
      setModalExcluirAberto(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir chamado.");
      setModalExcluirAberto(false);
    }
  }

  if (carregando) {
    return (
      <div id="detalhe-status-carregando" className="estado-tela">
        Carregando chamado...
      </div>
    );
  }

  if (erro || !chamado) {
    return (
      <div id="detalhe-status-erro" className="estado-tela estado-tela-erro">
        <p className="mb-3">{erro || "Chamado não encontrado."}</p>
        <Link to="/" className="link-voltar">
          ← Voltar para a lista
        </Link>
      </div>
    );
  }

  const resolvido = chamado.status === "resolvido";

  return (
    <div id="secao-detalhe-chamado" className="pagina-detalhe">
      {/* Botão Voltar */}
      <Link to="/" id="link-voltar-topo" className="link-voltar">
        ← Voltar
      </Link>

      {/* Cartão de Detalhes Principal */}
      <div id="painel-conteudo-chamado" className="card-detalhe">
        {/* Badges de Status e Prioridade */}
        <div className="detalhe-topo-badges">
          <StatusBadge status={chamado.status} />
          <PriorityBadge prioridade={chamado.prioridade} />
        </div>

        <h1 id="detalhe-titulo-chamado" className="detalhe-titulo">
          {chamado.titulo}
        </h1>

        {/* Linhas de informações conforme o modelo do professor */}
        <div id="lista-informacoes-chamado" className="detalhe-campos-lista">
          <p className="detalhe-item">
            <strong>Descrição:</strong> {chamado.descricao || "Sem descrição"}
          </p>
          <p className="detalhe-item">
            <strong>Tipo:</strong> {chamado.tipo}
          </p>
          <p className="detalhe-item">
            <strong>Local:</strong> {chamado.local}
          </p>
          <p className="detalhe-item">
            <strong>Aberto em:</strong> {formatDateBR(chamado.data_abertura)}
          </p>
          <p className="detalhe-item">
            <strong>Responsável:</strong> {chamado.responsavel || "Nenhum responsável ainda"}
          </p>
          <p className="detalhe-item">
            <strong>Solução:</strong> {chamado.solucao || "Nenhuma solução registrada"}
          </p>
          {chamado.data_resolucao && (
            <p className="detalhe-item">
              <strong>Data de resolução:</strong> {formatDateBR(chamado.data_resolucao)}
            </p>
          )}
        </div>

        {/* Botões de Ação: Editar e Excluir */}
        <div id="barra-acoes-chamado" className="detalhe-acoes">
          {!resolvido ? (
            <Link
              to={`/editar/${chamado.id}`}
              id="btn-editar-chamado"
              className="btn-editar-chamado"
            >
              Editar
            </Link>
          ) : (
            <span id="texto-bloqueio-edicao" className="aviso-resolvido-bloqueado">
              Chamados resolvidos não podem ser editados.
            </span>
          )}

          <button
            type="button"
            id="btn-abrir-modal-excluir"
            onClick={() => setModalExcluirAberto(true)}
            className="btn-excluir-chamado"
          >
            Excluir
          </button>
        </div>

        {/* Caixa Próxima Etapa */}
        <div id="painel-proxima-etapa-atendimento" className="painel-proxima-etapa">
          <h2 className="etapa-titulo">Próxima etapa</h2>
          <p className="etapa-subtitulo">
            aberto: iniciar atendimento · em andamento: resolver
          </p>

          {mensagemEtapa && (
            <p id="aviso-sucesso-etapa" className="etapa-aviso-sucesso">
              {mensagemEtapa}
            </p>
          )}

          {/* Se status === 'aberto' -> campo Responsável e botão Iniciar */}
          {chamado.status === "aberto" && (
            <form id="form-iniciar-atendimento" onSubmit={handleIniciar} className="etapa-form-linha">
              <input
                type="text"
                id="input-responsavel-atendimento"
                required
                placeholder="Nome do Responsável..."
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="etapa-input-texto"
              />
              <button
                type="submit"
                id="btn-confirmar-iniciar"
                disabled={enviandoEtapa}
                className="btn-etapa-iniciar"
              >
                {enviandoEtapa ? "Iniciando..." : "Iniciar Atendimento"}
              </button>
            </form>
          )}

          {/* Se status === 'em andamento' -> campo Solução e botão Resolver */}
          {chamado.status === "em andamento" && (
            <form id="form-resolver-atendimento" onSubmit={handleResolver} className="space-y-2">
              <textarea
                id="textarea-solucao-chamado"
                required
                rows={2}
                placeholder="Descreva a Solução..."
                value={solucao}
                onChange={(e) => setSolucao(e.target.value)}
                className="etapa-textarea"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  id="btn-confirmar-resolver"
                  disabled={enviandoEtapa}
                  className="btn-etapa-resolver"
                >
                  {enviandoEtapa ? "Salvando..." : "Resolver Chamado"}
                </button>
              </div>
            </form>
          )}

          {/* Se status === 'resolvido' -> aviso de concluído */}
          {chamado.status === "resolvido" && (
            <p id="aviso-chamado-concluido" className="etapa-concluida">
              ✅ Chamado finalizado e resolvido.
            </p>
          )}
        </div>
      </div>

      {/* Modal de confirmação antes de excluir */}
      <ConfirmModal
        isOpen={modalExcluirAberto}
        mensagem="Tem certeza que deseja excluir este chamado?"
        onConfirmar={handleConfirmarExcluir}
        onCancelar={() => setModalExcluirAberto(false)}
      />
    </div>
  );
}
