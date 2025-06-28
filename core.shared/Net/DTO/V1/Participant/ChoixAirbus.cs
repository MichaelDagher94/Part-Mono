using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Participant
{
    public class ChoixAirbus
    {
        public int id { get; set; }
        public string NumParticipant { get; set; }
        public EnuContrat ContratParticipant { get; set; }
        public EnuContratAction ContratAction { get; set; }
        public DateTime? DateEffet { get; set; }
        public EnuRaisonAdhesionParticipant? RaisonAdhesion { get; set; }
        public string Libelle { get; set; }
        public string Description { get; set; }
        public DateTime? DateResiliation { get; set; }
        public DateTime? DateAdhesion { get; set; }
        public EnuContratResiliation ContratResiliation { get; set; }
    }
}
