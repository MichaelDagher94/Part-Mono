namespace Core.Shared.Net.DTO.V1.Participant
{
    public class Consentements_Participants
    {
        public string NumParticipant { get; set; }
        public int ID_Consentement { get; set; }
        public bool Reponse { get; set; }
        public DateTime? DateMAJChoix { get; set; }
        public int ID_TypeReponse { get; set; }
    }
}
