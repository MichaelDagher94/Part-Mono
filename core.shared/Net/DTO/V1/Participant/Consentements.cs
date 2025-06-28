namespace Core.Shared.Net.DTO.V1.Participant
{
    public partial class Consentements
    {
        public int ID_Consentement { get; set; }
        public string NumParticipant { get; set; }
        public string Phrase { get; set; }
        public string Type { get; set; }
        public bool ReponseMultiplePossible { get; set; }
        public string InfoBulle { get; set; }
        public bool IsInfoBulle { get; set; }
        public IList<Consentements_TypeReponse> Consentements_TypeReponse { get; set; }

        public Consentements()
        {
            this.Consentements_TypeReponse = new List<Consentements_TypeReponse>();
        }
    }
}
