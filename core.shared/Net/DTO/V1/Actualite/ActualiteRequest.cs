namespace Core.Shared.Net.DTO.V1.Actualite
{
    public class ActualiteRequest
    {
        public string ID { get; set; }
        public IList<string> codeAdherent { get; set; }
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
    }
}
