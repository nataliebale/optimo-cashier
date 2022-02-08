using Newtonsoft.Json;
using Polymath.Odin.HAL.NodeJS;
using Serilog;
using System;
using System.IO;
using System.IO.Pipes;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace Optimo.DeviceService
{
    class Program
    {
        private readonly Odin _odin;

        private Program()
        {
            Console.SetOut(TextWriter.Null); // suppress console; otherwise crashes while started throug nodejs
            _odin = new Odin();
        }


        public void RunPipeServer()
        {
            #if NETCOREAPP
            var server = new NamedPipeServerStream(
                RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
                    ? "OptimoDeviceService"
                    : "/tmp/OptimoDeviceService");
            #else
            var server = new NamedPipeServerStream("OptimoDeviceService");
            #endif

            server.WaitForConnection();
            var reader = new StreamReader(server);
            var writer = new StreamWriter(server);
            while (true)
            {
                if (!server.IsConnected)
                {
                    server.Disconnect();
                    server.WaitForConnection();
                }

                var payload = reader.ReadLine();
                if (payload == null) continue;
                Log.Information($"GotRequest: {payload}");
                Console.WriteLine($"GotRequest: {payload}");
                var request = JsonConvert.DeserializeObject<PipeRequest>(payload);

                PipeResponse result = null;
                try
                {
                    result = Task.Run(async () =>
                    {
                        var task = (Task<object>)(typeof(Odin).GetMethod(request.Method).Invoke(_odin, new[] { request.Payload }));
                        return new PipeResponse { RequestId = request.RequestId, Data = await task };
                    }).GetAwaiter().GetResult();
                }
                catch (Exception e)
                {
                    result = new PipeResponse
                    {
                        RequestId = request.RequestId,
                        Error = new
                        {
                            name = e.GetType().Name,
                            e.Message,
                            e.Data,
                            e.StackTrace,
                            e.Source,
                            e.InnerException
                        }
                    };
                }
                var response = JsonConvert.SerializeObject(result);
                writer.WriteLine(response);
                writer.Flush();

                Console.WriteLine($"SentResponse: {response}");
                Log.Information($"SentResponse: {response}");
            }
        }

        public static void Main(string[] args)
        {
            var server = new Program();
            while (true)
            {
                try
                {
                    server.RunPipeServer();
                }
                catch (Exception e)
                {
                    Log.Error(e, e.Message);
                }
            }
        }
    }
}
