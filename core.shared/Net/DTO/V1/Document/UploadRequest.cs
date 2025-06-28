namespace Core.Shared.Net.DTO.V1.Document
{
    public class UploadRequest
    {
        public string Lot { get; set; }
        public byte[] Data { get; set; }
        public byte[] DataSendToGedXML { get; set; }
        public bool IsWebSite { get; set; }
        public string Id { get; set; }
    }
}
