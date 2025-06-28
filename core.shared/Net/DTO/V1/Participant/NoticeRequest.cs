namespace Core.Shared.Net.DTO.V1.Participant
{
    public class NoticeRequest
    {
        public string NomFichier { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public string EnvoieEmail { get; set; } = string.Empty;
        public string NumParticipant { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
