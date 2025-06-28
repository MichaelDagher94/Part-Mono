namespace Core.Shared.Net.DTO.V1.Actualite
{
    public class TrancheAge
    {
        public int id { get; set; }
        public int ageMin { get; set; }
        public int ageMax { get; set; }
        public DateTime? dateDebut { get; set; }
        public DateTime? dateFin { get; set; }
    }
}
