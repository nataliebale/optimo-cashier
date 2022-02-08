using IngenicoCLS;

namespace Polymath.Odin.Ingenico
{
    public class Result
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public Transaction Transaction { get; set; }
    }
}
