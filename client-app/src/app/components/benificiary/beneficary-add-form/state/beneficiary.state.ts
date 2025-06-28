import { IpecaGenre } from "../../../../../../../shared-library/src/lib/enumerations/v1/ipecaGenre";

export const STATE = {
  birthRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  ssnInfo:
    "Votre numéro de Sécurité sociale se trouve sur votre attestation de carte vitale ou directement sur votre carte vitale. Si vous avez besoin d’informations complémentaires, nous vous invitons à vous connecter à www.ameli.fr",
  motiveInfo:
    "Par ascendant, l’on entend les ascendants directs (tel que père, mère, grand-pères, grand-mères, arrière-grands-pères et arrière-grands-mères) et les ascendants collatéraux (tel que tante, oncle, grande-tante et grand-oncle). Le contrat collectif en vigueur prend en charge uniquement les ascendants du Participant (salarié) rattachés au foyer fiscal et figurant sur son avis d’imposition ou les ascendants bénéficiaires à titre personnel de complémentaire santé solidaires. Les ascendants du Conjoint sont exclus.",
  rattachementSSInfo:
    "Veuillez renseigner le numéro de sécurité sociale du(des) parent(s) sur lequel est rattaché le bénéficiaire mineur",
  teletransmissionInfo:
    "La Télétransmission NOEMIE permet la transmission automatique vers IPECA des remboursements effectués par la Sécurité sociale. Le participant n’a plus besoin d’adresser les décomptes papiers de la Sécurité sociale à IPECA. Attention, celle-ci ne peut être activée qu’avec un seul organisme de complémentaire santé",
  ssnPattern:
    /^[1-2]\s*[0-9]{2}\s*(0[1-9]|1[0-2])\s*[0-9]{2}\s*[0-9]{3}\s*[0-9]{3}\s*[0-9]{2}$/,
  ssnMask: "X 00 00 00 000 000 00",
  majorAge: 18,
  // genders: ["Masculin", "Féminin"],
  genders: [
    { key: IpecaGenre.Male, value: "Masculin" },
    { key: IpecaGenre.Femelle, value: "Féminin" },
  ],
  OtherMutualBannerMsg: `Savez-vous que votre bénéficiaire peut obtenir un remboursement supplémentaire par IPECA en cas de reste à charge ?
Pour cela, transmettez-nous les décomptes papiers de sa complémentaire santé.`,
};
