using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class RecordRepository : IRecordRepository
    {

        private readonly ApplicationDbContext _context;

        public RecordRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Record>> GetAllAsync() =>
            await _context.Records.ToListAsync();

        public async Task<Record> GetByIdAsync(int id) =>
            await _context.Records.FindAsync(id);

        public async Task AddAsync(Record record)
        {
            record.TotalUSD = record.FOBPrice * record.Quantity;
            _context.Records.Add(record);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Record record)
        {
            record.TotalUSD = record.FOBPrice * record.Quantity;
            _context.Records.Update(record);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var record = await _context.Records.FindAsync(id);
            if (record != null)
            {
                _context.Records.Remove(record);
                await _context.SaveChangesAsync();
            }
        }

        public IQueryable<Record> GetAllAsQueryable()
        {
            return _context.Records.AsQueryable();
        }
    }
}

