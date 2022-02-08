using Polymath.Odin.HAL.PrinterService;
using Polymath.Odin.HAL.Receipts.DataModels;
using Polymath.Odin.HAL.Settings;
using Polymath.Odin.IntegrationShared;
using System;
using System.Collections.Generic;
using System.Drawing;

namespace Polymath.Odin.HAL.Receipts.Templates
{
    public class DetailedOrderReceipt : IReceipt<DetailedOrderReceiptModel>
    {
        public IEnumerable<PrinterPageLine> PrepareReceipt(DetailedOrderReceiptModel receiptModel)
        {
            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Center,
                        String = receiptModel.Title,
                    }
                },
                Font = new Font("Arial", 11),
            };

            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Center,
                        String = ""
                    }
                }
            };

            if (Odin.ProductType == OdinProductType.HORECA)
            {
                yield return new PrinterPageLine
                {
                    Text = new[]
                    {
                        new PrinterPageLineText
                        {
                            Allignment = TextAlignment.Left,
                            String = "შეკვეთის გახსნის დრო:"
                        },
                        new PrinterPageLineText
                        {
                            Allignment = TextAlignment.Right,
                            String = receiptModel.CheckDate.ToLocalTime().ToString("dd/MM/yyyy HH:mm")
                        }
                    }
                };
            }

            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Left,
                        String = Odin.ProductType == OdinProductType.Retail ? "თარიღი:" : "ბეჭდვის დრო:"
                    },
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Right,
                        String = receiptModel.OrderDate.ToLocalTime().ToString("dd/MM/yyyy HH:mm")
                    }
                }
            };

            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Left,
                        String = Odin.ProductType == OdinProductType.Retail ? "მოლარე:" : "მიმტანი:"
                    },
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Right,
                        String = receiptModel.OperatorName
                    }
                }
            };

            if (Odin.ProductType == OdinProductType.HORECA)
            {
                if (!string.IsNullOrWhiteSpace(receiptModel.TableName) && !string.IsNullOrWhiteSpace(receiptModel.SpaceName))
                {
                    yield return new PrinterPageLine
                    {
                        Text = new[]
                        {
                            new PrinterPageLineText
                            {
                                Allignment = TextAlignment.Left,
                                String =  "მაგიდის ნომერი:"
                            },
                            new PrinterPageLineText
                            {
                                Allignment = TextAlignment.Right,
                                String = $"{receiptModel.TableName} ({receiptModel.SpaceName})"
                            }
                        }
                    };
                }

                if (receiptModel.GuestCount.HasValue)
                {
                    yield return new PrinterPageLine
                    {
                        Text = new[]
                        {
                            new PrinterPageLineText
                            {
                                Allignment = TextAlignment.Left,
                                String =  "სტუმრების რაოდენობა:"
                            },
                            new PrinterPageLineText
                            {
                                Allignment = TextAlignment.Right,
                                String = receiptModel.GuestCount.ToString()
                            }
                        }
                    };
                }
            }

            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Left,
                        String =  "ქვითარი:"
                    },
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Right,
                        String = receiptModel.ReceiptNumber.ToString()
                    }
                }
            };


            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Left,
                        String =  "ტერმინალი:"
                    },
                }
            };

            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Right,
                        String = receiptModel.DeviceId
                    }
                }
            };

            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Left,
                        String =  "ტრანზაქცია:"
                    },
                }
            };

            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Right,
                        String = receiptModel.OrderId.ToUpper()
                    }
                }
            };

            if (receiptModel.PaymentType == Sale.PaymentType.BOG)
            {
                yield return new PrinterPageLine
                {
                    Text = new[]
                    {
                        new PrinterPageLineText
                        {
                            Allignment = TextAlignment.Left,
                            String =  "RRN:"
                        },
                        new PrinterPageLineText
                        {
                            Allignment = TextAlignment.Right,
                            String = receiptModel.RRN
                        }
                    },
                };
            }

            yield return new PrinterPageLine
            {
                LineType = PrinterPageLineType.Line
            };

            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Left,
                        String = "რაოდ."
                    },
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Center,
                        String = "ფასი"
                    },
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Right,
                        String = "თანხა"
                    }
                }
            };

            yield return new PrinterPageLine
            {
                LineType = PrinterPageLineType.Line
            };

            foreach (var item in receiptModel.OrderItems)
            {
                yield return new PrinterPageLine
                {
                    Text = new[]
                    {
                        new PrinterPageLineText
                        {
                            Allignment = TextAlignment.Left,
                            String = item.Name
                        }
                    }
                };

                yield return new PrinterPageLine
                {
                    Text = new[]
                    {
                        new PrinterPageLineText
                        {
                            Allignment = TextAlignment.Left,
                            String = $"{item.Quantity}"
                        },

                        new PrinterPageLineText
                        {
                            Allignment = TextAlignment.Center,
                            String = item.UnitPrice.ToString("N2")
                        },


                        new PrinterPageLineText
                        {
                            Allignment = TextAlignment.Right,
                            String = $"= {item.Quantity * item.UnitPrice:N2}"
                        }
                    }
                };
            }

            yield return new PrinterPageLine
            {
                LineType = PrinterPageLineType.Line
            };

            //payment type 
            var paymentType = "";
            switch (receiptModel.PaymentType)
            {
                case Sale.PaymentType.BOG:
                case Sale.PaymentType.BOGExternal:
                    paymentType = "საქართველოს ბანკი";
                    break;
                case Sale.PaymentType.Cash:
                    paymentType = "ნაღდი";
                    break;
                default:
                    paymentType = "უნაღდო";
                    break;
            }

            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Left,
                        String = paymentType
                    },
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Right,
                        String = $"{receiptModel.BasketTotalPrice:N2}"
                    }
                },
                Font = new Font("Arial", 8, FontStyle.Bold)
            };

            yield return new PrinterPageLine
            {
                LineType = PrinterPageLineType.Line
            };

            if (receiptModel.TaxAmount != 0)
            {
                yield return new PrinterPageLine
                {
                    Text = new[]
                    {
                        new PrinterPageLineText
                        {
                            Allignment = TextAlignment.Left,
                            String = $"მომსახურების საკომისიო {receiptModel.TaxRate}%"
                        },
                        new PrinterPageLineText
                        {
                            Allignment = TextAlignment.Right,
                            String = $"{receiptModel.TaxAmount:N2}"
                        }
                    },
                    Font = new Font("Arial", 8, FontStyle.Bold)
                };

                yield return new PrinterPageLine
                {
                    LineType = PrinterPageLineType.Line
                };
            }

            yield return new PrinterPageLine
            {
                Text = new[]
                {
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Left,
                        String = "ჯამი"
                    },
                    new PrinterPageLineText
                    {
                        Allignment = TextAlignment.Right,
                        String = $"{receiptModel.TotalPrice:N2}"
                    }
                },
                Font = new Font("Arial", 8, FontStyle.Bold)
            };

            if (Odin.ProductType == OdinProductType.HORECA)
            {
                yield return new PrinterPageLine
                {
                    Text = new[]
                    {
                        new PrinterPageLineText
                        {
                            Allignment = TextAlignment.Center,
                            String = "მართე შენი რესტორანი - Optimo.ge"
                        }
                    },
                    Font = new Font("Arial", 8, FontStyle.Bold)
                };
            }
        }
    }
}
