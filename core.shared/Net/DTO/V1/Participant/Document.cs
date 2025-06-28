namespace Core.Shared.Net.DTO.V1.Participant
{
    public class Document
    {
        public int message_Retour_nombre { get; set; }
        public DocumentRootMessage_Retour message_Retour { get; set; }
        public string nomPDF { get; set; }
        public Pdf PDF { get; set; }
    }
}
