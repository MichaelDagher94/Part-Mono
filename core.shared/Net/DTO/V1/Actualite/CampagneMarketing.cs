namespace Core.Shared.Net.DTO.V1.Actualite
{
    public class CampagneMarketing
    {
        public int id { get; set; }
        public string libelleCourt { get; set; }
        public string libelleLong { get; set; }
        public DateTime? dateDebut { get; set; }
        public DateTime? dateFin { get; set; }
    }
}
