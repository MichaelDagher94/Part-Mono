using Core.Shared.Net.DTO.V1.Beneficiaire;

namespace Core.Shared.Net.DTO.V1.Remboursement
{
    public class RemboursementPrevoyance
    {
        public DateTime DateDeRemboursementComplet { get; set; }
        public string NumeroParticipant { get; set; }
        public string Identifiant_Decompte { get; set; }
        public string TruncatDateDeRemboursement { get; set; }
        public string DateReglement { get; set; }
        public string DateDeRemboursement { get; set; }
        public string Libelle { get; set; }
        public string Montant { get; set; }
        public DateTime DateIndeminisationMin { get; set; }
        public DateTime DateIndeminisationMax { get; set; }
        public IList<LeBeneficiaire> Beneficiaires { get; set; }
        public IList<CodesActes> Codactes { get; set; }
        public string TypeRemboursement { get; set; }
        public string LibelleTypeRemboursement { get; set; }
        public string PeriodeDateRemboursement { get; set; }
        public string NumeroDeDossier { get; set; }
        public string TauxActivite { get; set; }
        public string MontantBrut { get; set; }
        public string CsgNonImposable { get; set; }
        public string CsgImposable { get; set; }
        public string RdsImposable { get; set; }
        public string CasaImposable { get; set; }
        public string MontantNetFiscal { get; set; }
        public string PasTypeTaux { get; set; }
        public string PasTaux { get; set; }
        public string PasMontant { get; set; }
        public string Civilite { get; set; }
        public bool Pdf { get; set; }
        public IList<RemboursementPrevoyanceDetails> RemboursementsPrevoyanceDetail { get; set; }
    }
}
