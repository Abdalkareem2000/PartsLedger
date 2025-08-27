using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Record
    {
        public int Id { get; set; }
        public string FCNo { get; set; }
        public string OEM { get; set; }
        public string Product { get; set; }
        public string Model { get; set; }
        public string EngineCode { get; set; }
        public decimal FOBPrice { get; set; }    
        public int Quantity { get; set; }
        public decimal TotalUSD { get; set; }
        public ICollection<RecordLog> RecordLogs { get; set; }

        public void CalculateUnitPrice(decimal totalPrice, int quantity)
        {
            Quantity = quantity;
            TotalUSD = totalPrice;
            if (Quantity > 0)
            {
                FOBPrice = Math.Round(TotalUSD / Quantity, 2);
            }
            else
            {
                FOBPrice = 0;
            }
        }
    }
}