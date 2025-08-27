using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Web.Models;
using Microsoft.AspNetCore.Authorization;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Web.Controllers
{

    [Authorize(Policy = "AdminOnly")]
    public class RecordsController : Controller
    {
        private readonly IRecordRepository _repository;

        public RecordsController(IRecordRepository repository)
        {
            _repository = repository;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetRecords(string fcno, string product, int? pageNumber)
        {
            var records = await _repository.GetAllAsync();

            if (!string.IsNullOrEmpty(fcno))
            {
                records = records.Where(r => r.FCNo.Contains(fcno, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            if (!string.IsNullOrEmpty(product))
            {
                records = records.Where(r => r.Product.Contains(product, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            var paginated = PaginatedList<Record>.CreateAsync(records, pageNumber ?? 1);
            if (!paginated.Any())
            {
                paginated = PaginatedList<Record>.CreateAsync(records, 1);
            }

            return Ok(new
            {
                Records = paginated,
                PageIndex = paginated.PageIndex,
                PageSize = paginated.PageSize,
                TotalPages = paginated.TotalPages,
                HasPreviousPage = paginated.HasPreviousPage,
                HasNextPage = paginated.HasNextPage
            });
        }

        public IActionResult RecordLogs(int id)
        {
            if(id < 0)
            {
                return BadRequest("Invalid record ID.");
            }
            return View(id);
        }

        [HttpGet]
        public async Task<IActionResult> GetRecordLogs(int recoredId, int? pageNumber, DateTime? fromDate = null, DateTime? toDate = null)
        {
            if(recoredId < 0)
            {
                return BadRequest("Invalid record ID.");
            }

            var recordLogs = await _repository.GetRecordLogs(recoredId);

            if (fromDate.HasValue)
                recordLogs = recordLogs.Where(x => x.Timestamp.Date >= fromDate.Value.Date);

            if (toDate.HasValue)
                recordLogs = recordLogs.Where(x => x.Timestamp.Date <= toDate.Value.Date);

            var paginated = PaginatedList<RecordLog>.CreateAsync(recordLogs, pageNumber ?? 1);
            if (!paginated.Any())
            {
                paginated = PaginatedList<RecordLog>.CreateAsync(recordLogs, 1);
            }

            return Ok(new
            {
                Records = paginated,
                PageIndex = paginated.PageIndex,
                PageSize = paginated.PageSize,
                TotalPages = paginated.TotalPages,
                HasPreviousPage = paginated.HasPreviousPage,
                HasNextPage = paginated.HasNextPage
            });
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View(new RecordViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(RecordViewModel e)
        {
            if (!ModelState.IsValid)
                return View(e);

            var record = new Record
            {
                FCNo = e.FCNo,
                OEM = e.OEM,
                Product = e.Product,
                Model = e.Model,
                EngineCode = e.EngineCode
            };

            await _repository.AddAsync(record);

            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var record = await _repository.GetByIdAsync(id);
            if (record == null)
                return NotFound();

            var model = new RecordViewModel
            {
                Id = record.Id,
                FCNo = record.FCNo,
                OEM = record.OEM,
                Product = record.Product,
                Model = record.Model,
                EngineCode = record.EngineCode
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(RecordViewModel e)
        {
            if (!ModelState.IsValid)
                return View(e);

            var record = await _repository.GetByIdAsync(e.Id);
            if (record == null)
                return NotFound();

            record.FCNo = e.FCNo;
            record.OEM = e.OEM;
            record.Product = e.Product;
            record.Model = e.Model;
            record.EngineCode = e.EngineCode;

            await _repository.UpdateAsync(record);

            return RedirectToAction(nameof(Index));
        }


        public async Task<IActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        public async Task<IActionResult> DecreaseQuantity(int id, int quantity)
        {
            await _repository.DecreaseQuantity(id, quantity);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> IncreaseQuantity(int id, int quantity, decimal unitPrice, string source)
        {
            await _repository.IncreaseQuantity(id, quantity, unitPrice, source);
            return Ok();
        }
    }
}
