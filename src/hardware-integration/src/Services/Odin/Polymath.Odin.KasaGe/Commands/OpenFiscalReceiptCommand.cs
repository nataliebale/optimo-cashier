using Polymath.Odin.KasaGE.Core;
using Polymath.Odin.KasaGE.Utils;
using System.Collections.Generic;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class OpenFiscalReceiptCommand : WrappedMessage
    {
        public OpenFiscalReceiptCommand(string opCode, string opPwd)
        {
            Command = 48;
            Data = ((IEnumerable<object>)new object[4]
            {
                 opCode,
                 opPwd,
                 string.Empty,
                 0
            }).StringJoin("\t");
        }

        public OpenFiscalReceiptCommand(string opCode, string opPwd, int type)
        {
            Command = 48;
            Data = ((IEnumerable<object>)new object[4]
            {
         opCode,
         opPwd,
         string.Empty,
         type
            }).StringJoin("\t");
        }

        public OpenFiscalReceiptCommand(string opCode, string opPwd, int type, int tillNumber)
        {
            Command = 48;
            Data = ((IEnumerable<object>)new object[4]
            {
         opCode,
         opPwd,
         tillNumber,
         type
            }).StringJoin("\t");
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
