namespace Core.Shared.Net.DTO.V1.TiersPayant
{
    public class TiersPayantRequest
    {
        //VXIDEN
        public string NumParticipant { get; set; } = string.Empty;

        public string Attestation { get; set; } = string.Empty;

        //VXNINT
        public string IntParticipant { get; set; } = string.Empty;

        public string emailSender { get; set; } = string.Empty;

        public string ENVOIEMAIL { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;

    }
}
