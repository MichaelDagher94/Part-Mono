using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Document
{
    public class DOC_Perimeter_T_Request
    {
        public string NumAdherent { get; set; } = null;
        public string NumEtablissement { get; set; } = null;
        public string Age { get; set; } = null;
        public string Population { get; set; } = null;
        public EnuDocType? Type { get; set; } = null;
        public bool? Echeancier { get; set; } = null;
    }
}
