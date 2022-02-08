namespace Optimo.DeviceService
{
    public class PipeRequest
    {
        public string RequestId { get; set; }

        public string Method { get; set; }

        public object Payload { get; set; }
    }
}
