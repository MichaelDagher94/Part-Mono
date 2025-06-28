namespace Core.Shared.Net.DTO.V1.Participant
{
    public class ParticipantAdresse
    {
        public string Adresse1 { get; set; } = string.Empty;
        public string Adresse2 { get; set; } = string.Empty;
        public string Adresse3 { get; set; } = string.Empty;
        public string CodePostal { get; set; } = string.Empty;
        public string Ville { get; set; } = string.Empty;
        public string Pays { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; } 
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
