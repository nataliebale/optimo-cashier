namespace Optimo.DeviceService
{
    public class PipeResponse
    {
        public string ResponseType { get; set; } = "Callback";

        public string RequestId { get; set; }

        public object Data { get; set; }

        public object Error { get; set; }
    }
}
