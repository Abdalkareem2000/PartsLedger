using Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IRecordRepository
    {

        Task<IEnumerable<Record>> GetAllAsync();
        Task<Record> GetByIdAsync(int id);
        Task AddAsync(Record record);
        Task UpdateAsync(Record record);
        Task DeleteAsync(int id);

        IQueryable<Record> GetAllAsQueryable();
        Task DecreaseQuantity(int id, int quentity);
        Task IncreaseQuantity(int id, int quantity, decimal unitPrice, string source);
    }
}
