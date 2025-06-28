namespace Core.Shared.Net.DTO.V1.Participant
{
    public class ParticipantBanque
    {
        public string Domicialiation { get; set; } = string.Empty;
        public string Titulaire { get; set; } = string.Empty;
        public string Iban { get; set; } = string.Empty;
        public string BicSwift { get; set; } = string.Empty;
    }
}
