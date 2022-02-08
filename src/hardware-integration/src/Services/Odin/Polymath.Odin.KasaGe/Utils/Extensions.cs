// Decompiled with JetBrains decompiler
// Type: KasaGE.Utils.Extensions
// Assembly: KasaGE, Version=2.0.0.0, Culture=neutral, PublicKeyToken=7d642abad2b4ab52
// MVID: D21396DC-E3C8-4FEB-B02C-9ECF0A8BAE53
// Assembly location: D:\Repos\Odin\cashier-desktop-app\OdinBinaries\KasaGE.dll

using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Polymath.Odin.KasaGE.Utils
{
    internal static class Extensions
    {
        private static readonly NumberFormatInfo Nfi = new NumberFormatInfo()
        {
            NumberDecimalSeparator = "."
        };

        internal static string StringJoin(this IEnumerable<object> enumerable, string separator)
        {
            return string.Join("", enumerable.Select<object, string>(x => (!(x.GetType() == typeof(decimal)) ? x.ToString() : ((decimal)x).ToString(Nfi)) + separator).ToArray<string>());
        }

        public static string GetString(this byte[] buffer)
        {
            return Encoding.GetEncoding(1251).GetString(buffer);
        }
    }
}
