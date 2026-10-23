import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { getTodayISODate } from "../utils/formatters";
import "./ChamadoForm.css";

export function ChamadoForm() {
  const { id } = useParams();
  const isEdicao = Boolean(id);
  const navigate = useNavigate();

  // Opções para preencher os selects vindos da API
  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  // Campos do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [dataAbertura, setDataAbertura] = useState(getTodayISODate());

  // Estados de controle
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [isResolvido, setIsResolvido] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  // Carrega opções e dados do chamado se for edição
  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setMensagemErro("");

        // 1. Carrega opções dos selects da API
        const [resTipos, resLocais, resPrioridades] = await Promise.all([
          api.get("/tipos"),
          api.get("/locais"),
          api.get("/prioridades"),
        ]);

        setTipos(resTipos.data || []);
        setLocais(resLocais.data || []);
        setPrioridades(resPrioridades.data || []);

        // 2. Se for edição, carrega o chamado existente
        if (isEdicao && id) {
          const resChamado = await api.get(`/chamados/${id}`);
          const chamado = resChamado.data;

          if (chamado.status === "resolvido") {
            setIsResolvido(true);
          }

          setTitulo(chamado.titulo || "");
          setDescricao(chamado.descricao || "");
          setTipo(chamado.tipo || resTipos.data[0] || "");
          setLocal(chamado.local || resLocais.data[0] || "");
          setPrioridade(chamado.prioridade || resPrioridades.data[0] || "");
          setDataAbertura(chamado.data_abertura || getTodayISODate());
        } else {
          // Valores padrão se for novo
          if (resTipos.data?.length > 0) setTipo(resTipos.data[0]);
          if (resLocais.data?.length > 0) setLocal(resLocais.data[0]);
          if (resPrioridades.data?.length > 0) setPrioridade(resPrioridades.data[0]);
        }
      } catch (err) {
        console.error(err);
        setMensagemErro("Erro ao carregar dados do formulário.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id, isEdicao]);

  // Salvar chamado (POST para novo, PUT para editar)
  async function handleSubmit(e) {
    e.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");

    if (titulo.trim().length < 3) {
      setMensagemErro("O título deve ter pelo menos 3 caracteres.");
      return;
    }

    const dados = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      tipo,
      local,
      prioridade,
      data_abertura: dataAbertura,
    };

    try {
      setSalvando(true);
      if (isEdicao) {
        await api.put(`/chamados/${id}`, dados);
        setMensagemSucesso("Chamado atualizado com sucesso!");
        setTimeout(() => navigate(`/chamado/${id}`), 1000);
      } else {
        const res = await api.post("/chamados", dados);
        setMensagemSucesso("Chamado criado com sucesso!");
        setTimeout(() => navigate(`/chamado/${res.data.id}`), 1000);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        const d = err.response.data.detail;
        setMensagemErro(typeof d === "string" ? d : "Dados inválidos. Verifique os campos.");
      } else {
        setMensagemErro("Erro ao salvar o chamado.");
      }
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div id="form-status-carregando" className="estado-tela">
        Carregando formulário...
      </div>
    );
  }

  // Regra do PDF: não permitir editar chamados resolvidos
  if (isEdicao && isResolvido) {
    return (
      <div id="painel-bloqueio-edicao" className="painel-bloqueio-resolvido">
        <h2 className="bloqueio-titulo">Chamado Resolvido</h2>
        <p className="bloqueio-descricao">
          Este chamado já foi resolvido e não pode mais ser editado.
        </p>
        <Link
          to={`/chamado/${id}`}
          id="link-voltar-bloqueio"
          className="link-voltar"
        >
          ← Voltar para o detalhe do chamado
        </Link>
      </div>
    );
  }

  return (
    <div id="secao-formulario-chamado" className="pagina-formulario">
      <Link to="/" id="link-voltar-form" className="link-voltar">
        ← Voltar
      </Link>

      <div id="cartao-formulario-chamado" className="card-formulario">
        <h1 id="titulo-pagina-formulario" className="formulario-titulo">
          {isEdicao ? "Editar chamado" : "Abrir chamado"}
        </h1>

        <form id="form-cadastro-chamado" onSubmit={handleSubmit} className="corpo-formulario">
          {/* Mensagem de Erro */}
          {mensagemErro && (
            <div id="mensagem-alerta-erro" className="mensagem-feedback mensagem-feedback-erro">
              {mensagemErro}
            </div>
          )}

          {/* Mensagem de Sucesso */}
          {mensagemSucesso && (
            <div id="mensagem-alerta-sucesso" className="mensagem-feedback mensagem-feedback-sucesso">
              {mensagemSucesso}
            </div>
          )}

          {/* Campo Título */}
          <div className="grupo-campo">
            <label htmlFor="input-titulo-chamado" className="rotulo-campo">
              Título
            </label>
            <input
              type="text"
              id="input-titulo-chamado"
              required
              minLength={3}
              maxLength={80}
              placeholder="Ex: Torneira vazando no banheiro"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="input-formulario"
            />
          </div>

          {/* Campo Descrição */}
          <div className="grupo-campo">
            <label htmlFor="textarea-descricao-chamado" className="rotulo-campo">
              Descrição
            </label>
            <textarea
              id="textarea-descricao-chamado"
              rows={3}
              maxLength={500}
              placeholder="Descreva o problema com mais detalhes..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="textarea-formulario"
            />
          </div>

          {/* Linha com Tipo e Local */}
          <div className="linha-dupla-campos">
            <div className="grupo-campo">
              <label htmlFor="select-tipo-servico" className="rotulo-campo">
                Tipo
              </label>
              <select
                id="select-tipo-servico"
                required
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="select-formulario"
              >
                {tipos.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="grupo-campo">
              <label htmlFor="select-local-ocorrencia" className="rotulo-campo">
                Local
              </label>
              <select
                id="select-local-ocorrencia"
                required
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className="select-formulario"
              >
                {locais.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Linha com Prioridade e Data de Abertura */}
          <div className="linha-dupla-campos">
            <div className="grupo-campo">
              <label htmlFor="select-nivel-prioridade" className="rotulo-campo">
                Prioridade
              </label>
              <select
                id="select-nivel-prioridade"
                required
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="select-formulario"
              >
                {prioridades.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="grupo-campo">
              <label htmlFor="input-data-abertura" className="rotulo-campo">
                Data de abertura
              </label>
              <input
                type="date"
                id="input-data-abertura"
                required
                value={dataAbertura}
                onChange={(e) => setDataAbertura(e.target.value)}
                className="input-formulario"
              />
            </div>
          </div>

          {/* Rodapé do Formulário: Botões Salvar e Cancelar */}
          <div className="rodape-botoes-form">
            <button
              type="button"
              id="btn-cancelar-formulario"
              onClick={() => navigate(isEdicao ? `/chamado/${id}` : "/")}
              className="btn-form-cancelar"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-salvar-formulario"
              disabled={salvando}
              className="btn-form-salvar"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
