namespace Core.Shared.Net.DTO.V1.Notification
{
    public class NOT_AllEntry_Request: NOT_Entry_Request
    {
        public DateTime EntryDate { get; set; }
        public string NumParticipant { get; set; }
    }
}
