namespace Core.Shared.Net.DTO.V1.Participant
{
    public class ServicesRequest
    {
        public string ParticipantId { get; set; } = string.Empty;
        public string ServiceId { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
