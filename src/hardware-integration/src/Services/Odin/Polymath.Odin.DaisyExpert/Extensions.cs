using System;
using System.Collections.Generic;

namespace Polymath.Odin.DaisyExpert
{
    internal static class Extensions
    {
        public static void ForEach<T>(this IEnumerable<T> sequence, Action<int, T> action)
        {
            int i = 0;
            foreach (T item in sequence)
            {
                action(i, item);
                i++;
            }
        }
    }
}
