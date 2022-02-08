﻿using Polymath.Odin.KasaGE.Core;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class GetStatusOfCurrentReceiptCommand : WrappedMessage
    {
        public GetStatusOfCurrentReceiptCommand()
        {
            Command = 76;
            Data = string.Empty;
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
