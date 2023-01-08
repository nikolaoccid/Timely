namespace TimelyBackend.Models
{
    public class PaginationDto
    {
        public ICollection<Log> Items { get; set; }
        public int CurrentPage { get; set; }
        int ItemsPerPage { get; set; }
        public int TotalLogCount { get; set; }
        public int TotalNumberOfPages { get; set;}
        
    }
}
