import React from "react";
import "./Badges.css";

export function PriorityBadge({ prioridade }) {
  const p = (prioridade || "").toLowerCase();

  let classePrioridade = "badge-prioridade-padrao";
  if (p === "alta") {
    classePrioridade = "badge-prioridade-alta";
  } else if (p === "média" || p === "media") {
    classePrioridade = "badge-prioridade-media";
  } else if (p === "baixa") {
    classePrioridade = "badge-prioridade-baixa";
  }

  return (
    <span className={`badge ${classePrioridade}`}>
      Prioridade: {prioridade}
    </span>
  );
}
