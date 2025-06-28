using Core.Shared.Net.DTO.V1.Beneficiaire;

namespace Core.Shared.Net.DTO.V1.Remboursement
{
    public class RemboursementPrevoyanceDetails
    {
        public string NumeroParticipant { get; set; }
        public string Montant { get; set; }
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

        public IList<LeBeneficiaire> Beneficiaires { get; set; }
        public IList<CodesActes> Codactes { get; set; }
    }
}
