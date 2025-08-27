using System.ComponentModel.DataAnnotations;

namespace Web.Models
{
    public class OEMValidationAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var oem = value as string;

            if (string.IsNullOrWhiteSpace(oem))
                return new ValidationResult("OEM is required.");

            if (oem.Length < 11)
                return new ValidationResult("OEM must be at least 11 characters long.");

            if (oem[5] != '-')
                return new ValidationResult("The 6th character must be '-'.");

            return ValidationResult.Success;
        }
    }
}
