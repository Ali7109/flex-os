export const getDate = (day: number, month: number, year: number): string => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    // Ensure valid input for day and month
    if (day < 1 || day > 31 || month < 0 || month > 12) {
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
 

// Parse textToSpeech for date and time on ls
export const readDate = (dateStr: string): string => {
  // Define an array for mapping month names
  const months: string[] = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  // Split the date string into day, month, and year
  const [dayStr, monthStr, yearStr] = dateStr.split('/');
  const day: number = parseInt(dayStr);
  const month: number = parseInt(monthStr);
  const year: number = parseInt(yearStr);

  // Ensure the month number is within range
  if (month < 1 || month > 12) {
      return "Invalid month";
  }

  // Ensure the day is within range for the given month
  const maxDaysInMonth: number = new Date(year, month, 0).getDate();
  if (day < 1 || day > maxDaysInMonth) {
      return "Invalid day for the given month and year";
  }

  // Generate the readable date format
  const monthName: string = months[month - 1];
  const dateInWords: string = `${day} of ${monthName} ${year}`;
  return dateInWords;
}

export function readTime(timeStr: string): string {
  // Define an array for mapping numbers to words
  const numbersInWords: string[] = [
      "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
      "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
      "seventeen", "eighteen", "nineteen"
  ];

  const tensInWords: string[] = [
      "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
  ];

  // Split the time string into hour and minute components
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour: number = parseInt(hourStr);
  const minute: number = parseInt(minuteStr);

  // Generate the readable time format
  let hourInWords: string;
  if (hour === 0) {
      hourInWords = "twelve";
  } else if (hour <= 12) {
      hourInWords = numbersInWords[hour];
  } else {
      hourInWords = numbersInWords[hour - 12];
  }

  let minuteInWords: string;
  if (minute < 20) {
      minuteInWords = numbersInWords[minute];
  } else {
      const tensDigit: number = Math.floor(minute / 10);
      const onesDigit: number = minute % 10;
      minuteInWords = `${tensInWords[tensDigit]} ${numbersInWords[onesDigit]}`;
  }

  const period: string = (hour < 12) ? "AM" : "PM";

  // Generate the readable time format
  const timeInWords: string = `${hourInWords} ${minuteInWords} ${period}`;
  return timeInWords;
}
