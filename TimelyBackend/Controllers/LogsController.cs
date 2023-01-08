using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimelyBackend;
using TimelyBackend.Models;

namespace TimelyBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly TimelyContext _context;

        public LogsController(TimelyContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Log>>> GetLogs()
        {
          if (_context.Logs == null)
          {
              return NotFound();
          }
            return await _context.Logs.ToListAsync();  
        }

        [HttpGet("pagination")]
        public async Task<ActionResult<IEnumerable<PaginationDto>>> PaginationGetLogs([FromQuery] int page = 0)
        {
            page = page < 0 ? 0 : page;
            int defaultItemsPerPage = 5;
            var offset = defaultItemsPerPage * page;
            var logsQuery = from l in _context.Logs select l;
            var totalNumberOfItemsInLogs = await logsQuery.CountAsync(); 
            logsQuery = logsQuery.OrderBy(l => l.ID).Skip(offset).Take(defaultItemsPerPage);

            var logs = await logsQuery.ToListAsync();
            
            int numberOfPages = (int)Math.Ceiling((double)totalNumberOfItemsInLogs / defaultItemsPerPage);


            var res = new PaginationDto()
            {
                Items = logs,
                CurrentPage = page,
                TotalLogCount = totalNumberOfItemsInLogs,
                TotalNumberOfPages= numberOfPages
            };

            return Ok(res);

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Log>> GetLog(int id)
        {
          if (_context.Logs == null)
          {
              return NotFound();
          }
            var log = await _context.Logs.FindAsync(id);

            if (log == null)
            {
                return NotFound();
            }

            return log;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutLog(int id, Log log)
        {
            if (id != log.ID)
            {
                return BadRequest();
            }

            _context.Entry(log).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LogExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Log>> PostLog(Log log)
        {
          if (_context.Logs == null)
          {
              return Problem("Entity set 'TimelyContext.Logs'  is null.");
          }
            _context.Logs.Add(log);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLog", new { id = log.ID }, log);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLog(int id)
        {
            if (_context.Logs == null)
            {
                return NotFound();
            }
            var log = await _context.Logs.FindAsync(id);
            if (log == null)
            {
                return NotFound();
            }

            _context.Logs.Remove(log);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LogExists(int id)
        {
            return (_context.Logs?.Any(e => e.ID == id)).GetValueOrDefault();
        }
    }
}
