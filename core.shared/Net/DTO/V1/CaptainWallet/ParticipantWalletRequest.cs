using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.CaptainWallet
{
    public class ParticipantWalletRequest
    {
        public string Id { get; set; } = string.Empty;
        public EnuStatutParticipant StatutParticipant { get; set; }
        public bool IsBatch { get; set; }
    }
}
