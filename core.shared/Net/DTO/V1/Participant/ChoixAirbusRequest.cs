using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Participant
{
    public class ChoixAirbusRequest
    {
        public string NumeroParticipant { get; set; } = string.Empty;
        public EnuChoix Choix { get; set; }
        public int RaisonAdhesion { get; set; }
        public string MoisAdhesion { get; set; } = string.Empty;
        public DateTime DateResiliation { get; set; }
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
