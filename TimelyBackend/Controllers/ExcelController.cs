using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimelyBackend;
using TimelyBackend.Models;

namespace TimelyBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExcelController : ControllerBase
    {
        private readonly TimelyContext _context;

        public ExcelController(TimelyContext context)
        {
            _context = context;
        }  

        [HttpGet]
        public async Task<IActionResult> Excel()
        {
            var logs = await _context.Logs.ToListAsync();
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Logs");
                var currentRow = 1;
                worksheet.Cell(currentRow, 1).Value = "Id";
                worksheet.Cell(currentRow, 2).Value = "Project Name";
                worksheet.Cell(currentRow, 3).Value = "Start Time";
                worksheet.Cell(currentRow, 4).Value = "End Time";
                worksheet.Cell(currentRow, 5).Value = "Duration [min]";

                foreach (var log in logs)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = log.ID;
                    worksheet.Cell(currentRow, 2).Value = log.ProjectName;
                    worksheet.Cell(currentRow, 3).Value = log.StartDateTime;
                    worksheet.Cell(currentRow, 4).Value = log.EndDateTime;
                    worksheet.Cell(currentRow, 5).Value = CalculateDuration(log.StartDateTime, log.EndDateTime);
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(
                        content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "logs.xlsx");
                }
            }
        }
        private string CalculateDuration(DateTime startDateTime, DateTime endDateTime) {
            //string duration = "";
            TimeSpan ts = endDateTime - startDateTime;
            return $"{ts.Minutes}";
            //int differenceInDays = ts.Days; // This is in int
            ////double differenceInDays = ts.TotalDays; // This is in double

            //// Difference in Hours.
            //int differenceInHours = ts.Hours; // This is in int
            ////double differenceInHours = ts.TotalHours; // This is in double

            //// Difference in Minutes.
            //int differenceInMinutes = ts.Minutes; // This is in int
            ////double differenceInMinutes = ts.TotalMinutes; // This is in 
            //int differenceInSeconds = ts.Seconds;
            //if (differenceInDays > 0) { duration += $"{differenceInDays} d "; };
            //if (differenceInHours > 0) { duration += $"{differenceInHours} h "; };
            //if (differenceInMinutes > 0) { duration += $"{differenceInMinutes} m "; };
            //if (differenceInSeconds > 0) { duration += $"{differenceInSeconds} s"; };
            //return duration;
        }

    }     
}
