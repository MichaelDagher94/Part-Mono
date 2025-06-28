namespace Core.Shared.Net.DTO.V1.CaptainWallet
{
    public class ParticipantWallet
    {
        public string ContratResponsable { get; set; }
        public string Type { get; set; }
        public string NumeroAMC { get; set; }
        public string QrCode { get; set; }
        public AssurePrincipal AssurePrincipal { get; set; }
        public IList<Beneficiaires> Beneficiaires { get; set; }
        public string DebutValidite { get; set; }
        public string FinValidite { get; set; }
        public string carte_active { get; set; }
        public string CodeGR { get; set; }
        public string AssistanceReference { get; set; }
        public string AssistanceContact { get; set; }
        public string ComplementGR { get; set; }
        public string Statut { get; set; }
        public string AssureHash { get; set; }
    }
}
