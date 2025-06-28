using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Participant
{

    public class ActivationCompteRequest
    {
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string DateDeNaissance { get; set; } = string.Empty;
        public string CodePostal { get; set; } = string.Empty;
        public string ChampIdentification { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string LienPageActivation { get; set; } = string.Empty;
        public string ActivationCode { get; set; } = string.Empty;
        public EnuActivationType ActivationType { get; set; }
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
    }
}
