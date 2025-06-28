namespace Core.Shared.Net.DTO.V1.Auth
{
    public class ParameterResponse
    {
        public int MaxWrongAuthenticationAttempts { get; set; }
        public int BlockedAccountDurationInMinutes { get; set; }
        public int ActivationCodeDurationInHours { get; set; }
        public int ExecutionTimeout { get; set; }
    }
}
