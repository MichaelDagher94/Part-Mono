namespace Core.Shared.Net.DTO.V1.Participant
{
    public class Devis
    {
        public int liste_nombre { get; set; }
        public DevisRootListe[] liste { get; set; }
        public int message_Retour_nombre { get; set; }
        public DevisRootMessage_Retour[] message_Retour { get; set; }
    }
}
