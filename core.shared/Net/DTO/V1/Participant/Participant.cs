using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Participant
{
    public class Participant
    {
        public string Id { get; set; }
        public string NumeroParticipant { get; set; }
        public string NumeroIdentifiant { get; set; }
        public string Nom { get; set; }
        public string NomJeuneFille { get; set; }
        public string Prenom { get; set; }
        public string SituationFamiliale { get; set; }
        public DateTime DateNaissance { get; set; }
        public string NumeroSecuriteSociale { get; set; }
        public string ClefSecuriteSociale { get; set; }
        public string Email { get; set; }
        public EnuGenre Genre { get; set; }
        public ParticipantAdresse Adresse { get; set; }
        public string Iban { get; set; }
        public string Telephone { get; set; }
        public string VIP { get; set; }
        public string Domiciliation { get; set; }
        public string Bic { get; set; }
        public string Titulaire { get; set; }
        public int? NombreTentative { get; set; }
        public bool StatusTeleTransmission { get; set; }
        public string Pays { get; set; }
        public string TelephonePortable { get; set; }
        public string MultiRib { get; set; }
        public string RibBeneficiaire { get; set; }
        public string CodeAdherent { get; set; }
        public string CodeEtablissement { get; set; }
        public int AgeActuel { get; set; }
        public int AgeEnFinAnnee { get; set; }
        public string Population { get; set; }
        public bool CouvertureSante { get; set; }
        public bool CouvertureDeces { get; set; }
        public bool CouvertureArretTravail { get; set; }
        public string Civilite { get; set; }
        public string PremiereMutuelle { get; set; }
        public bool GestionCompte { get; set; }
        public string numAttestation { get; set; }
        public string DebutCarteTp { get; set; }
        public string FinCarteTp { get; set; }
        public string numAttestationFuture { get; set; }
        public string DebutCarteTpFuture { get; set; }
        public string FinCarteTpFuture { get; set; }
        public bool PremiereConnexion { get; set; }
        public bool EcheancierIndiv { get; set; }
        public bool IsAirbus { get; set; }
        public DateTime? DateEntreEntreprise { get; set; }
    }




}
