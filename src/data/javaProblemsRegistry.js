// Java Programming Practice Problem Registry for Lugaish
// Stores practice topics, problem metadata, and server-side private test cases.

export const JAVA_PRACTICE_TOPICS = [
  {
    id: 'topic-01',
    slug: 'basic-io-variables',
    title: 'Basic Input, Output & Variables',
    language: 'Java',
    level: 'Beginner',
    description:
      'Begin your Java programming journey by practicing printing output, working with variables, and taking user input. Strengthen your fundamentals through practical coding challenges.',
    icon: 'Terminal',
    active: true
  }
];

export const DEFAULT_JAVA_STARTER = `public class Main {
    public static void main(String[] args) {

    }
}
`;

/**
 * In-memory / file registry of practice problems for Topic 1: Basic Input, Output & Variables.
 * As new problems are provided, add them directly to this array.
 *
 * Each problem structure:
 * {
 *   id: string,               // Unique ID, e.g. "java-bio-01"
 *   number: string,           // Problem number, e.g. "01"
 *   title: string,            // Problem title
 *   slug: string,             // URL slug
 *   language: "Java",
 *   categorySlug: "basic-io-variables",
 *   difficulty: "Easy" | "Medium" | "Hard",
 *   problemType: "lugaish" | "external",
 *   sourcePlatform: "Lugaish" | "Codeforces" | "CodeChef" | "beecrowd" | "HackerRank" | ...,
 *   externalUrl?: string,     // Mandatory for external problems
 *   description?: string,     // Problem statement for Lugaish problems
 *   inputFormat?: string,     // Input format description
 *   outputFormat?: string,    // Output format description
 *   constraints?: string,     // Constraints description
 *   sampleTestCases?: [       // Public sample test cases
 *     { input: string, expectedOutput: string, explanation?: string }
 *   ],
 *   hiddenTestCases?: [       // PRIVATE: Strictly kept server-side
 *     { input: string, expectedOutput: string }
 *   ],
 *   starterCode?: string,     // Default starter code
 *   timeLimit?: number,       // in seconds (default 3)
 *   memoryLimit?: number      // in KB (default 128000)
 * }
 */
export const javaProblemsByTopic = {
  'basic-io-variables': [
    {
      id: 'java-bio-01',
      number: '01',
      title: 'Hello World!',
      slug: 'hello-world',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `Write a Java program that prints the following message on the screen:

Hello, world!

This is your first Java programming problem. The goal is to become familiar with writing, compiling, and running a simple Java program.`,
      inputFormat: 'There is no input for this problem.',
      outputFormat: 'Print exactly Hello, world! on a single line.',
      constraints: 'None. Output must match exactly on a single line.',
      sampleTestCases: [
        {
          input: '',
          expectedOutput: 'Hello, world!',
          explanation: 'The program prints "Hello, world!" to standard output.'
        }
      ],
      hiddenTestCases: [
        {
          input: '',
          expectedOutput: 'Hello, world!'
        }
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• The output is case-sensitive.\n• Do not print any extra words or characters.\n• Use Java to solve this problem.'
    },
    {
      id: 'java-bio-02',
      number: '02',
      title: 'Robot Startup Messages',
      slug: 'robot-startup-messages',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A small robot is getting ready for its first mission. Before starting, it must display three startup messages.

Write a Java program to display the following messages, each on a separate line.`,
      inputFormat: 'There is no input for this problem.',
      outputFormat: `Print exactly the following, each on a separate line:
Robot is waking up...
Battery is fully charged.
Ready for the mission!`,
      constraints: 'None. Each message must appear on a new line.',
      sampleTestCases: [
        {
          input: '',
          expectedOutput: 'Robot is waking up...\nBattery is fully charged.\nReady for the mission!',
          explanation: 'Prints the 3 startup messages sequentially, each on its own line.'
        }
      ],
      hiddenTestCases: [
        {
          input: '',
          expectedOutput: 'Robot is waking up...\nBattery is fully charged.\nReady for the mission!'
        }
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• Each message must appear on a new line.\n• Spelling, spaces, and punctuation (including periods and exclamation mark) must match exactly.'
    },
    {
      id: 'java-bio-03',
      number: '03',
      title: 'Digital Nameplate',
      slug: 'digital-nameplate',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A tech club wants to display a digital nameplate on its welcome screen.

Write a Java program that displays the club name, department, and membership status together on a single line.`,
      inputFormat: 'There is no input for this problem.',
      outputFormat: 'Print exactly: Code Club | Department: CS | Status: Open',
      constraints: 'None. Make sure the entire message appears on one line with the correct spacing and symbols.',
      sampleTestCases: [
        {
          input: '',
          expectedOutput: 'Code Club | Department: CS | Status: Open',
          explanation: 'Prints the club details separated by pipe characters (|) on a single line.'
        }
      ],
      hiddenTestCases: [
        {
          input: '',
          expectedOutput: 'Code Club | Department: CS | Status: Open'
        }
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• Make sure the entire message appears on one line.\n• Use exact spacing and pipe symbols (|).'
    },
    {
      id: 'java-bio-04',
      number: '04',
      title: 'Snack Shop Total Bill',
      slug: 'snack-shop-total-bill',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `You visit a snack shop and buy two items. The shopkeeper wants a simple program to calculate your total bill.

Write a Java program that takes the prices of two items and displays their total cost.`,
      inputFormat: 'A single line containing two integers, A and B, representing the item prices.',
      outputFormat: 'Print the total cost in the following format: Total Bill: X SAR',
      constraints: '0 ≤ A, B ≤ 1000',
      sampleTestCases: [
        {
          input: '15 25',
          expectedOutput: 'Total Bill: 40 SAR',
          explanation: 'Sum of 15 and 25 is 40. Prints "Total Bill: 40 SAR".'
        }
      ],
      hiddenTestCases: [
        {
          input: '15 25',
          expectedOutput: 'Total Bill: 40 SAR'
        },
        {
          input: '0 0',
          expectedOutput: 'Total Bill: 0 SAR'
        },
        {
          input: '1000 1000',
          expectedOutput: 'Total Bill: 2000 SAR'
        },
        {
          input: '120 350',
          expectedOutput: 'Total Bill: 470 SAR'
        },
        {
          input: '5 995',
          expectedOutput: 'Total Bill: 1000 SAR'
        }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• Use Scanner to read the two integers from standard input.\n• Make sure the output format exactly matches "Total Bill: X SAR" including spaces and capitalization.'
    },
    {
      id: 'java-bio-05',
      number: '05',
      title: 'Championship Final Score',
      slug: 'championship-final-score',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A gaming team plays three rounds in a championship. Each round gives the team some points.

Your task is to calculate the team's total score after all three rounds.`,
      inputFormat: 'Three space-separated integers representing the points earned in the three rounds.',
      outputFormat: 'Print the final score in the following format: Final Score = X',
      constraints: "0 ≤ Each round's score ≤ 1000",
      sampleTestCases: [
        {
          input: '120 85 95',
          expectedOutput: 'Final Score = 300',
          explanation: 'Sum of 120 + 85 + 95 = 300. Prints "Final Score = 300".'
        }
      ],
      hiddenTestCases: [
        {
          input: '120 85 95',
          expectedOutput: 'Final Score = 300'
        },
        {
          input: '0 0 0',
          expectedOutput: 'Final Score = 0'
        },
        {
          input: '1000 1000 1000',
          expectedOutput: 'Final Score = 3000'
        },
        {
          input: '250 500 250',
          expectedOutput: 'Final Score = 1000'
        },
        {
          input: '1 2 3',
          expectedOutput: 'Final Score = 6'
        }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• Read three space-separated integers using Scanner.\n• Make sure the output format is exactly "Final Score = X" with spaces around the equals sign.'
    },
    {
      id: 'java-bio-06',
      number: '06',
      title: 'Years Until Event',
      slug: 'years-until-event',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A student is planning a special event in the future and wants to know how many years remain.

Write a Java program that takes the current year and the event year, then calculates the number of years remaining.`,
      inputFormat: 'Two integers: currentYear and eventYear.',
      outputFormat: 'Print the number of years remaining in the following format: X years remaining',
      constraints: '2000 ≤ currentYear ≤ eventYear ≤ 3000',
      sampleTestCases: [
        {
          input: '2026 2030',
          expectedOutput: '4 years remaining',
          explanation: '2030 - 2026 = 4. Output: "4 years remaining".'
        }
      ],
      hiddenTestCases: [
        {
          input: '2026 2030',
          expectedOutput: '4 years remaining'
        },
        {
          input: '2024 2024',
          expectedOutput: '0 years remaining'
        },
        {
          input: '2000 3000',
          expectedOutput: '1000 years remaining'
        },
        {
          input: '2025 2050',
          expectedOutput: '25 years remaining'
        },
        {
          input: '2026 2027',
          expectedOutput: '1 years remaining'
        }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• Calculate remaining years as: eventYear - currentYear.\n• Print in the exact format: "X years remaining".'
    },
    {
      id: 'java-bio-07',
      number: '07',
      title: 'Welcome Bot Greeting',
      slug: 'welcome-bot-greeting',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `Lugaish is building a simple welcome bot for new learners.

The bot takes a student's name and displays a personalized welcome message.

Write a Java program that reads a student's first name and prints a greeting.`,
      inputFormat: 'A single word containing the student\'s name.',
      outputFormat: 'Print the welcome message in the following format: Welcome, NAME! Happy Coding!',
      constraints: 'The name consists of a single word with English letters (1 ≤ length ≤ 50).',
      sampleTestCases: [
        {
          input: 'Amina',
          expectedOutput: 'Welcome, Amina! Happy Coding!',
          explanation: 'Takes "Amina" as input and prints "Welcome, Amina! Happy Coding!".'
        }
      ],
      hiddenTestCases: [
        {
          input: 'Amina',
          expectedOutput: 'Welcome, Amina! Happy Coding!'
        },
        {
          input: 'Tanvir',
          expectedOutput: 'Welcome, Tanvir! Happy Coding!'
        },
        {
          input: 'Rahim',
          expectedOutput: 'Welcome, Rahim! Happy Coding!'
        },
        {
          input: 'Sara',
          expectedOutput: 'Welcome, Sara! Happy Coding!'
        },
        {
          input: 'Alexander',
          expectedOutput: 'Welcome, Alexander! Happy Coding!'
        }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• Read the student\'s name using scanner.next().\n• Exact output format: "Welcome, NAME! Happy Coding!" (note the comma, spaces, and exclamation marks).'
    },
    {
      id: 'java-bio-08',
      number: '08',
      title: 'Fix the Café Bill Bug',
      slug: 'fix-the-cafe-bill-bug',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A small café has developed a Java program to calculate the price of two drinks. Unfortunately, the program contains a syntax error and cannot be compiled.

Your task is to identify the mistake, fix the code, and display the total bill correctly.`,
      inputFormat: 'Two space-separated integers representing the prices of coffee and juice.',
      outputFormat: 'Print Bill: X, where X is the total price.',
      constraints: '0 ≤ coffee, juice ≤ 1000',
      sampleTestCases: [
        {
          input: '12 18',
          expectedOutput: 'Bill: 30',
          explanation: 'Sum of 12 + 18 is 30. Prints "Bill: 30".'
        }
      ],
      hiddenTestCases: [
        {
          input: '12 18',
          expectedOutput: 'Bill: 30'
        },
        {
          input: '0 0',
          expectedOutput: 'Bill: 0'
        },
        {
          input: '1000 1000',
          expectedOutput: 'Bill: 2000'
        },
        {
          input: '45 55',
          expectedOutput: 'Bill: 100'
        },
        {
          input: '20 5',
          expectedOutput: 'Bill: 25'
        }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int coffee = sc.nextInt();
        int juice = sc.nextInt();
        int total = coffee + juice
        System.out.println("Bill: " + total);
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• The provided starter code is missing a semicolon (;) on the line defining total.\n• Fix the syntax error so the code compiles and produces the correct output.'
    },
    {
      id: 'java-bio-09',
      number: '09',
      title: 'Fix the Weather Station Bug',
      slug: 'fix-the-weather-station-bug',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A weather station records the temperature every morning.

The station's Java program reads the temperature correctly, but an incorrect capitalization prevents it from compiling.

Find the error and repair the program.`,
      inputFormat: 'A single integer representing the temperature in Celsius.',
      outputFormat: 'Display the temperature in the following format: Temperature: X C',
      constraints: '-50 ≤ temperature ≤ 60',
      sampleTestCases: [
        {
          input: '27',
          expectedOutput: 'Temperature: 27 C',
          explanation: 'Reads 27 and prints "Temperature: 27 C".'
        }
      ],
      hiddenTestCases: [
        {
          input: '27',
          expectedOutput: 'Temperature: 27 C'
        },
        {
          input: '0',
          expectedOutput: 'Temperature: 0 C'
        },
        {
          input: '-15',
          expectedOutput: 'Temperature: -15 C'
        },
        {
          input: '60',
          expectedOutput: 'Temperature: 60 C'
        },
        {
          input: '-50',
          expectedOutput: 'Temperature: -50 C'
        }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int temperature = sc.nextInt();

        system.out.println("Temperature: " + temperature + " C");
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• Remember that Java is case-sensitive: system.out.println must use capital S for System.\n• Output format must match: "Temperature: X C".'
    },
    {
      id: 'java-bio-10',
      number: '10',
      title: 'Fix the Parcel Tracker Entry Point',
      slug: 'fix-the-parcel-tracker-entry-point',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A delivery company has created a simple Java program to display a parcel's tracking number.

The code compiles successfully, but Java cannot start the program because the expected entry point is missing.

Your task is to fix the method declaration so the program runs correctly.`,
      inputFormat: 'A single positive integer representing the parcel tracking number.',
      outputFormat: 'Print the tracking number in the following format: Parcel ID: X',
      constraints: '1 ≤ trackingNumber ≤ 999999',
      sampleTestCases: [
        {
          input: '58241',
          expectedOutput: 'Parcel ID: 58241',
          explanation: 'Reads 58241 and prints "Parcel ID: 58241".'
        }
      ],
      hiddenTestCases: [
        {
          input: '58241',
          expectedOutput: 'Parcel ID: 58241'
        },
        {
          input: '1',
          expectedOutput: 'Parcel ID: 1'
        },
        {
          input: '999999',
          expectedOutput: 'Parcel ID: 999999'
        },
        {
          input: '100200',
          expectedOutput: 'Parcel ID: 100200'
        },
        {
          input: '777',
          expectedOutput: 'Parcel ID: 777'
        }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void mian(String[] args) {
        Scanner sc = new Scanner(System.in);
        int trackingNumber = sc.nextInt();

        System.out.println("Parcel ID: " + trackingNumber);
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• The method is incorrectly named "mian" instead of "main".\n• Java requires the exact entry point signature: public static void main(String[] args).'
    },
    {
      id: 'java-bio-11',
      number: '11',
      title: 'Fix the Library Books Parenthesis',
      slug: 'fix-the-library-books-parenthesis',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A school library wants to calculate how many books remain after students borrow some of them.

The programmer has written the calculation, but the program contains a missing parenthesis.

Fix the error and display the remaining number of books.`,
      inputFormat: 'Two integers representing the total number of books and the number borrowed.',
      outputFormat: 'Print the number of remaining books in the following format: Remaining: X',
      constraints: '0 ≤ borrowedBooks ≤ totalBooks ≤ 10000',
      sampleTestCases: [
        {
          input: '150 45',
          expectedOutput: 'Remaining: 105',
          explanation: '150 - 45 = 105. Prints "Remaining: 105".'
        }
      ],
      hiddenTestCases: [
        {
          input: '150 45',
          expectedOutput: 'Remaining: 105'
        },
        {
          input: '0 0',
          expectedOutput: 'Remaining: 0'
        },
        {
          input: '10000 0',
          expectedOutput: 'Remaining: 10000'
        },
        {
          input: '10000 10000',
          expectedOutput: 'Remaining: 0'
        },
        {
          input: '500 123',
          expectedOutput: 'Remaining: 377'
        }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int totalBooks = sc.nextInt();
        int borrowedBooks = sc.nextInt();

        System.out.println("Remaining: " + (totalBooks - borrowedBooks);
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• The System.out.println call is missing a closing parenthesis ")".\n• Output format must match: "Remaining: X".'
    },
    {
      id: 'java-bio-12',
      number: '12',
      title: 'Fix the Cookie Sharing Bug',
      slug: 'fix-the-cookie-sharing-bug',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A group of friends wants to share cookies equally.

A programmer has created a Java program to calculate how many cookies each friend should receive.

However, the program crashes while performing the calculation because of an incorrect expression.

Your task is to find and fix the problem.`,
      inputFormat: 'Two space-separated integers representing the number of cookies and friends.',
      outputFormat: 'Print the number of cookies each friend receives in the following format: Cookies per friend: X',
      constraints: '1 ≤ cookies ≤ 10000\n1 ≤ friends ≤ cookies\nThe number of cookies is always divisible by the number of friends.',
      sampleTestCases: [
        {
          input: '36 6',
          expectedOutput: 'Cookies per friend: 6',
          explanation: '36 / 6 = 6. Prints "Cookies per friend: 6".'
        }
      ],
      hiddenTestCases: [
        {
          input: '36 6',
          expectedOutput: 'Cookies per friend: 6'
        },
        {
          input: '10 1',
          expectedOutput: 'Cookies per friend: 10'
        },
        {
          input: '10 10',
          expectedOutput: 'Cookies per friend: 1'
        },
        {
          input: '10000 1',
          expectedOutput: 'Cookies per friend: 10000'
        },
        {
          input: '10000 100',
          expectedOutput: 'Cookies per friend: 100'
        },
        {
          input: '72 8',
          expectedOutput: 'Cookies per friend: 9'
        },
        {
          input: '15 3',
          expectedOutput: 'Cookies per friend: 5'
        },
        {
          input: '1 1',
          expectedOutput: 'Cookies per friend: 1'
        }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int cookies = sc.nextInt();
        int friends = sc.nextInt();

        int each = cookies / (friends - friends);

        System.out.println("Cookies per friend: " + each);
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• The expression (friends - friends) evaluates to 0, which causes an ArithmeticException: / by zero.\n• Correct the divisor to friends: int each = cookies / friends;'
    },
    {
      id: 'java-bio-13',
      number: '13',
      title: 'Fix the Digital Access Card',
      slug: 'fix-the-digital-access-card',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A university is developing a program that generates digital access cards for students.

The program reads a student's name and displays a confirmation message.

Unfortunately, the developer made a mistake while declaring a variable.

Fix the program so that it accepts the student's name and displays the correct message.`,
      inputFormat: "A single word representing the student's name.",
      outputFormat: 'Print the message in the following format: Access granted to NAME',
      constraints: 'The name contains 1 to 30 English letters and no spaces.',
      sampleTestCases: [
        {
          input: 'Omar',
          expectedOutput: 'Access granted to Omar',
          explanation: 'Reads student name "Omar" and prints "Access granted to Omar".'
        }
      ],
      hiddenTestCases: [
        {
          input: 'Omar',
          expectedOutput: 'Access granted to Omar'
        },
        {
          input: 'Fatima',
          expectedOutput: 'Access granted to Fatima'
        },
        {
          input: 'A',
          expectedOutput: 'Access granted to A'
        },
        {
          input: 'Zaid',
          expectedOutput: 'Access granted to Zaid'
        },
        {
          input: 'Christopher',
          expectedOutput: 'Access granted to Christopher'
        },
        {
          input: 'Sarah',
          expectedOutput: 'Access granted to Sarah'
        }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        string student = sc.next();

        System.out.println("Access granted to " + student);
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• In Java, String is an object reference type / class and must be capitalized: String student = sc.next();\n• Java is case-sensitive, so "string" is not recognized.'
    },
    {
      id: 'ext-bio-01',
      number: 'E01',
      title: 'Number Mirror',
      slug: 'number-mirror-start01',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'external',
      sourcePlatform: 'CodeChef',
      concepts: 'Integer Input/Output',
      externalUrl: 'https://www.codechef.com/problems/START01'
    },
    {
      id: 'ext-bio-02',
      number: 'E02',
      title: 'Java Stdin and Stdout I',
      slug: 'java-stdin-and-stdout-1',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'external',
      sourcePlatform: 'HackerRank',
      concepts: 'Scanner, Printing',
      externalUrl: 'https://www.hackerrank.com/challenges/java-stdin-and-stdout-1/problem'
    },
    {
      id: 'ext-bio-03',
      number: 'E03',
      title: 'Java Stdin and Stdout II',
      slug: 'java-stdin-stdout',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'HackerRank',
      concepts: 'int, double, String',
      externalUrl: 'https://www.hackerrank.com/challenges/java-stdin-stdout/problem',
      description: `In this challenge, you must read an integer, a double, and a String from stdin, then print the values according to the instructions.

Note: If you use the nextLine() method immediately following the nextInt() method, recall that nextInt() reads integer tokens; because of this, the newline character following the integer token is still in the buffer. Remember to clear the buffer with scan.nextLine() before reading your String.`,
      inputFormat: `There are three lines of input:
1. The first line contains an integer.
2. The second line contains a double.
3. The third line contains a String.`,
      outputFormat: `There are three lines of output:
1. On the first line, print String: followed by the unaltered String read from stdin.
2. On the second line, print Double: followed by the unaltered double read from stdin.
3. On the third line, print Int: followed by the unaltered integer read from stdin.`,
      constraints: 'The integer fits in a standard 32-bit signed integer. The double is a valid floating point number. The String contains up to 100 printable characters.',
      sampleTestCases: [
        {
          input: "42\n3.1415\nWelcome to HackerRank's Java tutorials!",
          expectedOutput: "String: Welcome to HackerRank's Java tutorials!\nDouble: 3.1415\nInt: 42",
          explanation: 'Reads integer 42, double 3.1415, clears buffer, reads full line string, and prints in the requested order.'
        }
      ],
      hiddenTestCases: [
        {
          input: "42\n3.1415\nWelcome to HackerRank's Java tutorials!",
          expectedOutput: "String: Welcome to HackerRank's Java tutorials!\nDouble: 3.1415\nInt: 42"
        },
        {
          input: "100\n42.5\nJava is awesome",
          expectedOutput: "String: Java is awesome\nDouble: 42.5\nInt: 100"
        },
        {
          input: "1\n0.0\nLearning Java on Lugaish platform",
          expectedOutput: "String: Learning Java on Lugaish platform\nDouble: 0.0\nInt: 1"
        }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        int i = scan.nextInt();
        double d = scan.nextDouble();
        scan.nextLine(); // Clear the newline character from the buffer
        String s = scan.nextLine();

        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• When using Scanner nextInt() or nextDouble(), the trailing newline character is left in the input buffer.\n• Call scan.nextLine() once to clear the newline before reading the full line string.'
    },
    {
      id: 'ext-bio-04',
      number: 'E04',
      title: 'Chef and Instant Noodles',
      slug: 'chef-and-instant-noodles-instnoodle',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'external',
      sourcePlatform: 'CodeChef',
      concepts: 'Multiplication',
      externalUrl: 'https://www.codechef.com/practice/course/cpp/PCPP01/problems/INSTNOODLE',
      description: `Chef has invented 1-minute Instant Noodles. As the name suggests, each packet takes exactly 1 minute to cook.

Chef's restaurant has X stoves and only 1 packet can be cooked in a single stove at any minute.

How many customers can Chef serve in Y minutes if each customer orders exactly 1 packet of noodles?`,
      inputFormat: 'The first and only line of input contains two space-separated integers X and Y — the number of stoves and the number of minutes, respectively.',
      outputFormat: 'Print a single integer — the maximum number of customers Chef can serve in Y minutes.',
      constraints: '1 ≤ X, Y ≤ 1000',
      sampleTestCases: [
        {
          input: '3 7',
          expectedOutput: '21',
          explanation: 'Chef cooks for Y = 7 minutes with X = 3 stoves. Total packets = 3 * 7 = 21.'
        },
        {
          input: '7 8',
          expectedOutput: '56',
          explanation: 'Chef cooks for Y = 8 minutes with X = 7 stoves. Total packets = 7 * 8 = 56.'
        }
      ],
      hiddenTestCases: [
        { input: '3 7', expectedOutput: '21' },
        { input: '7 8', expectedOutput: '56' },
        { input: '1 1', expectedOutput: '1' },
        { input: '10 100', expectedOutput: '1000' },
        { input: '1000 1000', expectedOutput: '1000000' }
      ],
      starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int y = sc.nextInt();

        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• In 1 minute, X packets are cooked across X stoves.\n• In Y minutes, the total packets cooked is X * Y.'
    },
    {
      id: 'ext-bio-05',
      number: 'E05',
      title: 'Area of a Circle — 1002',
      slug: 'area-of-a-circle-1002',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'external',
      sourcePlatform: 'beecrowd',
      concepts: 'Double, Formula',
      externalUrl: 'https://judge.beecrowd.com/en/problems/view/1002'
    },
    {
      id: 'ext-bio-06',
      number: 'E06',
      title: 'Average 1 — 1005',
      slug: 'average-1-1005',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'external',
      sourcePlatform: 'beecrowd',
      concepts: 'Weighted Average',
      externalUrl: 'https://judge.beecrowd.com/en/problems/view/1005'
    },
    {
      id: 'ext-bio-07',
      number: 'E07',
      title: 'Salary — 1008',
      slug: 'salary-1008',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'external',
      sourcePlatform: 'beecrowd',
      concepts: 'Variables, Multiplication',
      externalUrl: 'https://judge.beecrowd.com/en/problems/view/1008'
    },
    {
      id: 'ext-bio-08',
      number: 'E08',
      title: 'Consumption — 1014',
      slug: 'consumption-1014',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'external',
      sourcePlatform: 'beecrowd',
      concepts: 'Division, Decimal Output',
      externalUrl: 'https://judge.beecrowd.com/en/problems/view/1014'
    },
    {
      id: 'ext-bio-09',
      number: 'E09',
      title: 'Domino Piling — 50A',
      slug: 'domino-piling-50a',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'external',
      sourcePlatform: 'Codeforces',
      concepts: 'Integer Division',
      externalUrl: 'https://codeforces.com/problemset/problem/50/A'
    },
    {
      id: 'ext-bio-10',
      number: 'E10',
      title: 'Elephant — 617A',
      slug: 'elephant-617a',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy+',
      problemType: 'external',
      sourcePlatform: 'Codeforces',
      concepts: 'Division, Rounding Up',
      externalUrl: 'https://codeforces.com/problemset/problem/617/A'
    },
    {
      id: 'ext-bio-11',
      number: 'E11',
      title: 'Banknotes — 1018',
      slug: 'banknotes-1018',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy+',
      problemType: 'external',
      sourcePlatform: 'beecrowd',
      concepts: 'Division, Modulo',
      externalUrl: 'https://judge.beecrowd.com/en/problems/view/1018'
    },
    {
      id: 'ext-bio-12',
      number: 'E12',
      title: 'Theatre Square — 1A',
      slug: 'theatre-square-1a',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Challenge',
      problemType: 'external',
      sourcePlatform: 'Codeforces',
      concepts: 'Rounding Up, long',
      externalUrl: 'https://codeforces.com/problemset/problem/1/A'
    }
  ]
};

/**
 * Returns metadata of all supported Java practice topics.
 */
export function getAllTopics() {
  return JAVA_PRACTICE_TOPICS.map(topic => ({
    ...topic,
    problemCount: (javaProblemsByTopic[topic.slug] || []).length
  }));
}

/**
 * Returns a specific topic metadata by slug.
 */
export function getTopicBySlug(topicSlug = 'basic-io-variables') {
  const topic = JAVA_PRACTICE_TOPICS.find(t => t.slug === topicSlug);
  if (!topic) return null;
  return {
    ...topic,
    problemCount: (javaProblemsByTopic[topic.slug] || []).length
  };
}

/**
 * Strips private server-side test cases from problem object.
 * Guaranteed safe to send to public frontend bundles or API consumers.
 */
export function toPublicProblem(problem) {
  if (!problem) return null;

  if (problem.problemType === 'external') {
    return {
      id: problem.id,
      number: problem.number,
      title: problem.title,
      slug: problem.slug,
      language: problem.language || 'Java',
      categorySlug: problem.categorySlug,
      difficulty: problem.difficulty,
      problemType: 'external',
      sourcePlatform: problem.sourcePlatform || 'External',
      concepts: problem.concepts || '',
      externalUrl: problem.externalUrl || ''
    };
  }

  return {
    id: problem.id,
    number: problem.number,
    title: problem.title,
    slug: problem.slug,
    language: problem.language || 'Java',
    categorySlug: problem.categorySlug,
    difficulty: problem.difficulty,
    problemType: 'lugaish',
    sourcePlatform: problem.sourcePlatform || 'Lugaish',
    description: problem.description || '',
    inputFormat: problem.inputFormat || '',
    outputFormat: problem.outputFormat || '',
    constraints: problem.constraints || '',
    sampleTestCases: Array.isArray(problem.sampleTestCases) ? problem.sampleTestCases : [],
    starterCode: problem.starterCode || DEFAULT_JAVA_STARTER,
    timeLimit: problem.timeLimit || 3,
    memoryLimit: problem.memoryLimit || 128000,
    notes: problem.notes || ''
  };
}

/**
 * Returns all public problems for a given topic slug.
 */
export function getPublicProblemsByTopic(topicSlug = 'basic-io-variables') {
  const problems = javaProblemsByTopic[topicSlug] || [];
  return problems.map(toPublicProblem);
}

/**
 * Returns a single public problem by topic slug and problem slug.
 */
export function getPublicProblemBySlug(topicSlug = 'basic-io-variables', slug) {
  const problems = javaProblemsByTopic[topicSlug] || [];
  const found = problems.find(p => p.slug === slug || p.id === slug);
  return found ? toPublicProblem(found) : null;
}

/**
 * Internal function for judging: returns the problem with all test cases (samples + hidden).
 * NEVER return this to the client!
 */
export function getInternalProblemForJudging(topicSlug = 'basic-io-variables', problemId) {
  const problems = javaProblemsByTopic[topicSlug] || [];
  const problem = problems.find(p => p.id === problemId || p.slug === problemId);
  if (!problem || problem.problemType === 'external') return null;

  const sampleCases = (problem.sampleTestCases || []).map(tc => ({
    input: tc.input || '',
    expectedOutput: tc.expectedOutput || '',
    isSample: true
  }));

  const hiddenCases = (problem.hiddenTestCases || []).map(tc => ({
    input: tc.input || '',
    expectedOutput: tc.expectedOutput || '',
    isSample: false
  }));

  const combinedTestCases = [...sampleCases, ...hiddenCases];

  return {
    id: problem.id,
    title: problem.title,
    slug: problem.slug,
    timeLimit: problem.timeLimit || 3,
    memoryLimit: problem.memoryLimit || 128000,
    testCases: combinedTestCases
  };
}

/**
 * Registers a new problem into a topic (for runtime or programmatic additions).
 */
export function registerProblem(topicSlug, problem) {
  if (!javaProblemsByTopic[topicSlug]) {
    javaProblemsByTopic[topicSlug] = [];
  }
  const idx = javaProblemsByTopic[topicSlug].findIndex(p => p.id === problem.id);
  if (idx >= 0) {
    javaProblemsByTopic[topicSlug][idx] = problem;
  } else {
    javaProblemsByTopic[topicSlug].push(problem);
  }
  return problem;
}

