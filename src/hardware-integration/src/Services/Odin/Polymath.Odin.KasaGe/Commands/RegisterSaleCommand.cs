using Polymath.Odin.KasaGE.Core;
using Polymath.Odin.KasaGE.Utils;
using System.Collections.Generic;

namespace Polymath.Odin.KasaGE.Commands
{
    internal class RegisterSaleCommand : WrappedMessage
    {
        public RegisterSaleCommand(
          string pluName,
          int taxCode,
          decimal price,
          int departmentNumber,
          decimal qty)
        {
            Command = 49;
            Data = ((IEnumerable<object>)new object[7]
            {
                 pluName,
                 taxCode,
                 price,
                 qty,
                 0,
                 string.Empty,
                 departmentNumber
            }).StringJoin("\t");
        }

        public RegisterSaleCommand(
          string pluName,
          int taxCode,
          decimal price,
          int departmentNumber,
          decimal qty,
          int discountType,
          decimal discountValue)
        {
            Command = 49;
            Data = ((IEnumerable<object>)new object[7]
            {
         pluName,
         taxCode,
         price,
         qty,
         discountType,
         discountValue,
         departmentNumber
            }).StringJoin("\t");
        }

        public override int Command { get; set; }

        public override string Data { get; set; }
    }
}
