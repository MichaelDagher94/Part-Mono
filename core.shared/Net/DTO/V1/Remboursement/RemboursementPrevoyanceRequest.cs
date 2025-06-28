namespace Core.Shared.Net.DTO.V1.Remboursement
{
    public class RemboursementPrevoyanceRequest
    {
        public string NumeroParticipant { get; set; } = string.Empty;
        public DateTime DateIndemnisationMin { get; set; }
        public DateTime DateIndemnisationMax { get; set; }
        public DateTime DateVersementMin { get; set; }
        public DateTime DateVersementMax { get; set; }
        public string NombreDeLignes { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
