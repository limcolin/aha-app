import { format } from 'date-fns';

export function last7Days() {
  const dates = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return format(d, 'd/M/y');
  });

  return dates;
}

export function dedupeArray(array: string[]) {
  const uniqueSet = new Set(array);
  const backToArray = [...uniqueSet];
  return backToArray;
}

export function errorHandler(error: unknown) {
  if (error instanceof Error) {
    console.error(error);
    alert(error.message);
  } else {
    console.log(error);
  }
}
