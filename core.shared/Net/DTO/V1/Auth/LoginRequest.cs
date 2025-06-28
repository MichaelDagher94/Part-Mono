namespace Core.Shared.Net.DTO.V1.Auth
{
    public class LoginRequest
    {
        public string Login { get; set; }
        public string Password { get; set; }

        public string DeviceName { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string DeviceId { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; } = false;
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
