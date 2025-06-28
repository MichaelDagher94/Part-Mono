namespace Core.Shared.Net.DTO.V1.CaptainWallet
{
    public class WalletOauthRequest
    {
        public string client_secret { get; set; }
        public string client_id { get; set; }
        public string grant_type { get; set; }
        public string scope { get; set; }
    }
}
