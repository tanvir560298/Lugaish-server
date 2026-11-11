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
  },
  {
    id: 'topic-02',
    slug: 'operators-expressions',
    title: 'Operators & Expressions',
    language: 'Java',
    level: 'Beginner',
    description:
      'Master Java arithmetic operators, integer division, modulo, operator precedence, prefix and postfix operators, and floating-point calculations with practical coding challenges.',
    icon: 'Code2',
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
      problemType: 'external',
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
  ],
  'operators-expressions': [
      {
          "id": "java-oe-14",
          "number": "14",
          "title": "Solar Farm Daily Output",
          "slug": "solar-farm-daily-output",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A small solar farm has several identical solar panels. Each panel produces a fixed amount of power, and all panels operate for a certain number of hours.\n\nCalculate the total energy produced by the solar farm.\n\nThe total energy in watt-hours is the power of one panel multiplied by the number of panels and the operating hours.",
          "inputFormat": "Three space-separated integers:\n- P — Power produced by one panel in watts\n- N — Number of solar panels\n- H — Operating hours",
          "outputFormat": "Print the total energy produced.\nFormat: Energy Produced: X Wh",
          "constraints": "1 ≤ P ≤ 1000\n1 ≤ N ≤ 1000\n1 ≤ H ≤ 24",
          "sampleTestCases": [
              {
                  "input": "85 6 4",
                  "expectedOutput": "Energy Produced: 2040 Wh",
                  "explanation": "Energy = 85 * 6 * 4 = 2040 Wh."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "85 6 4",
                  "expectedOutput": "Energy Produced: 2040 Wh"
              },
              {
                  "input": "1 1 1",
                  "expectedOutput": "Energy Produced: 1 Wh"
              },
              {
                  "input": "1000 1000 24",
                  "expectedOutput": "Energy Produced: 24000000 Wh"
              },
              {
                  "input": "250 40 8",
                  "expectedOutput": "Energy Produced: 80000 Wh"
              },
              {
                  "input": "120 15 6",
                  "expectedOutput": "Energy Produced: 10800 Wh"
              },
              {
                  "input": "500 10 12",
                  "expectedOutput": "Energy Produced: 60000 Wh"
              },
              {
                  "input": "325 50 1",
                  "expectedOutput": "Energy Produced: 16250 Wh"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Multiply the power P, number of panels N, and hours H.\n• Format: Energy Produced: X Wh"
      },
      {
          "id": "java-oe-15",
          "number": "15",
          "title": "Sticker Pack Machine",
          "slug": "sticker-pack-machine",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A stationery store has a machine that packs stickers into identical packets.\n\nEach complete packet must contain exactly K stickers. Any stickers that cannot fill a complete packet remain unpacked.\n\nWrite a program to calculate the number of complete packets and leftover stickers.",
          "inputFormat": "Two integers:\n- S — Total stickers\n- K — Stickers per packet",
          "outputFormat": "Print two lines:\nComplete Packs: X\nLoose Stickers: Y",
          "constraints": "0 ≤ S ≤ 1000000\n1 ≤ K ≤ 100000",
          "sampleTestCases": [
              {
                  "input": "146 12",
                  "expectedOutput": "Complete Packs: 12\nLoose Stickers: 2",
                  "explanation": "146 / 12 = 12 complete packs, 146 % 12 = 2 loose stickers."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "146 12",
                  "expectedOutput": "Complete Packs: 12\nLoose Stickers: 2"
              },
              {
                  "input": "0 50",
                  "expectedOutput": "Complete Packs: 0\nLoose Stickers: 0"
              },
              {
                  "input": "100 10",
                  "expectedOutput": "Complete Packs: 10\nLoose Stickers: 0"
              },
              {
                  "input": "7 15",
                  "expectedOutput": "Complete Packs: 0\nLoose Stickers: 7"
              },
              {
                  "input": "1000000 7",
                  "expectedOutput": "Complete Packs: 142857\nLoose Stickers: 1"
              },
              {
                  "input": "999999 100000",
                  "expectedOutput": "Complete Packs: 9\nLoose Stickers: 99999"
              },
              {
                  "input": "50000 1",
                  "expectedOutput": "Complete Packs: 50000\nLoose Stickers: 0"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Use integer division (S / K) to count complete packs.\n• Use modulus (S % K) to find remaining loose stickers."
      },
      {
          "id": "java-oe-16",
          "number": "16",
          "title": "Arcade Score Booster",
          "slug": "arcade-score-booster",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A player earns points in an arcade game.\n\nThe player starts with some base points, receives bonus points, and loses penalty points. At the end, the remaining score is multiplied by a special booster.\n\nCalculate the final score.\n\nThe multiplier applies after the bonus and penalty adjustments.",
          "inputFormat": "Four integers:\n- B — Base points\n- A — Bonus points\n- P — Penalty points\n- M — Score multiplier",
          "outputFormat": "Print:\nFinal Points: X",
          "constraints": "0 ≤ B, A ≤ 5000\n0 ≤ P ≤ B + A\n1 ≤ M ≤ 10",
          "sampleTestCases": [
              {
                  "input": "120 35 15 3",
                  "expectedOutput": "Final Points: 420",
                  "explanation": "(120 + 35 - 15) * 3 = 140 * 3 = 420."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "120 35 15 3",
                  "expectedOutput": "Final Points: 420"
              },
              {
                  "input": "0 0 0 5",
                  "expectedOutput": "Final Points: 0"
              },
              {
                  "input": "100 50 150 4",
                  "expectedOutput": "Final Points: 0"
              },
              {
                  "input": "5000 5000 0 10",
                  "expectedOutput": "Final Points: 100000"
              },
              {
                  "input": "250 100 50 1",
                  "expectedOutput": "Final Points: 300"
              },
              {
                  "input": "450 75 25 2",
                  "expectedOutput": "Final Points: 1000"
              },
              {
                  "input": "1000 2000 500 8",
                  "expectedOutput": "Final Points: 20000"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Operator precedence: ensure (B + A - P) is evaluated inside parentheses before multiplying by M."
      },
      {
          "id": "java-oe-17",
          "number": "17",
          "title": "Race Clock Formatter",
          "slug": "race-clock-formatter",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A digital stopwatch records the duration of a race in total seconds.\n\nThe race organizer wants to display the duration in hours, minutes, and seconds.\n\nConvert the given total seconds into the required format.",
          "inputFormat": "One non-negative integer T representing total seconds.",
          "outputFormat": "Print:\nTime: Hh Mm Ss\nNo leading zeros are required.",
          "constraints": "0 ≤ T ≤ 10000000",
          "sampleTestCases": [
              {
                  "input": "7384",
                  "expectedOutput": "Time: 2h 3m 4s",
                  "explanation": "7384s = 2h (7200s) + 3m (180s) + 4s."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "7384",
                  "expectedOutput": "Time: 2h 3m 4s"
              },
              {
                  "input": "0",
                  "expectedOutput": "Time: 0h 0m 0s"
              },
              {
                  "input": "59",
                  "expectedOutput": "Time: 0h 0m 59s"
              },
              {
                  "input": "3600",
                  "expectedOutput": "Time: 1h 0m 0s"
              },
              {
                  "input": "86400",
                  "expectedOutput": "Time: 24h 0m 0s"
              },
              {
                  "input": "3661",
                  "expectedOutput": "Time: 1h 1m 1s"
              },
              {
                  "input": "10000000",
                  "expectedOutput": "Time: 2777h 46m 40s"
              },
              {
                  "input": "185",
                  "expectedOutput": "Time: 0h 3m 5s"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Hours = T / 3600\n• Minutes = (T % 3600) / 60\n• Seconds = T % 60"
      },
      {
          "id": "java-oe-18",
          "number": "18",
          "title": "Robot Charging Log",
          "slug": "robot-charging-log",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A delivery robot stores its available energy in energy units.\n\nBefore starting a delivery, the robot receives additional energy from a charging station.\n\nDuring the delivery, it consumes some energy.\n\nCalculate the robot's energy immediately after charging and after completing the delivery.",
          "inputFormat": "Three integers:\n- E — Initial energy\n- C — Energy added by charging\n- U — Energy consumed during delivery",
          "outputFormat": "Print:\nAfter Charge: X\nAfter Mission: Y",
          "constraints": "0 ≤ E, C ≤ 1000000\n0 ≤ U ≤ E + C",
          "sampleTestCases": [
              {
                  "input": "480 70 210",
                  "expectedOutput": "After Charge: 550\nAfter Mission: 340",
                  "explanation": "After charge = 480 + 70 = 550. After mission = 550 - 210 = 340."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "480 70 210",
                  "expectedOutput": "After Charge: 550\nAfter Mission: 340"
              },
              {
                  "input": "0 100 100",
                  "expectedOutput": "After Charge: 100\nAfter Mission: 0"
              },
              {
                  "input": "500 0 150",
                  "expectedOutput": "After Charge: 500\nAfter Mission: 350"
              },
              {
                  "input": "1000 500 0",
                  "expectedOutput": "After Charge: 1500\nAfter Mission: 1500"
              },
              {
                  "input": "1000000 1000000 2000000",
                  "expectedOutput": "After Charge: 2000000\nAfter Mission: 0"
              },
              {
                  "input": "2500 750 1200",
                  "expectedOutput": "After Charge: 3250\nAfter Mission: 2050"
              },
              {
                  "input": "0 0 0",
                  "expectedOutput": "After Charge: 0\nAfter Mission: 0"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Update energy after charge with (E + C).\n• Update energy after mission with (E + C - U)."
      },
      {
          "id": "java-oe-19",
          "number": "19",
          "title": "Workshop Performance Score",
          "slug": "workshop-performance-score",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A training workshop evaluates students using three components:\n\n- Project: 25%\n- Practical Lab: 35%\n- Final Assessment: 40%\n\nA student's marks for all three components are given.\n\nCalculate the student's final weighted score.",
          "inputFormat": "Three integers representing the student's Project, Practical Lab, and Final Assessment marks.",
          "outputFormat": "Print the final weighted score with exactly two digits after the decimal point.\nFormat: Course Score: X",
          "constraints": "0 ≤ Each mark ≤ 100\nNote: Use decimal arithmetic when calculating percentages.",
          "sampleTestCases": [
              {
                  "input": "80 90 70",
                  "expectedOutput": "Course Score: 79.50",
                  "explanation": "80 * 0.25 + 90 * 0.35 + 70 * 0.40 = 20.0 + 31.5 + 28.0 = 79.50."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "80 90 70",
                  "expectedOutput": "Course Score: 79.50"
              },
              {
                  "input": "0 0 0",
                  "expectedOutput": "Course Score: 0.00"
              },
              {
                  "input": "100 100 100",
                  "expectedOutput": "Course Score: 100.00"
              },
              {
                  "input": "55 63 77",
                  "expectedOutput": "Course Score: 66.60"
              },
              {
                  "input": "95 85 92",
                  "expectedOutput": "Course Score: 90.30"
              },
              {
                  "input": "100 0 0",
                  "expectedOutput": "Course Score: 25.00"
              },
              {
                  "input": "73 81 69",
                  "expectedOutput": "Course Score: 74.20"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Perform floating-point multiplication: (p * 0.25) + (lab * 0.35) + (finalExam * 0.40).\n• Format with System.out.printf(java.util.Locale.US, \"Course Score: %.2f%n\", score);"
      },
      {
          "id": "java-oe-20",
          "number": "20",
          "title": "Garden Plot Designer",
          "slug": "garden-plot-designer",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A gardening company is designing a rectangular garden.\n\nThe company needs two measurements:\n1. The total area available for planting.\n2. The total fence length needed to surround the garden.\n\nCalculate both values using the garden's length and width.",
          "inputFormat": "Two positive integers L and W representing the garden's length and width in meters.",
          "outputFormat": "Print:\nArea: X\nFence: Y\nThe area is measured in square meters, and the fence length is measured in meters.",
          "constraints": "1 ≤ L, W ≤ 10000",
          "sampleTestCases": [
              {
                  "input": "14 9",
                  "expectedOutput": "Area: 126\nFence: 46",
                  "explanation": "Area = 14 * 9 = 126. Perimeter (fence) = 2 * (14 + 9) = 46."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "14 9",
                  "expectedOutput": "Area: 126\nFence: 46"
              },
              {
                  "input": "1 1",
                  "expectedOutput": "Area: 1\nFence: 4"
              },
              {
                  "input": "10000 10000",
                  "expectedOutput": "Area: 100000000\nFence: 40000"
              },
              {
                  "input": "25 10",
                  "expectedOutput": "Area: 250\nFence: 70"
              },
              {
                  "input": "100 1",
                  "expectedOutput": "Area: 100\nFence: 202"
              },
              {
                  "input": "48 32",
                  "expectedOutput": "Area: 1536\nFence: 160"
              },
              {
                  "input": "500 200",
                  "expectedOutput": "Area: 100000\nFence: 1400"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Area = L * W\n• Fence = 2 * (L + W)"
      },
      {
          "id": "java-oe-21",
          "number": "21",
          "title": "Festival Attendance Estimator",
          "slug": "festival-attendance-estimator",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "An event management company organizes a large festival across multiple venues.\n\nEach venue has the same number of visitor seats.\n\nThe company wants to estimate the total number of visitor entries across several festival sessions.\n\nAssume every seat is occupied during each session.\n\nCalculate the total visitor entries.",
          "inputFormat": "Three integers:\n- S — Seats per venue\n- V — Number of venues\n- R — Number of sessions",
          "outputFormat": "Print:\nTotal Visits: X",
          "constraints": "1 ≤ S, V, R ≤ 1000000\nImportant: The result may exceed the maximum value of a Java int. Students should use an appropriate numeric data type and avoid intermediate integer overflow.",
          "sampleTestCases": [
              {
                  "input": "25000 150 20",
                  "expectedOutput": "Total Visits: 75000000",
                  "explanation": "25000 * 150 * 20 = 75,000,000."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "25000 150 20",
                  "expectedOutput": "Total Visits: 75000000"
              },
              {
                  "input": "1 1 1",
                  "expectedOutput": "Total Visits: 1"
              },
              {
                  "input": "1000000 1000000 1000000",
                  "expectedOutput": "Total Visits: 1000000000000000000"
              },
              {
                  "input": "50000 40000 100",
                  "expectedOutput": "Total Visits: 200000000000"
              },
              {
                  "input": "300000 20000 50",
                  "expectedOutput": "Total Visits: 300000000000"
              },
              {
                  "input": "1200 80 15",
                  "expectedOutput": "Total Visits: 1440000"
              },
              {
                  "input": "999999 999999 10",
                  "expectedOutput": "Total Visits: 9999980000010"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Avoid 32-bit int overflow! Read or cast values to long before multiplying: (long) S * V * R."
      },
      {
          "id": "java-oe-22",
          "number": "22",
          "title": "Turnstile Counter Mystery",
          "slug": "turnstile-counter-mystery",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "An electronic turnstile maintains an integer counter.\n\nA technician performs four operations and records the value returned by each operation.\n\nThe following Java statements describe the operations:\n\n```java\nint counter = N;\n\nint first = counter++;\nint second = ++counter;\nint third = counter--;\nint fourth = --counter;\n```\n\nYour task is to determine the values of first, second, third, fourth, and the final counter.",
          "inputFormat": "A single integer N representing the initial counter value.",
          "outputFormat": "Print exactly five lines:\nFirst: X\nSecond: Y\nThird: Z\nFourth: W\nFinal: F",
          "constraints": "0 ≤ N ≤ 1000000",
          "sampleTestCases": [
              {
                  "input": "7",
                  "expectedOutput": "First: 7\nSecond: 9\nThird: 9\nFourth: 7\nFinal: 7",
                  "explanation": "• counter starts at 7.\n• first = counter++ takes 7, counter becomes 8.\n• second = ++counter increments counter to 9, takes 9.\n• third = counter-- takes 9, counter becomes 8.\n• fourth = --counter decrements counter to 7, takes 7.\n• final counter is 7."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "7",
                  "expectedOutput": "First: 7\nSecond: 9\nThird: 9\nFourth: 7\nFinal: 7"
              },
              {
                  "input": "0",
                  "expectedOutput": "First: 0\nSecond: 2\nThird: 2\nFourth: 0\nFinal: 0"
              },
              {
                  "input": "100",
                  "expectedOutput": "First: 100\nSecond: 102\nThird: 102\nFourth: 100\nFinal: 100"
              },
              {
                  "input": "1000000",
                  "expectedOutput": "First: 1000000\nSecond: 1000002\nThird: 1000002\nFourth: 1000000\nFinal: 1000000"
              },
              {
                  "input": "1",
                  "expectedOutput": "First: 1\nSecond: 3\nThird: 3\nFourth: 1\nFinal: 1"
              },
              {
                  "input": "49",
                  "expectedOutput": "First: 49\nSecond: 51\nThird: 51\nFourth: 49\nFinal: 49"
              },
              {
                  "input": "12",
                  "expectedOutput": "First: 12\nSecond: 14\nThird: 14\nFourth: 12\nFinal: 12"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Post-increment/decrement (x++, x--) uses the current value before updating.\n• Pre-increment/decrement (++x, --x) updates the variable before returning the value."
      },
      {
          "id": "java-oe-23",
          "number": "23",
          "title": "Weather Lab Converter",
          "slug": "weather-lab-converter",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A science laboratory records temperatures in Celsius, but its international monitoring system displays temperatures in Fahrenheit.\n\nCreate a program to convert a Celsius temperature into Fahrenheit.\n\nUse the standard conversion formula:\nF = (C × 9 / 5) + 32",
          "inputFormat": "One decimal number C representing the Celsius temperature.",
          "outputFormat": "Print the Fahrenheit temperature with exactly two digits after the decimal point.\nFormat: Fahrenheit: X",
          "constraints": "-100 ≤ C ≤ 100\nNote: Avoid unintended integer division.",
          "sampleTestCases": [
              {
                  "input": "23.5",
                  "expectedOutput": "Fahrenheit: 74.30",
                  "explanation": "(23.5 * 9.0 / 5.0) + 32.0 = 42.3 + 32.0 = 74.30."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "23.5",
                  "expectedOutput": "Fahrenheit: 74.30"
              },
              {
                  "input": "0",
                  "expectedOutput": "Fahrenheit: 32.00"
              },
              {
                  "input": "100",
                  "expectedOutput": "Fahrenheit: 212.00"
              },
              {
                  "input": "-40",
                  "expectedOutput": "Fahrenheit: -40.00"
              },
              {
                  "input": "37",
                  "expectedOutput": "Fahrenheit: 98.60"
              },
              {
                  "input": "-15.5",
                  "expectedOutput": "Fahrenheit: 4.10"
              },
              {
                  "input": "-100",
                  "expectedOutput": "Fahrenheit: -148.00"
              },
              {
                  "input": "18.25",
                  "expectedOutput": "Fahrenheit: 64.85"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Beware of integer division! 9 / 5 evaluates to 1. Use 9.0 / 5.0 or (C * 9.0) / 5.0.\n• Format with System.out.printf(java.util.Locale.US, \"Fahrenheit: %.2f%n\", fahrenheit);"
      },
      {
          "id": "java-oe-24",
          "number": "24",
          "title": "Smart Bus Fare",
          "slug": "smart-bus-fare",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Hard",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A city transport company calculates bus fares using a base fare and a fee for each travel zone.\n\nPassengers may also receive a percentage discount on the total fare.\n\nCalculate the final fare after applying the discount.\n\nThe fare before discount is the base fare plus the number of zones multiplied by the fee per zone.\n\nThe discount is applied to that entire amount.",
          "inputFormat": "Four space-separated integers:\n- B — Base fare\n- Z — Number of travel zones\n- F — Fee per zone\n- D — Discount percentage",
          "outputFormat": "Print the final fare with exactly two digits after the decimal point.\nFormat: Fare: X",
          "constraints": "0 ≤ B ≤ 10000\n0 ≤ Z ≤ 100\n0 ≤ F ≤ 1000\n0 ≤ D ≤ 50\nNote: D is a percentage, not a fixed monetary discount.",
          "sampleTestCases": [
              {
                  "input": "20 3 7 10",
                  "expectedOutput": "Fare: 36.90",
                  "explanation": "Subtotal = 20 + (3 * 7) = 41. 10% discount = 4.10. Final fare = 41 - 4.10 = 36.90."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "20 3 7 10",
                  "expectedOutput": "Fare: 36.90"
              },
              {
                  "input": "0 0 0 0",
                  "expectedOutput": "Fare: 0.00"
              },
              {
                  "input": "50 4 10 0",
                  "expectedOutput": "Fare: 90.00"
              },
              {
                  "input": "100 2 25 50",
                  "expectedOutput": "Fare: 75.00"
              },
              {
                  "input": "15 5 8 15",
                  "expectedOutput": "Fare: 46.75"
              },
              {
                  "input": "10000 100 1000 25",
                  "expectedOutput": "Fare: 82500.00"
              },
              {
                  "input": "30 0 15 20",
                  "expectedOutput": "Fare: 24.00"
              },
              {
                  "input": "45 6 12 5",
                  "expectedOutput": "Fare: 111.15"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Subtotal = B + (Z * F)\n• Final fare = subtotal * (1.0 - D / 100.0)\n• Format: Fare: %.2f"
      },
      {
          "id": "java-oe-25",
          "number": "25",
          "title": "Scooter Speed Calculator",
          "slug": "scooter-speed-calculator",
          "language": "Java",
          "categorySlug": "operators-expressions",
          "difficulty": "Hard",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "An electric scooter completes a journey of D kilometers in T minutes.\n\nThe rider wants to calculate the average speed in kilometers per hour.\n\nWrite a Java program that converts the travel duration into hours and calculates the scooter's average speed.",
          "inputFormat": "Two integers:\n- D — Distance traveled in kilometers\n- T — Travel duration in minutes",
          "outputFormat": "Print the average speed with exactly two digits after the decimal point.\nFormat: Speed: X km/h",
          "constraints": "0 ≤ D ≤ 10000\n1 ≤ T ≤ 10000\nNote: Perform decimal division when calculating the average speed.",
          "sampleTestCases": [
              {
                  "input": "42 80",
                  "expectedOutput": "Speed: 31.50 km/h",
                  "explanation": "Duration = 80 / 60.0 hours. Speed = 42 / (80 / 60.0) = 31.50 km/h."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "42 80",
                  "expectedOutput": "Speed: 31.50 km/h"
              },
              {
                  "input": "0 45",
                  "expectedOutput": "Speed: 0.00 km/h"
              },
              {
                  "input": "60 60",
                  "expectedOutput": "Speed: 60.00 km/h"
              },
              {
                  "input": "15 30",
                  "expectedOutput": "Speed: 30.00 km/h"
              },
              {
                  "input": "100 120",
                  "expectedOutput": "Speed: 50.00 km/h"
              },
              {
                  "input": "25 45",
                  "expectedOutput": "Speed: 33.33 km/h"
              },
              {
                  "input": "10000 10000",
                  "expectedOutput": "Speed: 60.00 km/h"
              },
              {
                  "input": "5 1",
                  "expectedOutput": "Speed: 300.00 km/h"
              },
              {
                  "input": "18 24",
                  "expectedOutput": "Speed: 45.00 km/h"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Convert duration to hours using T / 60.0.\n• Speed = D / hours (or (D * 60.0) / T).\n• Format: Speed: %.2f km/h"
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
  if (!problem || (problem.problemType === 'external' && (!problem.sampleTestCases || problem.sampleTestCases.length === 0))) return null;

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

