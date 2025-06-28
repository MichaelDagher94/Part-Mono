using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Eptica
{
    public class EpticaRequest
    {
        public EnuEpticaDestination Destination { get; set; }
        public string Comment { get; set; } = string.Empty;
        public IList<byte[]> Files { get; set; }
        public string Application { get; set; } = string.Empty;
        public string NumPlitg { get; set; } = string.Empty;
        public string NumDocg { get; set; } = string.Empty;
        public string FormName { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string SocialSecurityNumber { get; set; } = string.Empty;
        public string NumParticipant { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string Birthdate { get; set; } = string.Empty;
        public string Vip { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string HtmlBody { get; set; } = string.Empty;
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
