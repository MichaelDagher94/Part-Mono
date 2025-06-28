using Core.Shared.Net.DTO.V1.Participant;
using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Beneficiaire
{
    public class AddTempBeneficiaryRequest
    {
        public string NumParticipant { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public EnuGenre Genre { get; set; }
        public string NumSS { get; set; }
        public string ClefSS { get; set; }
        public string NumSS2 { get; set; }
        public string ClefSS2 { get; set; }
        public DateTime BornDate { get; set; }
        public int? Rang { get; set; }
        public string Reason { get; set; }
        public bool AlsoCovered { get; set; }
        public bool ETransmission { get; set; }
    }
}
