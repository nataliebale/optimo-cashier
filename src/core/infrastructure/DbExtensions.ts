import { format } from 'date-fns';
import { LessThan, MoreThan } from 'typeorm';

export const MoreThanDate = (date: Date) => MoreThan(format(date, 'yyyy-MM-dd HH:mm:ss'));
export const LessThanDate = (date: Date) => LessThan(format(date, 'yyyy-MM-dd HH:mm:ss'));
