using Core.Shared.Net.Enumerations.V1;
using System.ComponentModel.DataAnnotations;

namespace Core.Shared.Net.DTO.V1.Document
{
    public class DOC_Document_T
    {
        public Guid Id { get; set; }
        [MaxLength(100)]
        public string Libelle { get; set; }
        public EnuDocType? Type { get; set; }
        public EnuDocFormat? Format { get; set; }
        [MaxLength(100)]
        public string FileName { get; set; }
        [MaxLength(5)]
        public string FileExtension { get; set; }
        [MaxLength(250)]
        public string FilePath { get; set; }

    }
}
