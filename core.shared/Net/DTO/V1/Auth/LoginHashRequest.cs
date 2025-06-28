namespace Core.Shared.Net.DTO.V1.Auth
{
    public class LoginHashRequest
    {
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public string DeviceName { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string DeviceId { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; } 
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
