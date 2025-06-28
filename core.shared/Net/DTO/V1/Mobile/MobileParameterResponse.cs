namespace Core.Shared.Net.DTO.V1.Mobile
{
    public class MobileParameterResponse
    {
        public string LastVersion { get; set; }
        public string MinVersion { get; set; }
        public bool SecurityEnabled { get; set; }
        public int AttachmentsSizeMax { get; set; }
        public byte AttachmentsNumMax { get; set; }
        public int AttachmentSizeMax { get; set; }
    }
}
