namespace Core.Shared.Net.DTO.V1.Document
{
    public class DocCorrespondance
    {
        public int id { get; set; }
        public string TypeDocument { get; set; }
        public string Email { get; set; }
        public string EmailAgence { get; set; }
        public string Objet { get; set; }
        public string Destination { get; set; }
        public string Objet_Obligatoire { get; set; }
        public bool Canal_Destination { get; set; }
        public bool MyIpeca_Transmettre { get; set; }
        public bool Sante_Demande_Devis { get; set; }
        public bool Sante_Demande_PEC_Hospi { get; set; }
        public bool Sante_Justificatif { get; set; }
        public bool Sante_Remboursement { get; set; }
        public bool Sante_Demande_Information { get; set; }
        public bool Prevoyance_Demande_Information { get; set; }
        public bool Prevoyance_Justificatif { get; set; }
        public bool Beneficiaire_Modification { get; set; }
        public bool Beneficiaire_Ajout { get; set; }
        public bool Beneficiaire_Suppression { get; set; }
        public bool Teletransmission { get; set; }
        public bool FormulaireANI { get; set; }
        public bool FormulaireProblemeConnexion { get; set; }
        public bool FormulairePS { get; set; }
        public bool FormulaireReclamation { get; set; }
        public bool FormulaireDemandeInfo { get; set; }
        public IList<PieceJustificative> Pieces { get; set; }
    }
}
