namespace Core.Shared.Net.DTO.V1.Participant
{
    public class Consentement
    {
        public string NumParticipant { get; set; } = string.Empty;
        public int IdConsentement { get; set; }
        public bool Reponse { get; set; }
        public int IdTypeReponse { get; set; }
    }
}
