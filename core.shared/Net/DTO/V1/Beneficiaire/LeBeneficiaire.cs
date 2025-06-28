using Core.Shared.Net.Enumerations.V1;

namespace Core.Shared.Net.DTO.V1.Beneficiaire
{
    public class LeBeneficiaire
    {
        public string Id { get; set; }
        public string Nom { get; set; }
        public string NomJeuneFille { get; set; }
        public string Prenom { get; set; }
        public string NomComplet { get; set; }
        public DateTime DateNaissance { get; set; }
        public string DateDeNaissance { get; set; }
        public string NumeroSecuriteSociale { get; set; }
        public string ClefSecuriteSociale { get; set; }
        public EnuGenre Genre { get; set; }
        public RangBeneficiaire Rang { get; set; }
        public string DateAffiliation { get; set; }
        public string NumAttestation { get; set; }
        public string DebutCarteTp { get; set; }
        public string FinCarteTp { get; set; }
        public string NumAttestationFuture { get; set; }
        public string DebutCarteTpFuture { get; set; }
        public string FinCarteTpFuture { get; set; }
        public bool StatutTeletransmission { get; set; }
        public string PremiereMutuelle { get; set; }
        public string DomiciliationIban { get; set; }
        public string TitulaireIban { get; set; }
        public string Bics { get; set; }
        public string Iban { get; set; }
        public bool StatutRib { get; set; }
    }
}
