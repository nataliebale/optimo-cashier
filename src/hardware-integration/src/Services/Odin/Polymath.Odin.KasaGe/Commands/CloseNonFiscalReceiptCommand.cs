﻿using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class CloseNonFiscalReceiptCommand : WrappedMessage
    {
        public CloseNonFiscalReceiptCommand()
        {
            Command = 39;
            Data = string.Empty;
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
