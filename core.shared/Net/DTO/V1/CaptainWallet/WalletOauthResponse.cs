﻿namespace Core.Shared.Net.DTO.V1.CaptainWallet
{
    public class WalletOauthResponse
    {
        public string token_type { get; set; }
        public string expires_in { get; set; }
        public string access_token { get; set; }
    }
}
