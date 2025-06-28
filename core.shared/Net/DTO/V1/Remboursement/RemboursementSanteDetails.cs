namespace Core.Shared.Net.DTO.V1.Remboursement
{
    public class RemboursementSanteDetails
    {
        public string Depense { get; set; }
        public string Rac { get; set; }
        public string VerseParIpeca { get; set; }
        public string BeneficiaireCivilite { get; set; }
        public string Libelle { get; set; }
        public string CodeCodeAct { get; set; }
        public string PrenomBeneficiaire { get; set; }
        public string DateNaissanceBeneficiaire { get; set; }
        public string DateDeSoin { get; set; }
        public string NomBeneficiaire { get; set; }
        public string Civilite { get; set; }
        public string Ordre { get; set; }
        public string SecuriteSociale { get; set; }
        public string AutreOrganisme { get; set; }
        public int Participant { get; set; }
        public int Rang { get; set; }
        public string FamilleActe { get; set; }
        public string BeneficiaireNom { get; set; }
        public int Beneficiaire { get; set; }
        public string NumeroBurderau { get; set; }
        public string CodeBordereau { get; set; }
        public int NumeroLot { get; set; }
    }
}
