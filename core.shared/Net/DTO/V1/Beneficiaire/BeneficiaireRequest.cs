namespace Core.Shared.Net.DTO.V1.Beneficiaire
{
    public class BeneficiaireRequest
    {
        public string ID { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string NSS { get; set; } = string.Empty;
        public string DateDeNaissance { get; set; } = string.Empty;
        public string DateDeSurvenance { get; set; } = string.Empty;
        public string Rang { get; set; } = string.Empty;
        public string NumeroRAT { get; set; } = string.Empty;
        public string Sexe { get; set; } = string.Empty;
        public string MJF { get; set; } = string.Empty;
        public string Situation { get; set; } = string.Empty;
        public string participantLinked { get; set; } = string.Empty;
        public string Evenement { get; set; } = string.Empty;
        public string TypeDemande { get; set; } = string.Empty;
        public string Vip { get; set; } = string.Empty;
        public IList<byte[]> Files { get; set; }
        public string TypeEvenement { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;

    }
}
