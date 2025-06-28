namespace Core.Shared.Net.DTO.V1.Beneficiaire
{
    public class BeneficiaireGetIdentificationRequest
    {
        public DateTime? DATE_DEMANDE { get; set; }
        public int Numero_Adherent { get; set; }
        public string NOM { get; set; }
        public string PRENOM { get; set; }
        public DateTime? DATE_NAISSANCE { get; set; }
        public string TYPE_DEMANDE { get; set; }
    }
}
