namespace Core.Shared.Net.DTO.Net.V1.Participant
{
    public class DocumentRequest
    {
        public string typeDocument { get; set; } = string.Empty;
        public string cleDocument { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
