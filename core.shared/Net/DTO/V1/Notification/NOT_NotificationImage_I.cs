using Core.Shared.Net.Enumerations.V1;
using System.ComponentModel.DataAnnotations;

namespace Core.Shared.Net.DTO.V1.Notification
{
    public class NOT_NotificationImage_I
    {
        public Guid Id { get; set; }
        public EnuNotificationType? Type { get; set; }
        [MaxLength(250)]
        public string ImageUrl { get; set; }
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
        [MaxLength(250)]
        public string TextHeader1 { get; set; }
        [MaxLength(250)]
        public string TextHeader2 { get; set; }
        [MaxLength(250)]
        public string TextFooter1 { get; set; }
        [MaxLength(250)]
        public string UrlFooter1 { get; set; }
        [MaxLength(250)]
        public string TextFooter2 { get; set; }
        [MaxLength(250)]
        public string TextFooter3 { get; set; }
    }
}
