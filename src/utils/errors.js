export function parseApiError(error) {
  if (!error) return "Ocorreu um erro inesperado.";

  const detail = error.response?.data?.detail;
  if (detail) {
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          const field = item.loc ? item.loc[item.loc.length - 1] : "";
          const msg = item.msg || "dado inválido";
          return field ? `${field}: ${msg}` : msg;
        })
        .join(" | ");
    }
    if (typeof detail === "object") {
      return JSON.stringify(detail);
    }
  }

  if (error.response?.status === 400) {
    return "Ação inválida ou etapa fora de ordem.";
  }
  if (error.response?.status === 401) {
    return "Chave de API inválida ou não autorizada. Verifique sua chave no topo da tela.";
  }
  if (error.response?.status === 404) {
    return "Chamado não encontrado.";
  }
  if (error.response?.status === 422) {
    return "Dados inválidos enviados para a API.";
  }

  if (error.message) {
    if (error.message.includes("Network Error")) {
      return "Erro de conexão com o servidor da API. Verifique sua internet.";
    }
    return error.message;
  }

  return "Erro ao processar a requisição na API.";
}
