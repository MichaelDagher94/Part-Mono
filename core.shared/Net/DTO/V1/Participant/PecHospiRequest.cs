namespace Core.Shared.Net.DTO.V1.Participant
{
    public class PecHospiRequest
    {
        public string NumeroParticipant { get; set; } = string.Empty;
        public string CodeFiness { get; set; } = string.Empty;
        public string DateEntree { get; set; } = string.Empty;
        public string DateSortie { get; set; } = string.Empty;
        public string IdBeneficiaire { get; set; } = string.Empty;
        public bool IdBeneficiaireSpecified { get; set; }
        public bool IdParticipantSpecified { get; set; }
        public string AutreFax { get; set; } = string.Empty;
        public string AutreInformation { get; set; } = string.Empty;
        public string ReferenceDossier { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
