namespace Core.Shared.Net.DTO.V1.Beneficiaire
{
    public class BeneficiaireNbBeneficiairesResponse
    {
        public int CODE_RETOUR { get; set; }
        public DateTime DATE_DEMANDE { get; set; }
        public DateTime DATE_REPONSE { get; set; }
        public string MSG_ERREUR { get; set; }
        public int NOMBRE_BENEF { get; set; }
    }
}
