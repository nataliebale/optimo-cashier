using IngenicoCLS;
using Polymath.Odin.Ingenico.Exceptions;
using Serilog;
using System;

namespace Polymath.Odin.Ingenico
{
    public class IngenicoAdapter : IDisposable
    {
        private readonly bool _autoReverse;
        private IngenicoPrinter _device;

        public IngenicoAdapter(Constants.PrintHandler printHandler = null, Constants.DebugHandler debugHandler = null, bool autoReverse = false, string docPath = null)
        {
            _device = new IngenicoPrinter(printHandler, debugHandler, docPath);
            _autoReverse = autoReverse;
        }
        /// <summary>
        /// Make credit card payment
        /// </summary>
        /// <param name="amount"></param>
        /// <exception cref="IngenicoNotConnectedException"></exception>
        /// <returns></returns>
        public Result MakePayment(decimal amount)
        {
            var _amount = Convert.ToInt64(amount * 100);
            var response = _device.MakePayment(_amount);

            if (response == null)
            {
                throw new IngenicoNotConnectedException();
            }

            Log.Debug($"ingenico:MakePaymentResponse:\t{Newtonsoft.Json.JsonConvert.SerializeObject(response)}");

            if (!response.isAuthorized() || response.ErrorText?.Contains("000") != true || response.AmountAuthorized != _amount)
            {
                return new Result
                {
                    Success = false,
                    Message = $"{response.OperationResult} {response.ErrorText}",
                    Transaction = response
                };
            }
            else
            {
                if (_autoReverse)
                {
                    ReverseTransaction(response);
                }

                return new Result
                {
                    Success = true,
                    Transaction = response
                };
            }
        }

        public void ReverseTransaction(Transaction transaction)
        {
            var document = new Document();
            document.GenerateNewUniqueDocumentNr();
            if (!_device.PerformVoid(document, transaction))
            {
                throw new UnableToReverseTransactionException(transaction.OperationID);
            }
        }

        public bool CloseDay()
        {
            return _device.CloseDay();
        }


        public void Dispose()
        {
            Dispose(true);
            // Suppress finalization.
            GC.SuppressFinalize(this);
        }

        bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            Log.Information("Disposing ingenico adapter");
            if (disposed)
                return;

            if (disposing)
            {
                //_device.DisposeAPI();
                Log.Information("Ingenico disposed");
            }

            disposed = true;
        }

        public void CheckDevice()
        {
            if (!_device.LockDevice(""))
            {
                throw new IngenicoNotConnectedException();
            }
        }
    }
}
