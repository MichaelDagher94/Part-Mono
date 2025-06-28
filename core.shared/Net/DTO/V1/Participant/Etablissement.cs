namespace Core.Shared.Net.DTO.V1.Participant
{
    public class Etablissement
    {
        public string code_adherent { get; set; }
        public string code_etablissement { get; set; }
        public string Enseigne { get; set; }
        public string code_adherent_rattachement { get; set; }
        public string code_etablissement_rattachement { get; set; }
        public string ville { get; set; }
        public string code_postal { get; set; }
        public int code_adherentInt { get; set; }
        public string siret { get; set; }
    }
}
