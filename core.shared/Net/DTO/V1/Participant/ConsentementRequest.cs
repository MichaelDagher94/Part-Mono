namespace Core.Shared.Net.DTO.V1.Participant
{
    public class ConsentementRequest
    {
        public IList<Consentement> consentements { get; set; }
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }


}
