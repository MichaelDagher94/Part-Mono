using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Mobile
{
    public class MobilePerimeterRequest
    {
        public string DeviceManufacturer { get; set; } = string.Empty;
        public string DeviceModel { get; set; } = string.Empty;
        public string DeviceVersion { get; set; } = string.Empty;
        public EnuDevicePlatform? DevicePlatform { get; set; } = null;
    }
}
