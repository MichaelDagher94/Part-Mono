namespace Core.Shared.Net.DTO.V1.Participant
{
    public class ParticipantRequest
    {
        public string NumParticipant { get; set; } = string.Empty;
        public string NumAttestation { get; set; } = string.Empty;
        public string Id { get; set; } = string.Empty;
        public ParticipantBanque BanqueInfo { get; set; } = new ParticipantBanque();
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public ParticipantAdresse Adresse { get; set; } = new ParticipantAdresse();
        public string Password { get; set; } = string.Empty;
        public string OldPassword { get; set; } = string.Empty;
        public string Iban { get; set; } = string.Empty;
        public string ORIGINE { get; set; } = string.Empty;
        public string domiciliation { get; set; } = string.Empty;
        public string titulaire { get; set; } = string.Empty;
        public string bic { get; set; } = string.Empty;
        public string ENVOIEMAIL { get; set; } = string.Empty;
        public string decompteCode { get; set; } = string.Empty;
        public string dateEmission { get; set; } = string.Empty;
        public decimal montant { get; set; }
        public string service { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
        public bool IsAirbus { get; set; } = false;
        public string ActivationCode { get; set; } = string.Empty;
    }
}
