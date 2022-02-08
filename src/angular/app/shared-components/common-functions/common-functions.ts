export class ComFunctions {
  static generateErrorText(error: any) {
    console.log('Error in error:', error + ', ', error.err.message);
    switch (error.err.name) {
      case 'KasaNotConnectedException':
        return 'კასა არ არის დაკავშირებული';
      case 'BOGNotConfiguredException':
        return 'საქართველოს ბანკის ტერმინალი არ არის ინტეგრირებული';
      case 'DaisyExpertNotConnectedException':
        return 'დეიზი ექსპერტი არ არის დაკავშირებული';
      case 'IngenicoNotConnectedException':
        return 'საქართველოს ბანკის ტერმინალი არ არის დაკავშირებული';
      case 'UnableToReverseTransactionException':
        return 'ტრანზაქციის დარევერსება ვერ განხორციელდა';
      case 'DiasyNotInFiscalModeException':
        return 'გადაიყვანეთ დეიზი ექსპერტი კომპიუტერული კავშირის რეჟიმში';
      case 'SumsOverflowException':
        return 'დახურეთ დღე';
      case 'DayNotClosedException':
        return 'დახურეთ დღე';
      case 'CashierOutOfPaperException':
        return 'სალარო აპარატში გათავდა ქაღალდი';
      case 'IMEINotSetException':
        return 'გაყიდვაში არ გაქვთ მითითებული IMEI კოდი';
      default:
        return 'ზოგადი შეცდომა';
    }
  }
}
