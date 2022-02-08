using Polymath.Odin.KasaGE.Core;
using Polymath.Odin.KasaGE.Utils;
using System.Collections.Generic;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class RegisterProgrammedItemSaleCommand : WrappedMessage
    {
        public RegisterProgrammedItemSaleCommand(int pluCode, decimal qty)
        {
            Command = 58;
            Data = ((IEnumerable<object>)new object[5]
            {
                 pluCode,
                 qty,
                 string.Empty,
                 string.Empty,
                 string.Empty
            }).StringJoin("\t");
        }

        public RegisterProgrammedItemSaleCommand(
          int pluCode,
          decimal qty,
          decimal price,
          int discountType,
          decimal discountValue)
        {
            Command = 58;
            Data = ((IEnumerable<object>)new object[5]
            {
                 pluCode,
                 qty,
                 price,
                 discountType,
                 discountValue
            }).StringJoin("\t");
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
