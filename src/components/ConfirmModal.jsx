import React from "react";
import "./ConfirmModal.css";

export function ConfirmModal({ isOpen, mensagem, onConfirmar, onCancelar }) {
  if (!isOpen) return null;

  return (
    <div id="modal-confirmacao-exclusao" className="modal-overlay">
      <div className="modal-caixa">
        <h3 className="modal-titulo">Confirmação</h3>
        <p className="modal-mensagem">
          {mensagem || "Tem certeza que deseja excluir este chamado?"}
        </p>
        <div className="modal-acoes">
          <button
            type="button"
            id="btn-cancelar-exclusao"
            onClick={onCancelar}
            className="btn-modal-cancelar"
          >
            Cancelar
          </button>
          <button
            type="button"
            id="btn-confirmar-exclusao"
            onClick={onConfirmar}
            className="btn-modal-excluir"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
