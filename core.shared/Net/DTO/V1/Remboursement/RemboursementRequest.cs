namespace Core.Shared.Net.DTO.V1.Remboursement
{
    public class RemboursementRequest
    {
        public string NumParticipant { get; set; } = string.Empty;
        public DateTime? DateDeRemboursement1 { get; set; }
        public DateTime? DateDeRemboursement2 { get; set; }
        public string NombreDeLignes { get; set; } = string.Empty;
        public double Montant { get; set; }
        public string DatePrevoyance { get; set; } = string.Empty;
        public string NatureDeSoins { get; set; } = string.Empty;
        public string Beneficiaire { get; set; } = string.Empty;
        public string decompteParticipant { get; set; } = string.Empty;
        public string dateEmission { get; set; } = string.Empty;
        public string decompteCode { get; set; } = string.Empty;
        public string ENVOIEMAIL { get; set; } = string.Empty;
        public string emailSender { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
        public string NumeroBordereau { get; set; } = string.Empty;
        public string CodeBordereau { get; set; } = string.Empty;
    }
}
