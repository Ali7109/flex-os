export const getDate = (day: number, month: number, year: number): string => {
    const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    // Ensure valid input for day and month
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return "Invalid date.";
    }
  
    // Determine the day suffix (st, nd, rd, or th)
    let suffix;
    if (day >= 11 && day <= 13) {
      suffix = "th";
    } else {
      switch (day % 10) {
        case 1:
          suffix = "st";
          break;
        case 2:
          suffix = "nd";
          break;
        case 3:
          suffix = "rd";
          break;
        default:
          suffix = "th";
      }
    }
  
    return `The date is ${day}${suffix} of ${months[month]}, ${year}.`;
  };
  

export const isNumeric = (str:string):boolean => {
  let pattern:RegExp  = /^[0-9]+$/;
  return pattern.test(str)
}
 
export const getCurrentDateAndTime = () => {

  const currentDate = new Date();

  // Get components of the date
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  const year = currentDate.getFullYear();

  // Get components of the time
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');

  // Construct the formatted string
  const formattedDateAndTime = `${hours}:${minutes} - ${day}/${month}/${year}`;

  return formattedDateAndTime;
}

// sort.ts
export function sortKeys(a: string, b: string): number {
  const isNumericA = !isNaN(Number(a));
  const isNumericB = !isNaN(Number(b));

  if (isNumericA && isNumericB) {
      // If both keys are numeric, compare them as numbers
      return Number(a) - Number(b);
  } else if (isNumericA) {
      // If only key 'a' is numeric, 'a' should come first
      return -1;
  } else if (isNumericB) {
      // If only key 'b' is numeric, 'b' should come first
      return 1;
  } else {
      // If neither key is numeric, compare them as strings
      return a.localeCompare(b);
  }
}
 