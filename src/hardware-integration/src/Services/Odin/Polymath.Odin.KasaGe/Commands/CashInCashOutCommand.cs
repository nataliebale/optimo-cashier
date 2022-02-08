using Polymath.Odin.KasaGE.Core;
using Polymath.Odin.KasaGE.Utils;
using System.Collections.Generic;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class CashInCashOutCommand : WrappedMessage
    {
        public CashInCashOutCommand(int type, decimal amount)
        {
            Command = 70;
            Data = ((IEnumerable<object>)new object[2]
            {
                 type,
                 amount
            }).StringJoin("\t");
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
