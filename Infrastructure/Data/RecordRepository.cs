using Core.Entities;
using Core.Enums;
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

        public async Task DecreaseQuantity(int id, int quantity)
        {
            var record = await _context.Records.FirstOrDefaultAsync(r => r.Id == id);
            if (record == null)
            {
                return ;
            }

            if (record.Quantity < quantity)
            {
                return;
            }

            var recordLog = new RecordLog
            {
                RecordId = record.Id,
                Action = (int)RecordAction.Decreasing,
                Timestamp = DateTime.Now,
                Quantity = -quantity,
                QuantityBefore = record.Quantity,
                QuantityAfter = record.Quantity - quantity,
                Source = "System",
                UnitPrice = record.FOBPrice
            };

            record.CalculateUnitPrice(totalPrice: record.TotalUSD - record.FOBPrice * quantity,
                quantity: record.Quantity - quantity);

            await _context.RecordLogs.AddAsync(recordLog);

            await _context.SaveChangesAsync();
        }

        public async Task IncreaseQuantity(int id, int quantity, decimal unitPrice, string source)
        {
            if (quantity <= 0 || unitPrice <= 0 || string.IsNullOrEmpty(source))
            {
                return;
            }

            var record = await _context.Records.FirstOrDefaultAsync(r => r.Id == id);
            if (record == null)
            {
                return;
            }

            var recordLog = new RecordLog
            {
                RecordId = record.Id,
                Action = (int)RecordAction.Increasing,
                Timestamp = DateTime.Now,
                Quantity = quantity,
                QuantityBefore = record.Quantity,
                QuantityAfter = record.Quantity + quantity,
                Source = source,
                UnitPrice = unitPrice
            };

            record.CalculateUnitPrice(totalPrice: record.TotalUSD + unitPrice * quantity,
                quantity: record.Quantity + quantity);

            await _context.RecordLogs.AddAsync(recordLog);

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<RecordLog>> GetRecordLogs(int recordId)
        {
            return await _context.RecordLogs.Where(e => e.RecordId == recordId).ToListAsync();
        }
    }
}

