using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Polymath.Odin.KasaGE.Core
{
    public abstract class WrappedMessage : IWrappedMessage
    {
        private readonly Dictionary<char, char> _geoToRusDict = new Dictionary<char, char>()
        {
          {
            'ა',
            'а'
          },
          {
            'ბ',
            'б'
          },
          {
            'გ',
            'в'
          },
          {
            'დ',
            'г'
          },
          {
            'ე',
            'д'
          },
          {
            'ვ',
            'е'
          },
          {
            'ზ',
            'ж'
          },
          {
            'თ',
            'з'
          },
          {
            'ი',
            'и'
          },
          {
            'კ',
            'й'
          },
          {
            'ლ',
            'к'
          },
          {
            'მ',
            'л'
          },
          {
            'ნ',
            'м'
          },
          {
            'ო',
            'н'
          },
          {
            'პ',
            'о'
          },
          {
            'ჟ',
            'п'
          },
          {
            'რ',
            'р'
          },
          {
            'ს',
            'с'
          },
          {
            'ტ',
            'т'
          },
          {
            'უ',
            'у'
          },
          {
            'ფ',
            'ф'
          },
          {
            'ქ',
            'х'
          },
          {
            'ღ',
            'ц'
          },
          {
            'ყ',
            'ч'
          },
          {
            'შ',
            'ш'
          },
          {
            'ჩ',
            'щ'
          },
          {
            'ც',
            'ъ'
          },
          {
            'ძ',
            'ы'
          },
          {
            'წ',
            'ь'
          },
          {
            'ჭ',
            'э'
          },
          {
            'ხ',
            'ю'
          },
          {
            'ჯ',
            'я'
          },
          {
            'ჰ',
            'ё'
          }
        };

        public abstract int Command { get; set; }

        public abstract string Data { get; set; }

        public byte[] GetBytes(int sequence)
        {
            if (Data.Length > 213)
            {
                throw new InvalidDataException("Lenght of the packet exceeds the limits.");
            }

            var num1 = 0;
            var ansi = toAnsi(Data);
            var num2 = ansi.Length + 10;
            var numArray1 = new byte[num2 + 6];
            var numArray2 = numArray1;
            // ISSUE: variable of a boxed type
            ValueType local1 = (byte)1;
            var index1 = num1;
            var offset1 = index1 + 1;
            numArray2.SetValue(local1, index1);
            var num3 = quarterize(numArray1, offset1, num2 + 32);
            var numArray3 = numArray1;
            // ISSUE: variable of a boxed type
            ValueType local2 = (byte)sequence;
            var index2 = num3;
            var offset2 = index2 + 1;
            numArray3.SetValue(local2, index2);
            var offset3 = quarterize(numArray1, offset2, Command);
            var num4 = addData(numArray1, offset3, ansi);
            var numArray4 = numArray1;
            // ISSUE: variable of a boxed type
            ValueType local3 = (byte)5;
            var index3 = num4;
            var offset4 = index3 + 1;
            numArray4.SetValue(local3, index3);
            var index4 = quarterize(numArray1, offset4, getChecksum(numArray1));
            numArray1.SetValue((byte)3, index4);
            return numArray1;
        }

        private static int getChecksum(byte[] packet)
        {
            var num1 = 0;
            var num2 = Array.IndexOf<byte>(packet, 5);
            for (var index = 1; index <= num2; ++index)
            {
                num1 += (byte)packet.GetValue(index);
            }

            return num1;
        }

        private static int addData(byte[] buffer, int offset, string data)
        {
            foreach (var num in Encoding.GetEncoding(1251).GetBytes(data))
            {
                buffer.SetValue(num, offset++);
            }

            return offset;
        }

        private static int quarterize(byte[] buffer, int offset, int value)
        {
            var numArray = new int[4] { 12, 8, 4, 0 };
            foreach (var num in numArray)
            {
                buffer.SetValue((byte)((value >> num & 15) + 48), offset++);
            }

            return offset;
        }

        private string toAnsi(string source)
        {
            var str = string.Empty;
            foreach (var key in source)
            {
                str = !_geoToRusDict.ContainsKey(key) ? str + key.ToString() : str + _geoToRusDict[key].ToString();
            }

            return str;
        }
    }
}
