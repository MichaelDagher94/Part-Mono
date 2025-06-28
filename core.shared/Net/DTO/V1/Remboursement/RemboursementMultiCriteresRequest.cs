namespace Core.Shared.Net.DTO.V1.Remboursement
{
    public class RemboursementMultiCriteresRequest
    {
        public string ParticipantID { get; set; } = string.Empty;
        public DateTime DateDeRemboursementMin { get; set; }
        public DateTime DateDeRemboursementMax { get; set; }
        public DateTime DateDeSoinMin { get; set; }
        public DateTime DateDeSoinMax { get; set; }
        public string NatureDeSoins { get; set; } = string.Empty;
        public string Beneficiaire { get; set; } = string.Empty;
        public string NombreDeLigne { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
