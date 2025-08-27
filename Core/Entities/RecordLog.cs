using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class RecordLog
    {
        public int Id { get; set; }
        public int RecordId { get; set; }
        public Record Record { get; set; }
        public int Action { get; set; } // 0: Created, 1: Updated, 2: Deleted
        public DateTime Timestamp { get; set; }
        public int Quantity { get; set; }
        public int QuantityBefore { get; set; }
        public int QuantityAfter { get; set; }
        public string Source { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
