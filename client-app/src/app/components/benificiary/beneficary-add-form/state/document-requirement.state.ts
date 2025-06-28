export const DOCUMENT_REQUIREMENTS = {
  6001: [
    "Pacte Civil de Solidarité ou attestation ...",
    "Attestation de Sécurité sociale",
  ],
  7: [
    "Pacte Civil de Solidarité ou attestation d’inscription au registre du Greffe du Tribunal d’Instance",
    "Attestation de Sécurité sociale",
  ],
  8: [
    "Attestation sur l’honneur",
    "Justificatif de domicile commun (quittance de loyer, facture EDF, avis d’imposition)",
    "Attestation de Sécurité sociale",
    "Autre justificatif",
  ],
  9: [
    "Acte de naissance ou livret de famille",
    "Attestation de Sécurité sociale du salarié ou de son conjoint/concubin justifiant de la qualité d’ayant droit de l’enfant",
  ],
  DEPENDENT_PARENT: [
    "Photocopie du livret de famille du participant*",
    "Photocopie de l’avis d’imposition du participant où figure le nom de l’ascendant ou attestation de droits à la Complémentaire santé solidaire.",
    "*En cas de rattachement récent au foyer fiscal et si l’ascendant ne figure pas sur le dernier avis d’imposition, il est demandé au participant de transmettre un justificatif émanant des impôts prouvant le rattachement récent.",
  ],
  TAX_DEPENDENT_CHILD: [],
} as const;

export type RequirementKey = keyof typeof DOCUMENT_REQUIREMENTS;
