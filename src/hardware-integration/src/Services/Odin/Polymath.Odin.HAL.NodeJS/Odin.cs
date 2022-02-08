using Newtonsoft.Json;
using Polymath.Odin.HAL.Sale;
using Polymath.Odin.HAL.Settings;
using Serilog;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Polymath.Odin.HAL.NodeJS
{
    public class Odin
    {
        private static HAL.Odin _odin;

        public Odin()
        {
            Log.Logger = new LoggerConfiguration()
                .WriteTo.File(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Optimo", "logs", "log-dll-.txt"), rollingInterval: RollingInterval.Day)
                .MinimumLevel.Debug()
                .CreateLogger();
        }

        public async Task<object> InitDll(object input = null)
        {
            if (input == null)
            {
                Log.Error("პროგრამის გასაშვებად საჭირო კონფიგურაცია ვერ მოიძებნა");
                throw new Exception("No data");
            }

            var model = input.ForceType<OdingSettings>();
            Log.Debug($"ახალ ნაკადში გაშვება(პროგრამის გაშვება): {JsonConvert.SerializeObject(model)}");
            await Task.Run(() =>
            {
                Log.Information($"პროგრამის გაშვება");
                _odin = HAL.Odin.GetInstance(model);
                Log.Information("პროგრამა გაეშვა წარმატებით");
            });

            Log.Debug("ნაკადი შესრულდა(პროგრამის გაშვება)");
            return default;
        }

        public async Task<object> Inited(object input = null)
            => _odin != null;

        public async Task<object> GetCashierPort(object input)
        {
            Log.Debug("ახალ ნაკადში გაშვება(ფისკალური აპარატის პორტი)");
            var result = await Task.Run(() =>
            {
                return HAL.Odin.GetCashierPort();
            });

            Log.Debug("ნაკადი შესრულდა(ფისკალური აპარატის პორტი)");
            return result;
        }

        public async Task<object> Test(object input)
        {
            await Task.Run(() => _odin.Test());
            return null;
        }

        public async Task<object> PreOrder(object input)
        {
            var model = input.ForceType<Order>();

            Log.Debug($"ახალ ნაკადში გაშვება(პრეჩეკი): {JsonConvert.SerializeObject(model)}");
            var result = await Task.Run(() =>
            {
                Log.Information("პრეჩეკი ოპერაციის დაწყება");
                var lord = _odin.PreOrder(model);
                Log.Information("პრეჩეკი ოპერაცია შესრულებულია");
                return lord;
            });

            Log.Debug("ნაკადი შესრულდა(გადახდა)");
            return result;
        }

        public async Task<object> Order(object input)
        {
            var model = input.ForceType<Order>();

            Log.Debug($"ახალ ნაკადში გაშვება(გადახდა): {JsonConvert.SerializeObject(model)}");
            var result = await Task.Run(() =>
            {
                Log.Information("გადახდის ოპერაციის დაწყება");
                var lord = _odin.Order(model);
                Log.Information("გადახდის ოპერაცია შესრულებულია");
                return lord;
            });

            Log.Debug("ნაკადი შესრულდა(გადახდა)");
            return result;
        }

        public async Task<object> ReverseCardTransaction(object input)
        {
            var model = input.ForceType<CardReversal>();

            Log.Debug($"ახალ ნაკადში გაშვება(დაბრუნება): {JsonConvert.SerializeObject(model)}");
            var result = await Task.Run(() =>
            {
                Log.Information("დაბრუნების ოპერაციის დაწყება");
                var lord = _odin.ReverseCardTransaction(model);
                Log.Information("დაბრუნების ოპერაცია შესრულებულია");
                return lord;
            });

            Log.Debug("ნაკადი შესრულდა(გადახდა)");
            return result;
        }

        public async Task<object> CloseDay(object input)
        {
            Log.Debug("ახალ ნაკადში გაშვება(დღის დახურვა)");
            await Task.Run(() =>
            {
                Log.Information("დღის დახურვის ოპერაციის დაწყება");
                _odin.CloseDay();
                Log.Information("დღის დახურვის ოპერაცია შესრულებულია");
            });

            Log.Debug("ნაკადი შესრულდა(დღის დახურვა)");
            return true;
        }

        public async Task<object> ShutDown(object input)
        {
            Log.Debug("ახალ ნაკადში გაშვება(გათიშვა)");
            await Task.Run(() =>
            {
                Log.Information("გათიშვის ოპერაციის დაწყება");
                _odin.ShutDown();
                Log.Information("გათიშვის ოპერაცია შესრულებულია");
            });

            Log.Debug("ნაკადი შესრულდა(გათიშვა)");
            return true;
        }

        public async Task<object> Reboot(object input)
        {
            Log.Debug("ახალ ნაკადში გაშვება(გადატვირთვა)");
            await Task.Run(() =>
            {
                Log.Information("გადატვირთვის ოპერაციის დაწყება");
                _odin.Reboot();
                Log.Information("გადატვირთვის ოპერაცია შესრულებულია");
            });

            Log.Debug("ნაკადი შესრულდა(გადატვირთვა)");
            return true;
        }
    }
}
