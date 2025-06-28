namespace Core.Shared.Net.DTO.V1.Geolocalisation
{
    public class VilleGeolocalisationRequest
    {
        public IEnumerable<string> TypePS { get; set; }
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
