using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Notification
{
    public class NOT_AllPerimeter_Request: NOT_Perimeter_Request
    {
        public EnuNotificationType? Type { get; set; } = EnuNotificationType.Dashboard;
        public DateTime? DateTime { get; set; } = null;
        public string NumParticipant { get; set; } = string.Empty;
    }
}
