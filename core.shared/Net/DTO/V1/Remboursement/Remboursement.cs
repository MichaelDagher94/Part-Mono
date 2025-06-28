namespace Core.Shared.Net.DTO.V1.Remboursement
{
    public class Remboursement
    {
        public string NumeroParticipant { get; set; }
        public DateTime DateRemboursementComplete { get; set; }
        public DateTime? DateSoinComplete { get; set; }
        public string DateDeRemboursement { get; set; }
        public string TruncatDateDeRemboursement { get; set; }
        public string Libelle { get; set; }
        public string MontantVerseIpeca { get; set; }
        public double Depense { get; set; }
        public string Ordre { get; set; }
        public string CodesActes { get; set; }
        public string BeneficiairePrenom { get; set; }
        public string BeneficiaireNom { get; set; }
        public string BeneficiaireCivilite { get; set; }
        public string BeneficiaireDateNaissance { get; set; }
        public double AutreOrganisme { get; set; }
        public double SecuriteSociale { get; set; }
        public double Rac { get; set; }
        public string NumeroBordereau { get; set; }
        public string CodeBordereau { get; set; }
        public IList<RemboursementSanteDetails> RemboursementsSanteDetail { get; set; }
        public Remboursement() { }

        public Remboursement(RemboursementSante remboursementSante)
        {
            this.NumeroParticipant = remboursementSante.NumeroParticipant;
            this.Libelle = remboursementSante.Libelle;
            this.DateRemboursementComplete = remboursementSante.DateRemboursementComplete;
            this.DateSoinComplete = remboursementSante.DateSoinComplete;
            this.Depense = double.Parse(remboursementSante.Depense);
            this.CodesActes = remboursementSante.CodesActes;
            this.SecuriteSociale = double.Parse(remboursementSante.SecuriteSociale);
            this.MontantVerseIpeca = remboursementSante.MontantVerseIpeca;
            this.BeneficiaireDateNaissance = remboursementSante.BeneficiaireDateNaissance;
            this.BeneficiaireNom = remboursementSante.BeneficiaireNom;
            this.BeneficiairePrenom = remboursementSante.BeneficiairePrenom;
            this.Rac = double.Parse(remboursementSante.Rac);
            this.TruncatDateDeRemboursement = remboursementSante.TruncatDateDeRemboursement;
            this.DateDeRemboursement = remboursementSante.DateDeRemboursement;
            this.Ordre = remboursementSante.Ordre;
            this.AutreOrganisme = double.Parse(remboursementSante.AutreOrganisme);
            this.NumeroBordereau = remboursementSante.NumeroBordereau;
            this.CodeBordereau = remboursementSante.CodeBordereau;
        }
    }
}
