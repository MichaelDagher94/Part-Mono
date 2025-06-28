using Core.Shared.Net.DTO.V1.Eptica;
using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Participant
{
    public class CoordonneeParticipantRequest
    {
        public string NumParticipant { get; set; } = string.Empty;
        public EnuGenre Genre { get; set; }
        public string Telephone1 { get; set; } = string.Empty;
        public string Telephone2 { get; set; } = string.Empty;
        public ParticipantAdresse Adresse { get; set; }
        public EpticaRequest SaveDocument { get; set; }
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
