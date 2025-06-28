namespace Core.Shared.Net.DTO.V1.Geolocalisation
{
    public class Geolocalisation
    {
        public string NumeroIpeca { get; set; }
        public string NumeroFINESS { get; set; }
        public string Type { get; set; }
        public string Nom { get; set; }
        public string Adresse1 { get; set; }
        public string Adresse2 { get; set; }
        public string Adresse3 { get; set; }
        public string CodePostal { get; set; }
        public string Ville { get; set; }
        public string Pays { get; set; }
        public string Tel { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public DateTime? DateCharge { get; set; }
        public float? Latitude { get; set; }
        public float? Longitude { get; set; }
    }
}
