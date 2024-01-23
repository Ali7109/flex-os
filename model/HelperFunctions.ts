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
  