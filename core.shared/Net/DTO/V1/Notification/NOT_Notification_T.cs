using Core.Shared.Net.Enumerations.V1;
using System.ComponentModel.DataAnnotations;

namespace Core.Shared.Net.DTO.V1.Notification
{
    public class NOT_Notification_T
    {
        public Guid Id { get; set; }
        public EnuNotificationType? Type { get; set; }
        public bool Enabled { get; set; }
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        public DateTime? BeginDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
