namespace Core.Shared.Net.DTO.V1.Participant
{
    public class DevisRootListe
    {

        private string date_EmissionField;

        private string libelleField;

        private string beneficiaireField;

        private string reference_EditiqueField;

        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(Form = System.Xml.Schema.XmlSchemaForm.Unqualified, Order = 0)]
        public string date_Emission
        {
            get
            {
                return this.date_EmissionField;
            }
            set
            {
                this.date_EmissionField = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(Form = System.Xml.Schema.XmlSchemaForm.Unqualified, Order = 1)]
        public string libelle
        {
            get
            {
                return this.libelleField;
            }
            set
            {
                this.libelleField = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(Form = System.Xml.Schema.XmlSchemaForm.Unqualified, Order = 2)]
        public string beneficiaire
        {
            get
            {
                return this.beneficiaireField;
            }
            set
            {
                this.beneficiaireField = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(Form = System.Xml.Schema.XmlSchemaForm.Unqualified, Order = 3)]
        public string reference_Editique
        {
            get
            {
                return this.reference_EditiqueField;
            }
            set
            {
                this.reference_EditiqueField = value;
            }
        }
    }
}
