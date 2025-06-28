namespace Core.Shared.Net.DTO.V1.Participant
{
    public class PecHospi
    {
        public int message_Retour_nombre { get; set; }
        public PecHospiRootMessage_Retour[] message_Retour { get; set; }

        public bool message_Retour_nombreSpecified { get; set; }

    }


}
