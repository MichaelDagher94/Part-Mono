namespace Core.Shared.Net.DTO.V1.Beneficiaire
{
    public class BeneficiaireGetIdentificationResponse
    {
        public int NINT { get; set; }
        public string NOM { get; set; }
        public string PRENOM { get; set; }
        public DateTime? DATE_NAISSANCE { get; set; }
        public string TYPE_DEMANDE { get; set; }
        public string STATUT { get; set; }
        public string CODE_RETOUR { get; set; }
        public DateTime? DATE_DEMANDE { get; set; }
        public DateTime? DATE_REPONSE { get; set; }
        public string ENTITE { get; set; }
        public string ERREUR { get; set; }
        public string MSG_ERREUR { get; set; }
        public string PARTENAIRE { get; set; }
    }
}
