using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Notification
{
    public  class NOT_Perimeter_Request
    {
        public string NumAdherent { get; set; } = null;
        public string NumEtablissement { get; set; } = null;
        public string Age { get; set; } = null;
        public string Population { get; set; } = null;
        public EnuDevicePlatform? DevicePlatform { get; set; } = EnuDevicePlatform.Navigator;
    }
}
