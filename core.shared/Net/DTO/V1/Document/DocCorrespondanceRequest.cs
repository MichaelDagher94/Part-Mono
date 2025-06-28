using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Document
{
    public class DocCorrespondanceRequest
    {
        public IList<EnuCorrespondance> Correspondances { get; set; }
        public bool isSiteWeb { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Browser { get; set; } = string.Empty;
        public string Engine { get; set; } = string.Empty;
    }
}
