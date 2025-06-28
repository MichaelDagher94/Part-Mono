namespace Core.Shared.Net.DTO.V1.Geolocalisation
{
    public class GeolocalisationRequest
    {
        public string NumeroParticipant { get; set; } = string.Empty;
        public string Ville { get; set; } = string.Empty;
        public string Adresse { get; set; } = string.Empty;
        public string TypePS { get; set; } = string.Empty;
        public string CodeFinesse { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
