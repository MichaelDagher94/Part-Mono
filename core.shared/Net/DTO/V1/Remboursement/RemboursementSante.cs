namespace Core.Shared.Net.DTO.V1.Remboursement
{
    public class RemboursementSante
    {
        public string NumeroParticipant { get; set; }
        public DateTime DateRemboursementComplete { get; set; }
        public DateTime? DateSoinComplete { get; set; }
        public string DateDeRemboursement { get; set; }
        public string TruncatDateDeRemboursement { get; set; }
        public string Libelle { get; set; }
        public string MontantVerseIpeca { get; set; }
        public string Depense { get; set; }
        public string Ordre { get; set; }
        public string CodesActes { get; set; }
        public string BeneficiairePrenom { get; set; }
        public string BeneficiaireDateNaissance { get; set; }
        public string AutreOrganisme { get; set; }
        public string SecuriteSociale { get; set; }
        public string Rac { get; set; }
        public string ArchivePdf { get; set; }
        public string NumeroBordereau { get; set; }
        public string libellePaiement { get; set; }
        public string ReferenceReleve { get; set; }
        public string CodeBordereau { get; set; }
        public int NumeroLot { get; set; }
        public int Participant { get; set; }
        public string FamilleActe { get; set; }
        public string BeneficiaireNom { get; set; }
        public int BeneficiaireId { get; set; }
        public IList<RemboursementSanteDetails> RemboursementsSanteDetail { get; set; }
    }
}
