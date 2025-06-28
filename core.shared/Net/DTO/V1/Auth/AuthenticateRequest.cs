namespace Core.Shared.Net.DTO.V1.Auth
{
    public class AuthenticateRequest
    {
        public string Login { get; set; }
        public string HashedPassword { get; set; }
        public string OldHashedPassword { get; set; }
        public string Password { get; set; }
        public string DeviceName { get; set; }
        public string IpAddress { get; set; }
        public string DeviceId { get; set; }
        public int Attempt { get; set; }
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; }
        public string Browser { get; set; }
        public string Engine { get; set; }
    }
}
