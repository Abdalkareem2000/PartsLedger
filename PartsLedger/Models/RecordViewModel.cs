using System.ComponentModel.DataAnnotations;

namespace Web.Models
{
    public class RecordViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "FC No is required")]
        public string FCNo { get; set; }

        [Required]
        [OEMValidation]
        public string OEM { get; set; }

        [Required(ErrorMessage = "Product is required")]
        public string Product { get; set; }

        [Required(ErrorMessage = "Model is required")]
        public string Model { get; set; }

        [Required(ErrorMessage = "Engine code is required")]
        public string EngineCode { get; set; }
    }
}
