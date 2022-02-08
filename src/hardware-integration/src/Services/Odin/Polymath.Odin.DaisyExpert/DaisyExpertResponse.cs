using Polymath.Odin.IntegrationShared;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Polymath.Odin.DaisyExpert
{
    public class DaisyExpertResponse : ICloneable
    {
        public bool Success { get; set; } = true;
        public string Data { get; set; } = "";
        public List<CashierResponseBytes> Errors { get; set; } = new List<CashierResponseBytes>();
        public List<CashierResponseBytes> Statuses { get; set; } = new List<CashierResponseBytes>();

        public object Clone()
        {
            return MemberwiseClone();
        }

        public void SetOldData(int code, int byteNum)
        {
            var indexes = Convert.ToString(code, 2).ToCharArray();
            Array.Reverse(indexes);
            var responses = new List<CashierResponseBytes>();
            byte i = 0;

            foreach (var index in indexes)
            {
                if (index == '1')
                {
                    responses.Add(CashierResponseBytes.Bytes[byteNum][i]);
                }

                ++i;
            }

            Errors.AddRange(responses.Where(x => x.IsError));
            Statuses.AddRange(responses.Where(x => !x.IsError));
            Success = Errors.Count == 0;
        }

        public void SetData(int code, int byteNum)
        {
            Statuses.Add(CashierResponseBytes.Bytes[byteNum][code]);
            Errors = Statuses.Where(x => x.IsError).ToList();
            Success = Errors.Count == 0;
        }
    }
}
