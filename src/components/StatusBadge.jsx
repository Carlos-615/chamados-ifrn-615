import React from "react";
import "./Badges.css";

export function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();

  let classeStatus = "badge-status-padrao";
  if (s === "aberto") {
    classeStatus = "badge-status-aberto";
  } else if (s === "em andamento") {
    classeStatus = "badge-status-andamento";
  } else if (s === "resolvido") {
    classeStatus = "badge-status-resolvido";
  }

  return (
    <span className={`badge ${classeStatus}`}>
      {status}
    </span>
  );
}
