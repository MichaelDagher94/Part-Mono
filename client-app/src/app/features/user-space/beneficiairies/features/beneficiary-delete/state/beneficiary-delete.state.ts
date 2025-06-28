export enum Gender {
  MALE = 1,
  FEMALE = 0,
}

interface DeleteEvent {
  code: string;
  label: string;
}

export const DELETE_STATE = {
  EVENT_TYPES: [
    { code: 17, label: "Décès" },
    { code: 18, label: "Divorce" },
    { code: 19, label: "Dissolution de PACS" },
    { code: 20, label: "Séparation" },
    { code: 21, label: "Fin de vie maritale" },
    { code: 22, label: "Radiation" },
    { code: 25, label: "Enfant plus à charge fiscale" },
  ],
  MAJOR_AGE: 18,
  SSN_MASK: "0 00 00 00 000 000 00",
  DOCUMENT_REQUIREMENTS: {
    17: ["Acte de décès"],
    18: ["Jugement de divorce ou séparation de corps"],
    19: ["Attestation de dissolution du PACS"],
    20: ["Courrier signé des deux parties"],
    21: [],
    22: [],
    25: [],
  },
} as const;

export const SSN_PATTERN =
  /^\d{1}[ ]?\d{2}[ ]?\d{2}[ ]?\d{2}[ ]?\d{3}[ ]?\d{3}[ ]?\d{2}$/;
