using Polymath.Odin.KasaGE.Core;
using Polymath.Odin.KasaGE.Utils;
using System.Collections.Generic;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class CalculateTotalCommand : WrappedMessage
    {
        public CalculateTotalCommand(int paymentMode, decimal cashMoney)
        {
            var str = cashMoney == decimal.Zero ? string.Empty : cashMoney.ToString();
            Command = 53;
            Data = ((IEnumerable<object>)new object[2]
            {
                 paymentMode,
                 str
            }).StringJoin("\t");
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
