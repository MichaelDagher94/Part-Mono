using Core.Shared.Net.Enumerations.V1;
using System.ComponentModel.DataAnnotations;

namespace Core.Shared.Net.DTO.V1.Notification
{
    public class NOT_NotificationDashboard_I
    {
        public Guid Id { get; set; }
        public EnuNotificationType? Type { get; set; }
        [MaxLength(250)]
        public string HtmlHeader { get; set; }
        public string HtmlBody { get; set; }
        [MaxLength(250)]
        public string HtmlFooter { get; set; }
        [MaxLength(20)]
        public string FormColor { get; set; }
        [MaxLength(20)]
        public string FormOpacity { get; set; }
        [MaxLength(10)]
        public string FormTop { get; set; }
        [MaxLength(10)]
        public string FormLeft { get; set; }
        [MaxLength(10)]
        public string FormHeight { get; set; }
        [MaxLength(10)]
        public string FormWidth { get; set; }

    }
}
