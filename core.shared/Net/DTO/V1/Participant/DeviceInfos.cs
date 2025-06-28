namespace Core.Shared.Net.DTO.V1.Participant
{
    public class DeviceInfos
    {
        public Guid DeviceId { get; set; }
        public string NumParticipant { get; set; }
        public string DeviceName { get; set; }
        public DateTime ActivationDate { get; set; }
        public bool isTrustedDevice { get; set; }
    }
}
