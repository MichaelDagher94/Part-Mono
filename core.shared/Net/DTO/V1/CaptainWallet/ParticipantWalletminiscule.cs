namespace Core.Shared.Net.DTO.V1.CaptainWallet
{
    public class ParticipantWalletminiscule
    {
        public string contratResponsable { get; set; }
        public string type { get; set; }
        public string numeroAMC { get; set; }
        public string qrCode { get; set; }
        public AssurePrincipal assurePrincipal { get; set; }
        public IList<Beneficiaires> beneficiaires { get; set; }
        public string debutValidite { get; set; }
        public string finValidite { get; set; }
        public string carte_active { get; set; }
        public string codeGR { get; set; }
        public string assistanceReference { get; set; }
        public string assistanceContact { get; set; }
        public string complementGR { get; set; }
        public string statut { get; set; }
    }
}
