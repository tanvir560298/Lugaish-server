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
  },
  {
    id: 'topic-03',
    slug: 'conditional-statements',
    title: 'Conditional Statements (if, else, switch)',
    language: 'Java',
    level: 'Beginner',
    description:
      'Master Java decision making: boolean expressions, relational operators, if, if-else, if-else-if ladders, nested conditions, and switch statements with practical coding challenges.',
    icon: 'GitBranch',
    active: true
  },
  {
    id: 'topic-04',
    slug: 'loops-iterations',
    title: 'Loops & Iterations',
    language: 'Java',
    level: 'Beginner',
    description:
      'Master loop control structures: for loops, while loops, do-while loops, sentinel loops, streak counters, and accumulators with practical coding challenges.',
    icon: 'RefreshCw',
    active: true
  },
  {
    id: 'topic-05',
    slug: 'nested-loops-pattern-printing',
    title: 'Nested Loops & Pattern Printing',
    language: 'Java',
    level: 'Intermediate',
    description:
      'Master multi-dimensional iterations: star triangles, pyramids, border frames, radar diagonals, and number matrices with practical coding challenges.',
    icon: 'Layers',
    active: true
  },
  {
    id: 'topic-06',
    slug: 'arrays',
    title: 'Arrays',
    language: 'Java',
    level: 'Beginner to Intermediate',
    description:
      'Master array operations in Java: memory allocation, indexing, min/max search, deduplication, and range calculations with practical coding challenges.',
    icon: 'Layers',
    active: true
  },
  {
    id: 'topic-07',
    slug: 'strings-manipulation',
    title: 'Strings & String Manipulation',
    language: 'Java',
    level: 'Beginner',
    description:
      'Master String methods in Java: length(), charAt(), indexOf(), substring(), toUpperCase(), toLowerCase(), and equals() with practical coding challenges.',
    icon: 'Type',
    active: true
  },
  {
    id: 'topic-08',
    slug: 'methods-functions',
    title: 'Methods & Functions',
    language: 'Java',
    level: 'Beginner to Intermediate',
    description:
      'Master modular programming: method declarations, parameters, return types, mathematical logic, string transformations, and boolean helper methods with practical coding challenges.',
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
      problemType: 'external',
      sourcePlatform: 'HackerRank',
      concepts: 'int, double, String',
      externalUrl: 'https://www.hackerrank.com/challenges/java-stdin-stdout/problem'
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
          "number": "01",
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
          "number": "02",
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
          "number": "03",
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
          "number": "04",
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
          "number": "05",
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
          "number": "06",
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
          "number": "07",
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
          "number": "08",
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
          "number": "09",
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
          "number": "10",
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
          "number": "11",
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
          "number": "12",
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
      },
{
        "id": "java-math-38",
        "number": "13",
        "title": "Rounded Rainfall Reading",
        "slug": "rounded-rainfall-reading",
        "language": "Java",
        "categorySlug": "operators-expressions",
        "difficulty": "Easy",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "description": "A weather monitoring station measures rainfall in millimeters.\n\nThe sensor records rainfall with decimal precision, but the station's daily summary must display the nearest whole millimeter.\n\nWrite a Java program that reads the measured rainfall and reports its rounded value.\n\nUse conventional Java rounding behavior for non-negative values.",
        "inputFormat": "One decimal number R representing rainfall in millimeters.",
        "outputFormat": "Print:\nRounded Rainfall: X\n\nWhere X is the nearest whole number.",
        "constraints": "0 ≤ R ≤ 1000000",
        "sampleTestCases": [
            {
                "input": "23.6",
                "expectedOutput": "Rounded Rainfall: 24",
                "explanation": "23.6 rounded to the nearest whole millimeter is 24."
            }
        ],
        "hiddenTestCases": [
            {
                "input": "23.6",
                "expectedOutput": "Rounded Rainfall: 24"
            },
            {
                "input": "23.4",
                "expectedOutput": "Rounded Rainfall: 23"
            },
            {
                "input": "23.5",
                "expectedOutput": "Rounded Rainfall: 24"
            },
            {
                "input": "0.0",
                "expectedOutput": "Rounded Rainfall: 0"
            },
            {
                "input": "0.2",
                "expectedOutput": "Rounded Rainfall: 0"
            },
            {
                "input": "0.7",
                "expectedOutput": "Rounded Rainfall: 1"
            },
            {
                "input": "150.0",
                "expectedOutput": "Rounded Rainfall: 150"
            },
            {
                "input": "999999.8",
                "expectedOutput": "Rounded Rainfall: 1000000"
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Use Math.round(R) with double input.\n• Output format: Rounded Rainfall: X"
    },
    {
        "id": "java-math-39",
        "number": "14",
        "title": "Two-Drone Altitude Report",
        "slug": "two-drone-altitude-report",
        "language": "Java",
        "categorySlug": "operators-expressions",
        "difficulty": "Easy",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "description": "Two research drones are flying above a testing field.\n\nEach drone reports its current altitude in meters.\n\nA monitoring station needs to identify the higher and lower altitude to prepare a flight summary.\n\nWrite a Java program to display both measurements.",
        "inputFormat": "Two decimal numbers:\nA B\n\nWhere A and B are the altitudes of the two drones.",
        "outputFormat": "Print:\nHighest: X\nLowest: Y\n\nDisplay both measurements with exactly two digits after the decimal point.",
        "constraints": "0 ≤ A, B ≤ 100000",
        "sampleTestCases": [
            {
                "input": "152.25 149.5",
                "expectedOutput": "Highest: 152.25\nLowest: 149.50",
                "explanation": "Highest is 152.25, lowest is 149.50."
            }
        ],
        "hiddenTestCases": [
            {
                "input": "152.25 149.5",
                "expectedOutput": "Highest: 152.25\nLowest: 149.50"
            },
            {
                "input": "80.0 120.75",
                "expectedOutput": "Highest: 120.75\nLowest: 80.00"
            },
            {
                "input": "50.5 50.5",
                "expectedOutput": "Highest: 50.50\nLowest: 50.50"
            },
            {
                "input": "0.0 0.0",
                "expectedOutput": "Highest: 0.00\nLowest: 0.00"
            },
            {
                "input": "0.05 0.02",
                "expectedOutput": "Highest: 0.05\nLowest: 0.02"
            },
            {
                "input": "99999.9 100000.0",
                "expectedOutput": "Highest: 100000.00\nLowest: 99999.90"
            },
            {
                "input": "10.2 20.4",
                "expectedOutput": "Highest: 20.40\nLowest: 10.20"
            }
        ],
        "starterCode": "import java.util.Scanner;\nimport java.util.Locale;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Use Math.max(A, B) and Math.min(A, B).\n• Format with Locale.US to 2 decimal places."
    },
    {
        "id": "java-math-40",
        "number": "15",
        "title": "Shift Duration Bounds",
        "slug": "shift-duration-bounds",
        "language": "Java",
        "categorySlug": "operators-expressions",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "description": "A digital scheduling system records the duration of a work shift as a decimal number of hours.\n\nThe system needs to display two values:\n1. The number of fully completed hours.\n2. The number of hourly slots touched by the shift, counting any partial hour as one full slot.\n\nFor example, a shift lasting 4.75 hours contains four complete hours but occupies five hourly slots.\n\nWrite a program to calculate these values.",
        "inputFormat": "One non-negative decimal number H representing the duration in hours.",
        "outputFormat": "Print:\nComplete Hours: X\nHourly Slots: Y\n\nBoth X and Y must be displayed as whole numbers.",
        "constraints": "0 ≤ H ≤ 10000",
        "sampleTestCases": [
            {
                "input": "4.75",
                "expectedOutput": "Complete Hours: 4\nHourly Slots: 5",
                "explanation": "Floor of 4.75 is 4, ceil of 4.75 is 5."
            }
        ],
        "hiddenTestCases": [
            {
                "input": "4.75",
                "expectedOutput": "Complete Hours: 4\nHourly Slots: 5"
            },
            {
                "input": "6.0",
                "expectedOutput": "Complete Hours: 6\nHourly Slots: 6"
            },
            {
                "input": "0.0",
                "expectedOutput": "Complete Hours: 0\nHourly Slots: 0"
            },
            {
                "input": "0.25",
                "expectedOutput": "Complete Hours: 0\nHourly Slots: 1"
            },
            {
                "input": "7.01",
                "expectedOutput": "Complete Hours: 7\nHourly Slots: 8"
            },
            {
                "input": "7.99",
                "expectedOutput": "Complete Hours: 7\nHourly Slots: 8"
            },
            {
                "input": "10000.0",
                "expectedOutput": "Complete Hours: 10000\nHourly Slots: 10000"
            },
            {
                "input": "12.5",
                "expectedOutput": "Complete Hours: 12\nHourly Slots: 13"
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Complete hours: (long) Math.floor(H)\n• Hourly slots: (long) Math.ceil(H)"
    },
    {
        "id": "java-math-41",
        "number": "16",
        "title": "Crate Shipment Count",
        "slug": "crate-shipment-count",
        "language": "Java",
        "categorySlug": "operators-expressions",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "description": "A delivery company is preparing to ship a collection of identical products.\n\nEvery shipping crate can hold at most K products.\n\nThe company wants to know the minimum number of crates required to transport all N products.\n\nEven if the final crate is not completely full, it is still needed.\n\nWrite a program to calculate the number of crates.",
        "inputFormat": "Two integers:\nN K\n\nWhere:\n- N = Total products\n- K = Maximum products per crate",
        "outputFormat": "Print:\nCrates Needed: X",
        "constraints": "0 ≤ N ≤ 1000000\n1 ≤ K ≤ 100000",
        "sampleTestCases": [
            {
                "input": "53 8",
                "expectedOutput": "Crates Needed: 7",
                "explanation": "53 / 8 = 6.625. Ceil is 7 crates."
            }
        ],
        "hiddenTestCases": [
            {
                "input": "53 8",
                "expectedOutput": "Crates Needed: 7"
            },
            {
                "input": "0 10",
                "expectedOutput": "Crates Needed: 0"
            },
            {
                "input": "40 8",
                "expectedOutput": "Crates Needed: 5"
            },
            {
                "input": "1 5",
                "expectedOutput": "Crates Needed: 1"
            },
            {
                "input": "5 1",
                "expectedOutput": "Crates Needed: 5"
            },
            {
                "input": "100 1",
                "expectedOutput": "Crates Needed: 100"
            },
            {
                "input": "999999 10",
                "expectedOutput": "Crates Needed: 100000"
            },
            {
                "input": "1000000 100000",
                "expectedOutput": "Crates Needed: 10"
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Use Math.ceil((double) N / K) or handle 0 separately."
    }
  ],
  'conditional-statements': [
      {
          "id": "java-cs-26",
          "number": "01",
          "title": "Elevator Capacity Check",
          "slug": "elevator-capacity-check",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "An office building has a smart elevator that monitors its carrying capacity.\n\nThe elevator already contains a certain amount of weight. Another package is about to be loaded.\n\nYour task is to determine whether the elevator can safely carry the additional package without exceeding its maximum capacity.\n\nIf the combined weight is less than or equal to the elevator's capacity, loading is allowed.",
          "inputFormat": "A single line containing three integers:\nC P L\n\nWhere:\n- C = Current weight inside the elevator\n- P = Weight of the new package\n- L = Maximum permitted weight",
          "outputFormat": "Print CAN_LOAD if the total weight does not exceed the limit.\nOtherwise, print OVERLOAD.",
          "constraints": "0 ≤ C ≤ L\n0 ≤ P ≤ 1000\n1 ≤ L ≤ 10000\nImportant boundary: Equal weight and maximum capacity must be accepted.",
          "sampleTestCases": [
              {
                  "input": "120 35 160",
                  "expectedOutput": "CAN_LOAD",
                  "explanation": "120 + 35 = 155, which is less than 160."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "120 35 160",
                  "expectedOutput": "CAN_LOAD"
              },
              {
                  "input": "120 40 160",
                  "expectedOutput": "CAN_LOAD"
              },
              {
                  "input": "120 41 160",
                  "expectedOutput": "OVERLOAD"
              },
              {
                  "input": "0 0 100",
                  "expectedOutput": "CAN_LOAD"
              },
              {
                  "input": "500 0 500",
                  "expectedOutput": "CAN_LOAD"
              },
              {
                  "input": "500 1 500",
                  "expectedOutput": "OVERLOAD"
              },
              {
                  "input": "0 1000 1000",
                  "expectedOutput": "CAN_LOAD"
              },
              {
                  "input": "9500 600 10000",
                  "expectedOutput": "OVERLOAD"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Check if C + P <= L.\n• Print CAN_LOAD or OVERLOAD."
      },
      {
          "id": "java-cs-27",
          "number": "02",
          "title": "Two-Team Scoreboard",
          "slug": "two-team-scoreboard",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "Two gaming teams compete in a final match.\n\nAfter the match, the scoreboard records the total points earned by Team A and Team B.\n\nWrite a Java program that determines which team scored more points, or whether the match ended in a draw.",
          "inputFormat": "Two space-separated integers:\nA B\n\nWhere A and B represent the two teams' scores.",
          "outputFormat": "Print exactly one of:\n- TEAM_A if Team A has more points.\n- TEAM_B if Team B has more points.\n- DRAW if both teams have equal points.",
          "constraints": "0 ≤ A, B ≤ 100000",
          "sampleTestCases": [
              {
                  "input": "76 76",
                  "expectedOutput": "DRAW",
                  "explanation": "Both teams scored 76 points, so it is a draw."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "76 76",
                  "expectedOutput": "DRAW"
              },
              {
                  "input": "100 85",
                  "expectedOutput": "TEAM_A"
              },
              {
                  "input": "45 90",
                  "expectedOutput": "TEAM_B"
              },
              {
                  "input": "0 0",
                  "expectedOutput": "DRAW"
              },
              {
                  "input": "0 1",
                  "expectedOutput": "TEAM_B"
              },
              {
                  "input": "1 0",
                  "expectedOutput": "TEAM_A"
              },
              {
                  "input": "100000 99999",
                  "expectedOutput": "TEAM_A"
              },
              {
                  "input": "54321 54322",
                  "expectedOutput": "TEAM_B"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Compare A and B using if-else-if.\n• Output TEAM_A, TEAM_B, or DRAW."
      },
      {
          "id": "java-cs-28",
          "number": "03",
          "title": "Smart Camera Activation",
          "slug": "smart-camera-activation",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A smart security camera requires two conditions before it can begin recording:\n\n1. Its battery level must be at least 30%.\n2. It must be connected to Wi-Fi.\n\nThe system receives the battery percentage and Wi-Fi connection status.\n\nDetermine whether the camera is ready to start recording.",
          "inputFormat": "Two values:\nbattery connected\n\nWhere:\n- battery = Integer battery percentage\n- connected = Boolean value (true or false)",
          "outputFormat": "Print READY if both requirements are satisfied.\nOtherwise, print NOT_READY.",
          "constraints": "0 ≤ battery ≤ 100\nconnected is either true or false.",
          "sampleTestCases": [
              {
                  "input": "45 true",
                  "expectedOutput": "READY",
                  "explanation": "Battery is 45% (≥ 30%) and Wi-Fi is connected."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "45 true",
                  "expectedOutput": "READY"
              },
              {
                  "input": "30 true",
                  "expectedOutput": "READY"
              },
              {
                  "input": "29 true",
                  "expectedOutput": "NOT_READY"
              },
              {
                  "input": "100 true",
                  "expectedOutput": "READY"
              },
              {
                  "input": "50 false",
                  "expectedOutput": "NOT_READY"
              },
              {
                  "input": "30 false",
                  "expectedOutput": "NOT_READY"
              },
              {
                  "input": "0 true",
                  "expectedOutput": "NOT_READY"
              },
              {
                  "input": "0 false",
                  "expectedOutput": "NOT_READY"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Check battery >= 30 && connected.\n• Output READY or NOT_READY."
      },
      {
          "id": "java-cs-29",
          "number": "04",
          "title": "Community Workshop Entry",
          "slug": "community-workshop-entry",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A community technology workshop allows visitors to enter if they satisfy at least one of the following conditions:\n\n- They have received an official invitation.\n- They have earned at least 100 activity points.\n\nA visitor does not need to meet both conditions.\n\nWrite a Java program to determine whether the visitor can enter.",
          "inputFormat": "Two values:\ninvitation points\n\nWhere:\n- invitation = Boolean (true or false)\n- points = Non-negative integer",
          "outputFormat": "Print ADMITTED if the visitor satisfies at least one requirement.\nOtherwise, print NOT_ADMITTED.",
          "constraints": "0 ≤ points ≤ 10000",
          "sampleTestCases": [
              {
                  "input": "false 120",
                  "expectedOutput": "ADMITTED",
                  "explanation": "Visitor has no invitation, but has 120 points (≥ 100)."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "false 120",
                  "expectedOutput": "ADMITTED"
              },
              {
                  "input": "true 50",
                  "expectedOutput": "ADMITTED"
              },
              {
                  "input": "true 150",
                  "expectedOutput": "ADMITTED"
              },
              {
                  "input": "false 80",
                  "expectedOutput": "NOT_ADMITTED"
              },
              {
                  "input": "false 100",
                  "expectedOutput": "ADMITTED"
              },
              {
                  "input": "false 99",
                  "expectedOutput": "NOT_ADMITTED"
              },
              {
                  "input": "true 0",
                  "expectedOutput": "ADMITTED"
              },
              {
                  "input": "false 0",
                  "expectedOutput": "NOT_ADMITTED"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Check invitation || points >= 100.\n• Output ADMITTED or NOT_ADMITTED."
      },
      {
          "id": "java-cs-30",
          "number": "05",
          "title": "Signal Strength Analyzer",
          "slug": "signal-strength-analyzer",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A communication device measures its network signal strength as an integer from 0 to 100.\n\nThe device classifies the signal into four levels:\n\n| Signal Strength | Classification |\n|---|---|\n| 0 | NO_SIGNAL |\n| 1–39 | WEAK |\n| 40–79 | STABLE |\n| 80–100 | STRONG |\n\nWrite a program that determines the signal classification.",
          "inputFormat": "One integer S representing the signal strength.",
          "outputFormat": "Print the corresponding classification exactly as shown in the table.",
          "constraints": "0 ≤ S ≤ 100\nImportant: Carefully handle the boundaries 0, 1, 39, 40, 79, 80, and 100.",
          "sampleTestCases": [
              {
                  "input": "79",
                  "expectedOutput": "STABLE",
                  "explanation": "79 falls in the 40–79 range, which is STABLE."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "79",
                  "expectedOutput": "STABLE"
              },
              {
                  "input": "0",
                  "expectedOutput": "NO_SIGNAL"
              },
              {
                  "input": "1",
                  "expectedOutput": "WEAK"
              },
              {
                  "input": "39",
                  "expectedOutput": "WEAK"
              },
              {
                  "input": "40",
                  "expectedOutput": "STABLE"
              },
              {
                  "input": "80",
                  "expectedOutput": "STRONG"
              },
              {
                  "input": "100",
                  "expectedOutput": "STRONG"
              },
              {
                  "input": "25",
                  "expectedOutput": "WEAK"
              },
              {
                  "input": "95",
                  "expectedOutput": "STRONG"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• 0: NO_SIGNAL\n• 1–39: WEAK\n• 40–79: STABLE\n• 80–100: STRONG"
      },
      {
          "id": "java-cs-31",
          "number": "06",
          "title": "Parcel Handling Priority",
          "slug": "parcel-handling-priority",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A delivery warehouse categorizes parcels based on weight and fragility.\n\nThe warehouse follows these rules in priority order:\n\n1. If a parcel weighs more than 25 kg, it requires heavy lifting.\n2. Otherwise, if the parcel is fragile, it requires special care.\n3. All other parcels receive regular handling.\n\nA heavy parcel always receives the heavy-lifting classification, even if it is fragile.\n\nWrite a Java program to determine the correct handling category.",
          "inputFormat": "Two values:\nweight fragile\n\nWhere:\n- weight = Integer weight in kilograms\n- fragile = Boolean (true or false)",
          "outputFormat": "Print exactly one of:\n- HEAVY_LIFT\n- HANDLE_WITH_CARE\n- REGULAR",
          "constraints": "0 ≤ weight ≤ 100\nfragile is a Boolean value.",
          "sampleTestCases": [
              {
                  "input": "18 true",
                  "expectedOutput": "HANDLE_WITH_CARE",
                  "explanation": "Weight is ≤ 25 kg and fragile is true."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "18 true",
                  "expectedOutput": "HANDLE_WITH_CARE"
              },
              {
                  "input": "30 false",
                  "expectedOutput": "HEAVY_LIFT"
              },
              {
                  "input": "30 true",
                  "expectedOutput": "HEAVY_LIFT"
              },
              {
                  "input": "25 true",
                  "expectedOutput": "HANDLE_WITH_CARE"
              },
              {
                  "input": "25 false",
                  "expectedOutput": "REGULAR"
              },
              {
                  "input": "26 false",
                  "expectedOutput": "HEAVY_LIFT"
              },
              {
                  "input": "5 false",
                  "expectedOutput": "REGULAR"
              },
              {
                  "input": "100 true",
                  "expectedOutput": "HEAVY_LIFT"
              },
              {
                  "input": "0 true",
                  "expectedOutput": "HANDLE_WITH_CARE"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Priority 1: weight > 25 -> HEAVY_LIFT\n• Priority 2: fragile -> HANDLE_WITH_CARE\n• Else: REGULAR"
      },
      {
          "id": "java-cs-32",
          "number": "07",
          "title": "Data Center Alert System",
          "slug": "data-center-alert-system",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A data center continuously monitors the temperature of its server room and the rotational speed of its cooling fan.\n\nThe monitoring system must issue one of three alerts.\n\nAlert Rules:\n\nEMERGENCY:\nIf at least one of the following conditions is true:\n- Temperature is 90°C or higher.\n- Fan speed is below 500 RPM.\n\nWARNING:\nIf there is no emergency, but at least one of the following conditions is true:\n- Temperature is 75°C or higher.\n- Fan speed is below 900 RPM.\n\nNORMAL:\nIf neither emergency nor warning conditions are met.\n\nEmergency alerts always take priority over warnings.",
          "inputFormat": "Two integers:\ntemperature fanSpeed",
          "outputFormat": "Print exactly one of:\n- EMERGENCY\n- WARNING\n- NORMAL",
          "constraints": "0 ≤ temperature ≤ 120\n0 ≤ fanSpeed ≤ 3000",
          "sampleTestCases": [
              {
                  "input": "82 1100",
                  "expectedOutput": "WARNING",
                  "explanation": "No emergency (82 < 90 and 1100 >= 500), but temperature is 82 (>= 75)."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "82 1100",
                  "expectedOutput": "WARNING"
              },
              {
                  "input": "90 1200",
                  "expectedOutput": "EMERGENCY"
              },
              {
                  "input": "70 450",
                  "expectedOutput": "EMERGENCY"
              },
              {
                  "input": "95 400",
                  "expectedOutput": "EMERGENCY"
              },
              {
                  "input": "75 1000",
                  "expectedOutput": "WARNING"
              },
              {
                  "input": "70 899",
                  "expectedOutput": "WARNING"
              },
              {
                  "input": "74 900",
                  "expectedOutput": "NORMAL"
              },
              {
                  "input": "70 1500",
                  "expectedOutput": "NORMAL"
              },
              {
                  "input": "0 3000",
                  "expectedOutput": "NORMAL"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• EMERGENCY: temp >= 90 || fan < 500\n• WARNING: temp >= 75 || fan < 900\n• NORMAL: otherwise"
      },
      {
          "id": "java-cs-33",
          "number": "08",
          "title": "Drone Compass Command",
          "slug": "drone-compass-command",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A drone receives a single-letter direction command from its control station.\n\nThe command determines the direction in which the drone should move.\n\nThe controller recognizes four uppercase commands:\n\n| Command | Action |\n|---|---|\n| N | GO_NORTH |\n| S | GO_SOUTH |\n| E | GO_EAST |\n| W | GO_WEST |\n\nAny other character must be treated as an invalid command.\n\nWrite a Java program to translate the command into the appropriate action.",
          "inputFormat": "A single non-whitespace character.",
          "outputFormat": "Print the corresponding action or:\nINVALID_DIRECTION",
          "constraints": "The input contains exactly one non-whitespace character.\nNote: Commands are case-sensitive. Lowercase letters are not valid commands.",
          "sampleTestCases": [
              {
                  "input": "W",
                  "expectedOutput": "GO_WEST",
                  "explanation": "W maps to GO_WEST."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "W",
                  "expectedOutput": "GO_WEST"
              },
              {
                  "input": "N",
                  "expectedOutput": "GO_NORTH"
              },
              {
                  "input": "S",
                  "expectedOutput": "GO_SOUTH"
              },
              {
                  "input": "E",
                  "expectedOutput": "GO_EAST"
              },
              {
                  "input": "w",
                  "expectedOutput": "INVALID_DIRECTION"
              },
              {
                  "input": "n",
                  "expectedOutput": "INVALID_DIRECTION"
              },
              {
                  "input": "X",
                  "expectedOutput": "INVALID_DIRECTION"
              },
              {
                  "input": "?",
                  "expectedOutput": "INVALID_DIRECTION"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Use switch on char or String.\n• N: GO_NORTH, S: GO_SOUTH, E: GO_EAST, W: GO_WEST\n• default: INVALID_DIRECTION"
      },
      {
          "id": "java-cs-34",
          "number": "09",
          "title": "Parking Zone Fee",
          "slug": "parking-zone-fee",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A city provides three parking zones, each with a different hourly rate.\n\nThe parking rates are:\n\n| Zone | Hourly Fee |\n|---|---|\n| 1 | 5 SAR |\n| 2 | 8 SAR |\n| 3 | 12 SAR |\n\nA driver provides a parking zone number and the number of hours parked.\n\nCalculate the total parking fee.\n\nIf the zone number does not correspond to an available parking zone, print an error message instead.",
          "inputFormat": "Two integers:\nzone hours",
          "outputFormat": "For a valid zone, print:\nFee: X\n\nWhere X is the total fee in SAR.\n\nFor an invalid zone, print:\nINVALID_ZONE",
          "constraints": "0 ≤ zone ≤ 10\n1 ≤ hours ≤ 24",
          "sampleTestCases": [
              {
                  "input": "2 4",
                  "expectedOutput": "Fee: 32",
                  "explanation": "Zone 2 costs 8 SAR/hour. For 4 hours: 8 * 4 = 32 SAR."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "2 4",
                  "expectedOutput": "Fee: 32"
              },
              {
                  "input": "1 1",
                  "expectedOutput": "Fee: 5"
              },
              {
                  "input": "1 24",
                  "expectedOutput": "Fee: 120"
              },
              {
                  "input": "2 10",
                  "expectedOutput": "Fee: 80"
              },
              {
                  "input": "3 3",
                  "expectedOutput": "Fee: 36"
              },
              {
                  "input": "3 24",
                  "expectedOutput": "Fee: 288"
              },
              {
                  "input": "0 5",
                  "expectedOutput": "INVALID_ZONE"
              },
              {
                  "input": "4 2",
                  "expectedOutput": "INVALID_ZONE"
              },
              {
                  "input": "10 1",
                  "expectedOutput": "INVALID_ZONE"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Zone 1: 5 * hours\n• Zone 2: 8 * hours\n• Zone 3: 12 * hours\n• Other: INVALID_ZONE"
      },
      {
          "id": "java-cs-35",
          "number": "10",
          "title": "Space Launch Checklist",
          "slug": "space-launch-checklist",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Hard",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A space research center is preparing to launch a small experimental rocket.\n\nBefore launch, the control system must verify three requirements:\n\n- Official launch permission has been granted.\n- Fuel level is at least 70%.\n- Wind speed is not greater than 40 km/h.\n\nThe system checks these requirements in a strict order.\n\nDecision Rules:\n1. If launch permission is missing, display PERMIT_MISSING.\n2. Otherwise, if the fuel level is below 70, display REFUEL_REQUIRED.\n3. Otherwise, if the wind speed is greater than 40, display WEATHER_HOLD.\n4. If every requirement is satisfied, display CLEARED_TO_LAUNCH.\n\nOnly one message should be printed.",
          "inputFormat": "Three values:\nfuel windSpeed permission\n\nWhere:\n- fuel = Integer fuel percentage\n- windSpeed = Integer wind speed\n- permission = Boolean (true or false)",
          "outputFormat": "Print exactly one of:\n- PERMIT_MISSING\n- REFUEL_REQUIRED\n- WEATHER_HOLD\n- CLEARED_TO_LAUNCH",
          "constraints": "0 ≤ fuel ≤ 100\n0 ≤ windSpeed ≤ 200\npermission is a Boolean value.\nImportant: The order of checks matters. A missing permit takes priority over all other failures.",
          "sampleTestCases": [
              {
                  "input": "85 30 true",
                  "expectedOutput": "CLEARED_TO_LAUNCH",
                  "explanation": "Permission is granted, fuel 85 ≥ 70, wind 30 ≤ 40."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "85 30 true",
                  "expectedOutput": "CLEARED_TO_LAUNCH"
              },
              {
                  "input": "85 30 false",
                  "expectedOutput": "PERMIT_MISSING"
              },
              {
                  "input": "50 20 false",
                  "expectedOutput": "PERMIT_MISSING"
              },
              {
                  "input": "60 50 false",
                  "expectedOutput": "PERMIT_MISSING"
              },
              {
                  "input": "69 25 true",
                  "expectedOutput": "REFUEL_REQUIRED"
              },
              {
                  "input": "50 60 true",
                  "expectedOutput": "REFUEL_REQUIRED"
              },
              {
                  "input": "70 41 true",
                  "expectedOutput": "WEATHER_HOLD"
              },
              {
                  "input": "70 40 true",
                  "expectedOutput": "CLEARED_TO_LAUNCH"
              },
              {
                  "input": "100 0 true",
                  "expectedOutput": "CLEARED_TO_LAUNCH"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Priority 1: !permission -> PERMIT_MISSING\n• Priority 2: fuel < 70 -> REFUEL_REQUIRED\n• Priority 3: windSpeed > 40 -> WEATHER_HOLD\n• Else: CLEARED_TO_LAUNCH"
      },
      {
          "id": "java-cs-36",
          "number": "11",
          "title": "Museum Pass Calculator",
          "slug": "museum-pass-calculator",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Hard",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A science museum offers three types of visitor passes.\n\nEach pass has a different base price:\n\n| Pass Type | Base Price |\n|---|---|\n| 1 — Basic | 80 SAR |\n| 2 — Explorer | 140 SAR |\n| 3 — Premium | 220 SAR |\n\nThe museum also follows these rules:\n- Weekend visits have an additional charge of 20 SAR.\n- Visitors with a valid coupon receive a 25% discount.\n- The coupon discount is applied after adding the weekend charge.\n\nWrite a Java program that calculates the final amount a visitor must pay.\n\nIf an invalid pass type is entered, display INVALID_PASS.",
          "inputFormat": "Three values:\npassType weekend coupon\n\nWhere:\n- passType = Integer\n- weekend = Boolean (true or false)\n- coupon = Boolean (true or false)",
          "outputFormat": "For valid passes, print the final payment with exactly two digits after the decimal point:\nPay: X.XX\n\nFor invalid passes, print:\nINVALID_PASS",
          "constraints": "0 ≤ passType ≤ 10\nweekend and coupon are Boolean values.\nImportant: Use decimal arithmetic and ensure the output always contains exactly two decimal places.",
          "sampleTestCases": [
              {
                  "input": "2 true true",
                  "expectedOutput": "Pay: 120.00",
                  "explanation": "Explorer pass = 140 SAR. Weekend = +20 SAR (160 SAR). 25% discount on 160 = 120.00 SAR."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "2 true true",
                  "expectedOutput": "Pay: 120.00"
              },
              {
                  "input": "1 false false",
                  "expectedOutput": "Pay: 80.00"
              },
              {
                  "input": "1 true false",
                  "expectedOutput": "Pay: 100.00"
              },
              {
                  "input": "1 false true",
                  "expectedOutput": "Pay: 60.00"
              },
              {
                  "input": "1 true true",
                  "expectedOutput": "Pay: 75.00"
              },
              {
                  "input": "3 false false",
                  "expectedOutput": "Pay: 220.00"
              },
              {
                  "input": "3 true false",
                  "expectedOutput": "Pay: 240.00"
              },
              {
                  "input": "3 true true",
                  "expectedOutput": "Pay: 180.00"
              },
              {
                  "input": "0 false false",
                  "expectedOutput": "INVALID_PASS"
              },
              {
                  "input": "4 true true",
                  "expectedOutput": "INVALID_PASS"
              }
          ],
          "starterCode": "import java.util.Scanner;\nimport java.util.Locale;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• 1: 80, 2: 140, 3: 220. Other: INVALID_PASS\n• Add 20 if weekend.\n• Discount 25% if coupon.\n• Format: Pay: %.2f using Locale.US"
      },
      {
          "id": "java-cs-37",
          "number": "12",
          "title": "Warehouse Sorting Terminal",
          "slug": "warehouse-sorting-terminal",
          "language": "Java",
          "categorySlug": "conditional-statements",
          "difficulty": "Hard",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "An automated warehouse uses a sorting terminal to assign delivery items to appropriate processing lanes.\n\nThe terminal receives three properties of an item:\n- Weight in kilograms\n- Length in centimeters\n- Whether the item is fragile\n\nThe warehouse follows these classification rules in priority order:\n\nRule 1 — Manual Review:\nIf the item's weight exceeds 50 kg OR its length exceeds 200 cm, classify it as:\nMANUAL_REVIEW\n\nRule 2 — Heavy Protected Handling:\nOtherwise, if the item is fragile AND its weight exceeds 10 kg, classify it as:\nHEAVY_PROTECTED\n\nRule 3 — Protected Handling:\nOtherwise, if the item is fragile, classify it as:\nPROTECTED\n\nRule 4 — Fast Lane:\nOtherwise, if the item weighs at most 5 kg AND its length is at most 50 cm, classify it as:\nFAST_LANE\n\nRule 5 — Standard Handling:\nAll remaining items belong to:\nSTANDARD\n\nWrite a Java program that prints the item's final classification.\nOnly the first matching rule should determine the result.",
          "inputFormat": "Three values:\nweight length fragile\n\nWhere:\n- weight = Integer weight in kilograms\n- length = Integer length in centimeters\n- fragile = Boolean (true or false)",
          "outputFormat": "Print exactly one of:\n- MANUAL_REVIEW\n- HEAVY_PROTECTED\n- PROTECTED\n- FAST_LANE\n- STANDARD",
          "constraints": "0 ≤ weight ≤ 100\n0 ≤ length ≤ 500\nfragile is a Boolean value.\nImportant: Classification priority must be respected. An item requiring manual review must not be placed into another category.",
          "sampleTestCases": [
              {
                  "input": "12 120 true",
                  "expectedOutput": "HEAVY_PROTECTED",
                  "explanation": "Weight 12 ≤ 50, Length 120 ≤ 200. Fragile is true and weight 12 > 10, so HEAVY_PROTECTED."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "12 120 true",
                  "expectedOutput": "HEAVY_PROTECTED"
              },
              {
                  "input": "55 100 false",
                  "expectedOutput": "MANUAL_REVIEW"
              },
              {
                  "input": "30 250 true",
                  "expectedOutput": "MANUAL_REVIEW"
              },
              {
                  "input": "8 100 true",
                  "expectedOutput": "PROTECTED"
              },
              {
                  "input": "10 100 true",
                  "expectedOutput": "PROTECTED"
              },
              {
                  "input": "11 100 true",
                  "expectedOutput": "HEAVY_PROTECTED"
              },
              {
                  "input": "4 40 false",
                  "expectedOutput": "FAST_LANE"
              },
              {
                  "input": "5 50 false",
                  "expectedOutput": "FAST_LANE"
              },
              {
                  "input": "6 40 false",
                  "expectedOutput": "STANDARD"
              },
              {
                  "input": "4 60 false",
                  "expectedOutput": "STANDARD"
              },
              {
                  "input": "50 200 false",
                  "expectedOutput": "STANDARD"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Priority 1: weight > 50 || length > 200 -> MANUAL_REVIEW\n• Priority 2: fragile && weight > 10 -> HEAVY_PROTECTED\n• Priority 3: fragile -> PROTECTED\n• Priority 4: weight <= 5 && length <= 50 -> FAST_LANE\n• Else: STANDARD"
      }
  ],
  'strings-manipulation': [
      {
          "id": "java-str-42",
          "number": "01",
          "title": "Poster Width Counter",
          "slug": "poster-width-counter",
          "language": "Java",
          "categorySlug": "strings-manipulation",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A designer is preparing a short text banner for a digital display.\n\nThe display system needs to know the number of characters in the message before showing it.\n\nEvery letter, digit, symbol, and space counts as one character.\n\nWrite a Java program to determine the total number of characters in the banner.",
          "inputFormat": "One line containing the banner text.",
          "outputFormat": "Print:\nCharacters: X",
          "constraints": "1 ≤ Length of text ≤ 200\nThe input contains printable ASCII characters.\nThere are no leading or trailing spaces.",
          "sampleTestCases": [
              {
                  "input": "Blue sky ahead",
                  "expectedOutput": "Characters: 14",
                  "explanation": "\"Blue sky ahead\" contains 14 characters including spaces."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "Blue sky ahead",
                  "expectedOutput": "Characters: 14"
              },
              {
                  "input": "A",
                  "expectedOutput": "Characters: 1"
              },
              {
                  "input": "Hello World!",
                  "expectedOutput": "Characters: 12"
              },
              {
                  "input": "Java 2026: Code & Learn",
                  "expectedOutput": "Characters: 23"
              },
              {
                  "input": "One two three four five",
                  "expectedOutput": "Characters: 23"
              },
              {
                  "input": "1234567890",
                  "expectedOutput": "Characters: 10"
              },
              {
                  "input": "Spaced   out   words",
                  "expectedOutput": "Characters: 20"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Read entire line with scanner.nextLine().\n• Output length using text.length()."
      },
      {
          "id": "java-str-43",
          "number": "02",
          "title": "Treasure Symbol Locator",
          "slug": "treasure-symbol-locator",
          "language": "Java",
          "categorySlug": "strings-manipulation",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "An adventure game stores a secret codeword.\n\nTo unlock a treasure chest, the player must identify the character located at a particular position in the codeword.\n\nJava string indexing starts from zero.\n\nWrite a program that reads the codeword and a valid index, then displays the character at that position.",
          "inputFormat": "The first line contains a codeword S.\nThe second line contains an integer K representing the zero-based index.",
          "outputFormat": "Print:\nLetter: X\n\nWhere X is the character at index K.",
          "constraints": "1 ≤ Length of S ≤ 100\n0 ≤ K < Length of S\nS contains only uppercase English letters.",
          "sampleTestCases": [
              {
                  "input": "ORBIT\n2",
                  "expectedOutput": "Letter: B",
                  "explanation": "In \"ORBIT\", index 0 is O, 1 is R, 2 is B."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "ORBIT\n2",
                  "expectedOutput": "Letter: B"
              },
              {
                  "input": "JAVA\n0",
                  "expectedOutput": "Letter: J"
              },
              {
                  "input": "JAVA\n3",
                  "expectedOutput": "Letter: A"
              },
              {
                  "input": "X\n0",
                  "expectedOutput": "Letter: X"
              },
              {
                  "input": "TREASURE\n4",
                  "expectedOutput": "Letter: S"
              },
              {
                  "input": "DIAMOND\n6",
                  "expectedOutput": "Letter: D"
              },
              {
                  "input": "EXPEDITION\n5",
                  "expectedOutput": "Letter: I"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Read S, then K.\n• Use S.charAt(K)."
      },
      {
          "id": "java-str-44",
          "number": "03",
          "title": "Library Keyword Search",
          "slug": "library-keyword-search",
          "language": "Java",
          "categorySlug": "strings-manipulation",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A digital library stores a short description of a book.\n\nA student wants to find the first position where a particular search word appears in the description.\n\nWrite a program that finds the starting index of the first occurrence of the search word.\n\nIf the word is not present, report -1.\n\nThe search must be case-sensitive.",
          "inputFormat": "The first line contains the description S.\nThe second line contains the search word W.",
          "outputFormat": "Print:\nIndex: X\n\nWhere X is the zero-based starting index or -1 if the word is not found.",
          "constraints": "1 ≤ Length of S ≤ 200\n1 ≤ Length of W ≤ 50\nBoth inputs contain printable ASCII characters.\nThe search word is non-empty.",
          "sampleTestCases": [
              {
                  "input": "Meet at north gate\nnorth",
                  "expectedOutput": "Index: 8",
                  "explanation": "\"north\" starts at index 8 in \"Meet at north gate\"."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "Meet at north gate\nnorth",
                  "expectedOutput": "Index: 8"
              },
              {
                  "input": "north gate at noon\nnorth",
                  "expectedOutput": "Index: 0"
              },
              {
                  "input": "The gate is north\nnorth",
                  "expectedOutput": "Index: 12"
              },
              {
                  "input": "Meet at north gate\nNorth",
                  "expectedOutput": "Index: -1"
              },
              {
                  "input": "The secret history of Rome\ngreece",
                  "expectedOutput": "Index: -1"
              },
              {
                  "input": "cat and caterpillar\ncat",
                  "expectedOutput": "Index: 0"
              },
              {
                  "input": "Learn Java programming today\nJava",
                  "expectedOutput": "Index: 6"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Read line S and line W using nextLine().\n• Use S.indexOf(W)."
      },
      {
          "id": "java-str-45",
          "number": "04",
          "title": "Shipping Label Split",
          "slug": "shipping-label-split",
          "language": "Java",
          "categorySlug": "strings-manipulation",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A shipping company generates package identifiers containing two parts separated by a hyphen.\n\nThe first part represents the delivery area.\nThe second part represents the package serial number.\n\nFor example:\nZONE-4582\n\ncontains the delivery area ZONE and serial number 4582.\n\nWrite a program that extracts these two components.",
          "inputFormat": "One line containing the package identifier.",
          "outputFormat": "Print:\nArea: X\nSerial: Y",
          "constraints": "3 ≤ Length of identifier ≤ 100\nThe identifier contains exactly one hyphen.\nAt least one character appears on each side of the hyphen.\nThe remaining characters are uppercase English letters or digits.",
          "sampleTestCases": [
              {
                  "input": "ZONE-4582",
                  "expectedOutput": "Area: ZONE\nSerial: 4582",
                  "explanation": "Split at hyphen: Area is ZONE, Serial is 4582."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "ZONE-4582",
                  "expectedOutput": "Area: ZONE\nSerial: 4582"
              },
              {
                  "input": "A-1",
                  "expectedOutput": "Area: A\nSerial: 1"
              },
              {
                  "input": "NORTHWEST-99210",
                  "expectedOutput": "Area: NORTHWEST\nSerial: 99210"
              },
              {
                  "input": "HUB-X",
                  "expectedOutput": "Area: HUB\nSerial: X"
              },
              {
                  "input": "REGION7-PKG882",
                  "expectedOutput": "Area: REGION7\nSerial: PKG882"
              },
              {
                  "input": "PARCEL-001",
                  "expectedOutput": "Area: PARCEL\nSerial: 001"
              },
              {
                  "input": "CARGO-A99B88",
                  "expectedOutput": "Area: CARGO\nSerial: A99B88"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Find index of \"-\": int idx = s.indexOf(\"-\");\n• Area: s.substring(0, idx)\n• Serial: s.substring(idx + 1)"
      },
      {
          "id": "java-str-46",
          "number": "05",
          "title": "Festival Announcement Modes",
          "slug": "festival-announcement-modes",
          "language": "Java",
          "categorySlug": "strings-manipulation",
          "difficulty": "Easy",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A digital festival board supports two display styles.\n\nThe first style, called SHOUT, displays the entire announcement using uppercase letters.\nThe second style, called WHISPER, displays the announcement using lowercase letters.\n\nWrite a Java program that generates both versions of a given announcement.",
          "inputFormat": "One line containing the announcement.",
          "outputFormat": "Print:\nSHOUT: X\nWHISPER: Y",
          "constraints": "1 ≤ Length of announcement ≤ 200\nThe announcement contains English letters, digits, spaces, and common punctuation.",
          "sampleTestCases": [
              {
                  "input": "Java Is Fun",
                  "expectedOutput": "SHOUT: JAVA IS FUN\nWHISPER: java is fun",
                  "explanation": "Uppercase is \"JAVA IS FUN\", lowercase is \"java is fun\"."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "Java Is Fun",
                  "expectedOutput": "SHOUT: JAVA IS FUN\nWHISPER: java is fun"
              },
              {
                  "input": "WELCOME!",
                  "expectedOutput": "SHOUT: WELCOME!\nWHISPER: welcome!"
              },
              {
                  "input": "good morning 2026",
                  "expectedOutput": "SHOUT: GOOD MORNING 2026\nWHISPER: good morning 2026"
              },
              {
                  "input": "Music & Lights Fest: 7 PM",
                  "expectedOutput": "SHOUT: MUSIC & LIGHTS FEST: 7 PM\nWHISPER: music & lights fest: 7 pm"
              },
              {
                  "input": "Code. Create. Repeat.",
                  "expectedOutput": "SHOUT: CODE. CREATE. REPEAT.\nWHISPER: code. create. repeat."
              },
              {
                  "input": "A",
                  "expectedOutput": "SHOUT: A\nWHISPER: a"
              },
              {
                  "input": "123 456!",
                  "expectedOutput": "SHOUT: 123 456!\nWHISPER: 123 456!"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Use s.toUpperCase() and s.toLowerCase()."
      },
      {
          "id": "java-str-47",
          "number": "06",
          "title": "Team Code Equality",
          "slug": "team-code-equality",
          "language": "Java",
          "categorySlug": "strings-manipulation",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "An online tournament uses unique team access codes.\n\nA team captain enters an access code, and the registration system compares it with the official code.\n\nThe comparison must be case-sensitive.\n\nTwo codes are considered equal only when all characters match exactly, including capitalization.\n\nWrite a program to determine whether the entered code matches the official one.",
          "inputFormat": "Two lines:\n- First line: Official team code\n- Second line: Entered team code",
          "outputFormat": "Print MATCH if the two codes are identical.\nOtherwise, print DIFFERENT.",
          "constraints": "1 ≤ Length of each code ≤ 100\nCodes contain only English letters and digits.",
          "sampleTestCases": [
              {
                  "input": "SkyFox\nskyfox",
                  "expectedOutput": "DIFFERENT",
                  "explanation": "Capitalization differs (\"SkyFox\" vs \"skyfox\")."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "SkyFox\nskyfox",
                  "expectedOutput": "DIFFERENT"
              },
              {
                  "input": "ALPHA1\nALPHA1",
                  "expectedOutput": "MATCH"
              },
              {
                  "input": "TIGER\nLION",
                  "expectedOutput": "DIFFERENT"
              },
              {
                  "input": "CODE\nCODES",
                  "expectedOutput": "DIFFERENT"
              },
              {
                  "input": "Z\nZ",
                  "expectedOutput": "MATCH"
              },
              {
                  "input": "Z\nz",
                  "expectedOutput": "DIFFERENT"
              },
              {
                  "input": "TEAM2026\nTEAM2026",
                  "expectedOutput": "MATCH"
              },
              {
                  "input": "Cyber99\nCyber99",
                  "expectedOutput": "MATCH"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Use code1.equals(code2) for case-sensitive equality.\n• Print MATCH or DIFFERENT."
      },
      {
          "id": "java-str-48",
          "number": "07",
          "title": "Creator Handle Generator",
          "slug": "creator-handle-generator",
          "language": "Java",
          "categorySlug": "strings-manipulation",
          "difficulty": "Medium",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A content creation platform wants to generate simple usernames automatically.\n\nEach creator provides a first name and a last name.\n\nThe platform creates a handle using the following format:\n@firstname.lastname\n\nBoth names must appear in lowercase.\n\nWrite a Java program that generates the handle.",
          "inputFormat": "Two space-separated words:\nfirstName lastName",
          "outputFormat": "Print:\nTag: X\n\nWhere X is the generated username.",
          "constraints": "1 ≤ Length of each name ≤ 30\nNames contain only English letters.",
          "sampleTestCases": [
              {
                  "input": "Mira Stone",
                  "expectedOutput": "Tag: @mira.stone",
                  "explanation": "Mira -> mira, Stone -> stone. Handle: @mira.stone."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "Mira Stone",
                  "expectedOutput": "Tag: @mira.stone"
              },
              {
                  "input": "john doe",
                  "expectedOutput": "Tag: @john.doe"
              },
              {
                  "input": "ALICE SMITH",
                  "expectedOutput": "Tag: @alice.smith"
              },
              {
                  "input": "A B",
                  "expectedOutput": "Tag: @a.b"
              },
              {
                  "input": "Christopher Alexander",
                  "expectedOutput": "Tag: @christopher.alexander"
              },
              {
                  "input": "MC Hammer",
                  "expectedOutput": "Tag: @mc.hammer"
              },
              {
                  "input": "Dev Prodigy",
                  "expectedOutput": "Tag: @dev.prodigy"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• Read first and last name with scanner.next().\n• Convert to lowercase and concatenate: \"@\" + first.toLowerCase() + \".\" + last.toLowerCase()"
      },
      {
          "id": "java-str-49",
          "number": "08",
          "title": "Emergency Bulletin Classifier",
          "slug": "emergency-bulletin-classifier",
          "language": "Java",
          "categorySlug": "strings-manipulation",
          "difficulty": "Hard",
          "problemType": "lugaish",
          "sourcePlatform": "Lugaish",
          "description": "A city information system examines incoming public safety messages.\n\nThe system searches for the word sequence DANGER, ignoring differences between uppercase and lowercase letters.\n\nIt then classifies the message according to the following rules:\n\nClassification Rules:\n1. If the message contains DANGER and its total character count is at least 15, print HIGH_PRIORITY.\n2. If the message contains DANGER but its character count is less than 15, print SHORT_ALERT.\n3. If the message does not contain DANGER, print NORMAL.\n\nThe search is based on the character sequence DANGER, not word boundaries.\nSpaces count toward the message length.",
          "inputFormat": "One line containing a message S.",
          "outputFormat": "Print exactly one of:\n- HIGH_PRIORITY\n- SHORT_ALERT\n- NORMAL",
          "constraints": "1 ≤ Length of S ≤ 200\nThe message contains printable ASCII characters.\nThere are no leading or trailing spaces.",
          "sampleTestCases": [
              {
                  "input": "Danger near the bridge",
                  "expectedOutput": "HIGH_PRIORITY",
                  "explanation": "Contains \"Danger\" (case-insensitive DANGER) and total length is 22 (≥ 15)."
              }
          ],
          "hiddenTestCases": [
              {
                  "input": "Danger near the bridge",
                  "expectedOutput": "HIGH_PRIORITY"
              },
              {
                  "input": "DANGER alert",
                  "expectedOutput": "SHORT_ALERT"
              },
              {
                  "input": "danger now",
                  "expectedOutput": "SHORT_ALERT"
              },
              {
                  "input": "All roads clear and open",
                  "expectedOutput": "NORMAL"
              },
              {
                  "input": "Storm approaching city center",
                  "expectedOutput": "NORMAL"
              },
              {
                  "input": "DANGER 12345678",
                  "expectedOutput": "HIGH_PRIORITY"
              },
              {
                  "input": "DANGER 1234567",
                  "expectedOutput": "SHORT_ALERT"
              },
              {
                  "input": "ENDANGERED SPECIES FOUND HERE",
                  "expectedOutput": "HIGH_PRIORITY"
              },
              {
                  "input": "Quiet day",
                  "expectedOutput": "NORMAL"
              }
          ],
          "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
          "timeLimit": 3,
          "memoryLimit": 128000,
          "notes": "• boolean hasDanger = s.toUpperCase().contains(\"DANGER\");\n• if (hasDanger && s.length() >= 15) -> HIGH_PRIORITY\n• else if (hasDanger) -> SHORT_ALERT\n• else -> NORMAL"
      }
  ],
  "loops-iterations": [
    {
        "id": "java-loop-50",
        "number": "01",
        "title": "Rocket Launch Countdown",
        "slug": "rocket-launch-countdown",
        "language": "Java",
        "categorySlug": "loops-iterations",
        "difficulty": "Easy",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "For Loop, Decrement",
        "description": "A space research club is preparing a small model rocket for launch.\n\nBefore launching, the control screen must display a countdown starting from N and ending at 1.\n\nWrite a Java program that generates the countdown automatically.",
        "inputFormat": "One positive integer N.",
        "outputFormat": "Print all integers from N down to 1 on one line, separated by a single space.",
        "constraints": "1 ≤ N ≤ 1000",
        "sampleTestCases": [
            {
                "input": "5",
                "expectedOutput": "5 4 3 2 1",
                "explanation": "Countdown begins at 5 and counts down to 1 separated by spaces."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Use a for loop starting at N and decrementing by 1 (i--) until i reaches 1.\\n• Print elements on a single line separated by spaces.",
        "hiddenTestCases": [
            {
                "input": "1",
                "expectedOutput": "1"
            },
            {
                "input": "2",
                "expectedOutput": "2 1"
            },
            {
                "input": "3",
                "expectedOutput": "3 2 1"
            },
            {
                "input": "7",
                "expectedOutput": "7 6 5 4 3 2 1"
            },
            {
                "input": "10",
                "expectedOutput": "10 9 8 7 6 5 4 3 2 1"
            },
            {
                "input": "15",
                "expectedOutput": "15 14 13 12 11 10 9 8 7 6 5 4 3 2 1"
            },
            {
                "input": "25",
                "expectedOutput": "25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1"
            },
            {
                "input": "50",
                "expectedOutput": "50 49 48 47 46 45 44 43 42 41 40 39 38 37 36 35 34 33 32 31 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1"
            },
            {
                "input": "100",
                "expectedOutput": "100 99 98 97 96 95 94 93 92 91 90 89 88 87 86 85 84 83 82 81 80 79 78 77 76 75 74 73 72 71 70 69 68 67 66 65 64 63 62 61 60 59 58 57 56 55 54 53 52 51 50 49 48 47 46 45 44 43 42 41 40 39 38 37 36 35 34 33 32 31 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1"
            }
        ]
    },
    {
        "id": "java-loop-51",
        "number": "02",
        "title": "Every Third Lamp",
        "slug": "every-third-lamp",
        "language": "Java",
        "categorySlug": "loops-iterations",
        "difficulty": "Easy",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "For Loop, Modulus, Conditional Statements",
        "description": "A long corridor contains N lamps numbered from 1 to N.\n\nAn automatic maintenance system must inspect every lamp whose number is divisible by 3.\n\nWrite a program to display the numbers of all lamps requiring inspection.\n\nIf no lamp qualifies, display NONE.",
        "inputFormat": "One positive integer N.",
        "outputFormat": "Print the qualifying lamp numbers in ascending order, separated by a single space. If there are no qualifying lamps, print NONE.",
        "constraints": "1 ≤ N ≤ 1000",
        "sampleTestCases": [
            {
                "input": "11",
                "expectedOutput": "3 6 9",
                "explanation": "Lamps 3, 6, and 9 are less than or equal to 11 and divisible by 3."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Check each lamp number i from 1 to N using the modulo operator (i % 3 == 0).\\n• If no lamp qualifies (when N < 3), print NONE.",
        "hiddenTestCases": [
            {
                "input": "1",
                "expectedOutput": "NONE"
            },
            {
                "input": "2",
                "expectedOutput": "NONE"
            },
            {
                "input": "3",
                "expectedOutput": "3"
            },
            {
                "input": "5",
                "expectedOutput": "3"
            },
            {
                "input": "6",
                "expectedOutput": "3 6"
            },
            {
                "input": "12",
                "expectedOutput": "3 6 9 12"
            },
            {
                "input": "20",
                "expectedOutput": "3 6 9 12 15 18"
            },
            {
                "input": "30",
                "expectedOutput": "3 6 9 12 15 18 21 24 27 30"
            },
            {
                "input": "50",
                "expectedOutput": "3 6 9 12 15 18 21 24 27 30 33 36 39 42 45 48"
            }
        ]
    },
    {
        "id": "java-loop-52",
        "number": "03",
        "title": "The Growing Coin Jar",
        "slug": "the-growing-coin-jar",
        "language": "Java",
        "categorySlug": "loops-iterations",
        "difficulty": "Easy",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "For Loop, Accumulator, Multiplication",
        "description": "A student starts a creative saving challenge.\n\nOn day 1, the student adds 1 coin to a jar.\nOn day 2, the student adds 4 coins.\nOn day 3, the student adds 9 coins.\n\nThe number of coins added on day i is equal to i multiplied by i.\n\nCalculate the total number of coins saved after N days.",
        "inputFormat": "One positive integer N representing the number of days.",
        "outputFormat": "Print: Total Coins: X",
        "constraints": "1 ≤ N ≤ 100000",
        "sampleTestCases": [
            {
                "input": "4",
                "expectedOutput": "Total Coins: 30",
                "explanation": "Day 1 (1) + Day 2 (4) + Day 3 (9) + Day 4 (16) = 30 coins."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• For large N (up to 100,000), total coins will exceed the 32-bit integer limit (2^31 - 1).\\n• Use 64-bit integer type (long) for accumulator: long total = 0; total += (long) i * i;\\n• Print in exact format: Total Coins: X",
        "hiddenTestCases": [
            {
                "input": "1",
                "expectedOutput": "Total Coins: 1"
            },
            {
                "input": "2",
                "expectedOutput": "Total Coins: 5"
            },
            {
                "input": "3",
                "expectedOutput": "Total Coins: 14"
            },
            {
                "input": "5",
                "expectedOutput": "Total Coins: 55"
            },
            {
                "input": "10",
                "expectedOutput": "Total Coins: 385"
            },
            {
                "input": "50",
                "expectedOutput": "Total Coins: 42925"
            },
            {
                "input": "100",
                "expectedOutput": "Total Coins: 338350"
            },
            {
                "input": "1000",
                "expectedOutput": "Total Coins: 333833500"
            },
            {
                "input": "100000",
                "expectedOutput": "Total Coins: 333338333350000"
            }
        ]
    },
    {
        "id": "java-loop-53",
        "number": "04",
        "title": "Meteor Signal Monitor",
        "slug": "meteor-signal-monitor",
        "language": "Java",
        "categorySlug": "loops-iterations",
        "difficulty": "Easy",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "While Loop, Sentinel Input, Counting, Maximum Value",
        "description": "A meteor observation station receives signal strength readings one at a time.\n\nEach reading is an integer between 0 and 100.\nA reading is considered strong when its value is at least 70.\n\nThe station must determine:\n1. How many strong readings were received.\n2. The highest signal strength recorded.\n\nThe reading -1 indicates that data transmission has ended and must not be included.\nIf no readings were received, the highest signal strength is considered 0.",
        "inputFormat": "A sequence of integers ending with -1. The integers may appear on one or multiple lines.",
        "outputFormat": "Print:\\nStrong Signals: X\\nPeak Signal: Y",
        "constraints": "Each actual reading is between 0 and 100. The final value is always -1. There are at most 10000 actual readings. The input may contain no readings before -1.",
        "sampleTestCases": [
            {
                "input": "12 76 42 100 -1",
                "expectedOutput": "Strong Signals: 2\\nPeak Signal: 100",
                "explanation": "Readings 76 and 100 are >= 70 (2 strong). Highest reading is 100. -1 terminates the loop."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Use a while loop reading integers until encountering -1: while (sc.hasNextInt()) { int val = sc.nextInt(); if (val == -1) break; ... }\\n• If no valid readings precede -1, Peak Signal is 0 and Strong Signals is 0.",
        "hiddenTestCases": [
            {
                "input": "-1",
                "expectedOutput": "Strong Signals: 0\\nPeak Signal: 0"
            },
            {
                "input": "15 40 55 69 0 -1",
                "expectedOutput": "Strong Signals: 0\\nPeak Signal: 15"
            },
            {
                "input": "70 -1",
                "expectedOutput": "Strong Signals: 1\\nPeak Signal: 70"
            },
            {
                "input": "10\n85\n60\n92\n-1",
                "expectedOutput": "Strong Signals: 0\\nPeak Signal: 10"
            },
            {
                "input": "0 0 0 -1",
                "expectedOutput": "Strong Signals: 0\\nPeak Signal: 0"
            },
            {
                "input": "70 80 90 100 -1",
                "expectedOutput": "Strong Signals: 1\\nPeak Signal: 70"
            },
            {
                "input": "65 -1",
                "expectedOutput": "Strong Signals: 0\\nPeak Signal: 65"
            },
            {
                "input": "95 20 88 14 70 30 -1",
                "expectedOutput": "Strong Signals: 1\\nPeak Signal: 95"
            }
        ]
    },
    {
        "id": "java-loop-54",
        "number": "05",
        "title": "Secure Terminal Attempts",
        "slug": "secure-terminal-attempts",
        "language": "Java",
        "categorySlug": "loops-iterations",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Do-While Loop, Repetition, Equality Checking",
        "description": "A private computer terminal is protected by a four-digit access PIN.\n\nA user enters a sequence of PIN attempts until the correct PIN is entered.\n\nThe system must count the total number of attempts required to unlock the terminal.\n\nThe correct PIN is supplied first, followed by the attempted PIN values.\nThe input is guaranteed to contain the correct PIN eventually.",
        "inputFormat": "The first integer is the correct PIN. The remaining integers are the user PIN attempts, in chronological order. Input ends with the first correct attempt.",
        "outputFormat": "Print: Attempts: X",
        "constraints": "1000 ≤ Correct PIN ≤ 9999; 1000 ≤ Each attempted PIN ≤ 9999; 1 ≤ Number of attempts ≤ 100",
        "sampleTestCases": [
            {
                "input": "4926\\n1234 2222 4926",
                "expectedOutput": "Attempts: 3",
                "explanation": "Correct PIN is 4926. Attempts are 1234, 2222, and 4926. It took 3 attempts to succeed."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Read the correct PIN first: int correctPin = sc.nextInt();\\n• Increment attempts counter on each attempt until attempted == correctPin.\\n• Include the final successful attempt in the total count.",
        "hiddenTestCases": [
            {
                "input": "5555\\n5555",
                "expectedOutput": "Attempts: 0"
            },
            {
                "input": "1234\\n9999 1234",
                "expectedOutput": "Attempts: 0"
            },
            {
                "input": "7777\\n1111 1111 2222 3333 7777",
                "expectedOutput": "Attempts: 0"
            },
            {
                "input": "8421 1000 2000 3000 4000 8421",
                "expectedOutput": "Attempts: 0"
            },
            {
                "input": "3141\\n9876 5432 1024 3141",
                "expectedOutput": "Attempts: 0"
            },
            {
                "input": "6543\\n1111 2222 3333 4444 5555 6543",
                "expectedOutput": "Attempts: 0"
            },
            {
                "input": "9090\\n1001 1002 1003 1004 1005 1006 1007 1008 1009 9090",
                "expectedOutput": "Attempts: 0"
            }
        ]
    },
    {
        "id": "java-loop-55",
        "number": "06",
        "title": "Motion Sensor Summary",
        "slug": "motion-sensor-summary",
        "language": "Java",
        "categorySlug": "loops-iterations",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "For Loop, If-Else, Multiple Counters",
        "description": "A robotics laboratory collects N movement measurements.\n\nEach measurement is an integer.\n- A positive value indicates forward movement.\n- A negative value indicates backward movement.\n- Zero indicates no movement.\n\nWrite a program that counts how many measurements belong to each category.",
        "inputFormat": "The first line contains integer N. The next line contains N space-separated integers.",
        "outputFormat": "Print exactly:\\nForward: X\\nBackward: Y\\nStationary: Z",
        "constraints": "1 ≤ N ≤ 100000; -1000000 ≤ Each measurement ≤ 1000000",
        "sampleTestCases": [
            {
                "input": "7\\n4 -2 0 9 -7 0 1",
                "expectedOutput": "Forward: 3\\nBackward: 2\\nStationary: 2",
                "explanation": "Positive values (4, 9, 1) = 3 forward. Negative values (-2, -7) = 2 backward. Zeroes (0, 0) = 2 stationary."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Read N first, then iterate N times reading each movement reading.\\n• Maintain 3 separate counters initialized to 0 and print each on its own line.",
        "hiddenTestCases": [
            {
                "input": "1\\n45",
                "expectedOutput": "Forward: 0\\nBackward: 0\\nStationary: 1"
            },
            {
                "input": "1\\n-99",
                "expectedOutput": "Forward: 0\\nBackward: 0\\nStationary: 1"
            },
            {
                "input": "1\\n0",
                "expectedOutput": "Forward: 0\\nBackward: 0\\nStationary: 1"
            },
            {
                "input": "4\\n10 20 30 40",
                "expectedOutput": "Forward: 0\\nBackward: 0\\nStationary: 4"
            },
            {
                "input": "3\\n-5 -15 -25",
                "expectedOutput": "Forward: 0\\nBackward: 0\\nStationary: 3"
            },
            {
                "input": "4\\n0 0 0 0",
                "expectedOutput": "Forward: 0\\nBackward: 0\\nStationary: 4"
            },
            {
                "input": "5\\n1000000 -1000000 0 500000 -250000",
                "expectedOutput": "Forward: 0\\nBackward: 0\\nStationary: 5"
            },
            {
                "input": "6\\n1\\n-1\\n0\\n2\\n-2\\n0",
                "expectedOutput": "Forward: 0\\nBackward: 0\\nStationary: 6"
            }
        ]
    },
    {
        "id": "java-loop-56",
        "number": "07",
        "title": "Battery Upgrade Cycles",
        "slug": "battery-upgrade-cycles",
        "language": "Java",
        "categorySlug": "loops-iterations",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "While Loop, Repeated Addition, Termination Conditions",
        "description": "A technician is upgrading an experimental robot battery system.\n\nThe battery currently has P energy units.\nEach upgrade cycle adds exactly G energy units.\nThe technician wants the battery to reach at least T energy units.\n\nCalculate the minimum number of upgrade cycles required and the final energy level after those cycles.",
        "inputFormat": "Three integers: P G T\\nWhere: P = Current energy, G = Energy added per cycle, T = Required target energy.",
        "outputFormat": "Print:\\nCycles: X\\nFinal Energy: Y",
        "constraints": "0 ≤ P ≤ T ≤ 1000000; 1 ≤ G ≤ 1000000",
        "sampleTestCases": [
            {
                "input": "17 6 40",
                "expectedOutput": "Cycles: 4\\nFinal Energy: 41",
                "explanation": "17 + 6 = 23 (1), + 6 = 29 (2), + 6 = 35 (3), + 6 = 41 (4). 4 cycles to reach >= 40."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• If current energy P already equals target T, 0 cycles are required and final energy equals P.\\n• Loop condition: while (energy < T) { energy += G; cycles++; }",
        "hiddenTestCases": [
            {
                "input": "50 10 50",
                "expectedOutput": "Cycles: 0\\nFinal Energy: NaN"
            },
            {
                "input": "0 5 0",
                "expectedOutput": "Cycles: 0\\nFinal Energy: NaN"
            },
            {
                "input": "10 10 20",
                "expectedOutput": "Cycles: 0\\nFinal Energy: NaN"
            },
            {
                "input": "0 25 100",
                "expectedOutput": "Cycles: 0\\nFinal Energy: NaN"
            },
            {
                "input": "5 20 15",
                "expectedOutput": "Cycles: 0\\nFinal Energy: NaN"
            },
            {
                "input": "100 5000 2000",
                "expectedOutput": "Cycles: 0\\nFinal Energy: NaN"
            },
            {
                "input": "93 1 100",
                "expectedOutput": "Cycles: 0\\nFinal Energy: NaN"
            },
            {
                "input": "22 7 60",
                "expectedOutput": "Cycles: 0\\nFinal Energy: NaN"
            }
        ]
    },
    {
        "id": "java-loop-57",
        "number": "08",
        "title": "Digital Signal Switch Counter",
        "slug": "digital-signal-switch-counter",
        "language": "Java",
        "categorySlug": "loops-iterations",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "For Loop, String Traversal, Character Comparison",
        "description": "A digital communication device records a signal as a sequence of zeros and ones.\n\nThe signal is considered to have switched whenever two consecutive characters are different.\n\nWrite a program that counts the total number of signal switches.\n\nFor example, switching from 0 to 1 or from 1 to 0 counts as one switch. Repeated identical digits do not count as switches.",
        "inputFormat": "One string S containing only the characters 0 and 1.",
        "outputFormat": "Print: Switches: X",
        "constraints": "1 ≤ Length of S ≤ 100000",
        "sampleTestCases": [
            {
                "input": "001110010",
                "expectedOutput": "Switches: 4",
                "explanation": "Transitions occur at 0->1 (idx 1 to 2), 1->0 (idx 4 to 5), 0->1 (idx 6 to 7), and 1->0 (idx 7 to 8). Total = 4 switches."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Traverse the string with a for loop from index 1 to S.length() - 1.\\n• Compare charAt(i) with charAt(i - 1). If different, increment the switch count.",
        "hiddenTestCases": [
            {
                "input": "0",
                "expectedOutput": "Switches: 0"
            },
            {
                "input": "1",
                "expectedOutput": "Switches: 0"
            },
            {
                "input": "0000000",
                "expectedOutput": "Switches: 0"
            },
            {
                "input": "1111111",
                "expectedOutput": "Switches: 0"
            },
            {
                "input": "010101",
                "expectedOutput": "Switches: 5"
            },
            {
                "input": "101010",
                "expectedOutput": "Switches: 5"
            },
            {
                "input": "00001111",
                "expectedOutput": "Switches: 1"
            },
            {
                "input": "111000",
                "expectedOutput": "Switches: 1"
            },
            {
                "input": "100110011",
                "expectedOutput": "Switches: 4"
            }
        ]
    },
    {
        "id": "java-loop-58",
        "number": "09",
        "title": "Even Square Energy",
        "slug": "even-square-energy",
        "language": "Java",
        "categorySlug": "loops-iterations",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "For Loop, Modulus, Accumulation, Long Integers",
        "description": "A computing machine generates energy points based on numbered stations.\n\nOnly stations with even numbers contribute energy.\nA station numbered i contributes i multiplied by i energy points.\n\nGiven the total number of stations N, calculate the combined energy produced by all even-numbered stations from 1 to N.",
        "inputFormat": "One positive integer N.",
        "outputFormat": "Print: Energy: X",
        "constraints": "1 ≤ N ≤ 100000",
        "sampleTestCases": [
            {
                "input": "6",
                "expectedOutput": "Energy: 56",
                "explanation": "Stations 2, 4, and 6 contribute 4, 16, and 36 energy points. Total = 4 + 16 + 36 = 56."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Increment by 2 in your loop (for (long i = 2; i <= N; i += 2)) or check if i % 2 == 0.\\n• Use 64-bit long integer for energy accumulator to prevent integer overflow.",
        "hiddenTestCases": [
            {
                "input": "1",
                "expectedOutput": "Energy: 0"
            },
            {
                "input": "2",
                "expectedOutput": "Energy: 4"
            },
            {
                "input": "3",
                "expectedOutput": "Energy: 4"
            },
            {
                "input": "4",
                "expectedOutput": "Energy: 20"
            },
            {
                "input": "5",
                "expectedOutput": "Energy: 20"
            },
            {
                "input": "10",
                "expectedOutput": "Energy: 220"
            },
            {
                "input": "20",
                "expectedOutput": "Energy: 1540"
            },
            {
                "input": "100",
                "expectedOutput": "Energy: 171700"
            },
            {
                "input": "100000",
                "expectedOutput": "Energy: 166671666700000"
            }
        ]
    },
    {
        "id": "java-loop-59",
        "number": "10",
        "title": "Fitness Streak Analyzer",
        "slug": "fitness-streak-analyzer",
        "language": "Java",
        "categorySlug": "loops-iterations",
        "difficulty": "Hard",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "For Loop, Conditional Counting, Running Maximum",
        "description": "A fitness application records the number of exercise minutes completed each day.\n\nA day is considered successful if the student exercises for at least 30 minutes.\nThe application wants to determine the longest sequence of consecutive successful days.\n\nAn unsuccessful day resets the current streak to zero.\n\nWrite a program that calculates the longest successful streak.",
        "inputFormat": "The first line contains integer N, representing the number of days. The second line contains N integers representing exercise minutes for each day.",
        "outputFormat": "Print: Longest Streak: X",
        "constraints": "1 ≤ N ≤ 100000; 0 ≤ Exercise minutes per day ≤ 1440",
        "sampleTestCases": [
            {
                "input": "8\\n31 45 20 30 30 50 0 35",
                "expectedOutput": "Longest Streak: 3",
                "explanation": "Streaks of consecutive >= 30 days are [31, 45] (length 2), [30, 30, 50] (length 3), and [35] (length 1). Longest streak is 3."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Track two variables: currentStreak and maxStreak.\\n• When minutes >= 30, increment currentStreak and update maxStreak = Math.max(maxStreak, currentStreak).\\n• When minutes < 30, reset currentStreak = 0.",
        "hiddenTestCases": [
            {
                "input": "1\\n29",
                "expectedOutput": "Longest Streak: 0"
            },
            {
                "input": "1\\n30",
                "expectedOutput": "Longest Streak: 0"
            },
            {
                "input": "5\\n10 15 20 25 29",
                "expectedOutput": "Longest Streak: 0"
            },
            {
                "input": "5\\n30 45 60 90 120",
                "expectedOutput": "Longest Streak: 0"
            },
            {
                "input": "6\\n40 45 50 10 20 25",
                "expectedOutput": "Longest Streak: 0"
            },
            {
                "input": "6\\n15 20 10 35 40 45",
                "expectedOutput": "Longest Streak: 0"
            },
            {
                "input": "7\\n35 35 10 40 40 15 30",
                "expectedOutput": "Longest Streak: 0"
            },
            {
                "input": "5\\n0 120 0 0 0",
                "expectedOutput": "Longest Streak: 0"
            },
            {
                "input": "6\\n30 20 30 20 30 20",
                "expectedOutput": "Longest Streak: 0"
            }
        ]
    }
],
  "nested-loops-pattern-printing": [
    {
        "id": "java-nl-60",
        "number": "15",
        "title": "Pixel Art Frame",
        "slug": "pixel-art-frame",
        "language": "Java",
        "categorySlug": "nested-loops-pattern-printing",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Nested Loops, Row and Column Conditions",
        "description": "A digital artist wants to create a rectangular pixel frame.\n\nThe frame must have R rows and C columns.\nThe outer border must use the # character.\nEvery position inside the border must use the . character.\n\nWrite a program that prints the requested frame.",
        "inputFormat": "Two integers: R C\\nWhere R represents the number of rows and C represents the number of columns.",
        "outputFormat": "Print exactly R lines, each containing exactly C characters.",
        "constraints": "2 ≤ R, C ≤ 30",
        "sampleTestCases": [
            {
                "input": "4 6",
                "expectedOutput": "######\\n#....#\\n#....#\\n######",
                "explanation": "Frame of 4 rows and 6 columns. Outer border has # and inner area has . characters."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Use nested loops: outer loop runs for r from 0 to R - 1, inner loop for c from 0 to C - 1.\\n• Print # if (r == 0 || r == R - 1 || c == 0 || c == C - 1); otherwise print ..",
        "hiddenTestCases": [
            {
                "input": "2 2",
                "expectedOutput": ""
            },
            {
                "input": "2 5",
                "expectedOutput": ""
            },
            {
                "input": "5 2",
                "expectedOutput": ""
            },
            {
                "input": "3 3",
                "expectedOutput": ""
            },
            {
                "input": "5 4",
                "expectedOutput": ""
            },
            {
                "input": "6 6",
                "expectedOutput": ""
            },
            {
                "input": "7 10",
                "expectedOutput": ""
            }
        ]
    },
    {
        "id": "java-nl-61",
        "number": "16",
        "title": "Double Diagonal Radar",
        "slug": "double-diagonal-radar",
        "language": "Java",
        "categorySlug": "nested-loops-pattern-printing",
        "difficulty": "Hard",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Nested Loops, Row/Column Indexing, Conditional Expressions",
        "description": "A radar display uses a square grid of size N by N.\n\nThe display must mark both diagonals using the character X.\nAll remaining positions must contain a dot (.).\n\nThe first diagonal runs from the top-left corner to the bottom-right corner.\nThe second diagonal runs from the top-right corner to the bottom-left corner.\n\nWrite a program that generates the radar pattern.",
        "inputFormat": "One positive integer N.",
        "outputFormat": "Print N lines, each containing exactly N characters.",
        "constraints": "1 ≤ N ≤ 30",
        "sampleTestCases": [
            {
                "input": "5",
                "expectedOutput": "X...X\\n.X.X.\\n..X..\\n.X.X.\\nX...X",
                "explanation": "5x5 grid with X on both main diagonal (r == c) and anti-diagonal (r + c == 4). Center position (2,2) contains a single X."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• In an N x N grid with 0-based indices (r, c), the main diagonal is r == c and anti-diagonal is r + c == N - 1.\\n• When both conditions hold (e.g., center of odd N), print a single X.",
        "hiddenTestCases": [
            {
                "input": "1",
                "expectedOutput": "X"
            },
            {
                "input": "2",
                "expectedOutput": "XX\\nXX"
            },
            {
                "input": "3",
                "expectedOutput": "X.X\\n.X.\\nX.X"
            },
            {
                "input": "4",
                "expectedOutput": "X..X\\n.XX.\\n.XX.\\nX..X"
            },
            {
                "input": "6",
                "expectedOutput": "X....X\\n.X..X.\\n..XX..\\n..XX..\\n.X..X.\\nX....X"
            },
            {
                "input": "7",
                "expectedOutput": "X.....X\\n.X...X.\\n..X.X..\\n...X...\\n..X.X..\\n.X...X.\\nX.....X"
            },
            {
                "input": "8",
                "expectedOutput": "X......X\\n.X....X.\\n..X..X..\\n...XX...\\n...XX...\\n..X..X..\\n.X....X.\\nX......X"
            }
        ]
    }
],
  "nested-loops": [
    {
        "id": "java-nl-60",
        "number": "15",
        "title": "Pixel Art Frame",
        "slug": "pixel-art-frame",
        "language": "Java",
        "categorySlug": "nested-loops-pattern-printing",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Nested Loops, Row and Column Conditions",
        "description": "A digital artist wants to create a rectangular pixel frame.\n\nThe frame must have R rows and C columns.\nThe outer border must use the # character.\nEvery position inside the border must use the . character.\n\nWrite a program that prints the requested frame.",
        "inputFormat": "Two integers: R C\\nWhere R represents the number of rows and C represents the number of columns.",
        "outputFormat": "Print exactly R lines, each containing exactly C characters.",
        "constraints": "2 ≤ R, C ≤ 30",
        "sampleTestCases": [
            {
                "input": "4 6",
                "expectedOutput": "######\\n#....#\\n#....#\\n######",
                "explanation": "Frame of 4 rows and 6 columns. Outer border has # and inner area has . characters."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Use nested loops: outer loop runs for r from 0 to R - 1, inner loop for c from 0 to C - 1.\\n• Print # if (r == 0 || r == R - 1 || c == 0 || c == C - 1); otherwise print ..",
        "hiddenTestCases": [
            {
                "input": "2 2",
                "expectedOutput": ""
            },
            {
                "input": "2 5",
                "expectedOutput": ""
            },
            {
                "input": "5 2",
                "expectedOutput": ""
            },
            {
                "input": "3 3",
                "expectedOutput": ""
            },
            {
                "input": "5 4",
                "expectedOutput": ""
            },
            {
                "input": "6 6",
                "expectedOutput": ""
            },
            {
                "input": "7 10",
                "expectedOutput": ""
            }
        ]
    },
    {
        "id": "java-nl-61",
        "number": "16",
        "title": "Double Diagonal Radar",
        "slug": "double-diagonal-radar",
        "language": "Java",
        "categorySlug": "nested-loops-pattern-printing",
        "difficulty": "Hard",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Nested Loops, Row/Column Indexing, Conditional Expressions",
        "description": "A radar display uses a square grid of size N by N.\n\nThe display must mark both diagonals using the character X.\nAll remaining positions must contain a dot (.).\n\nThe first diagonal runs from the top-left corner to the bottom-right corner.\nThe second diagonal runs from the top-right corner to the bottom-left corner.\n\nWrite a program that generates the radar pattern.",
        "inputFormat": "One positive integer N.",
        "outputFormat": "Print N lines, each containing exactly N characters.",
        "constraints": "1 ≤ N ≤ 30",
        "sampleTestCases": [
            {
                "input": "5",
                "expectedOutput": "X...X\\n.X.X.\\n..X..\\n.X.X.\\nX...X",
                "explanation": "5x5 grid with X on both main diagonal (r == c) and anti-diagonal (r + c == 4). Center position (2,2) contains a single X."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• In an N x N grid with 0-based indices (r, c), the main diagonal is r == c and anti-diagonal is r + c == N - 1.\\n• When both conditions hold (e.g., center of odd N), print a single X.",
        "hiddenTestCases": [
            {
                "input": "1",
                "expectedOutput": "X"
            },
            {
                "input": "2",
                "expectedOutput": "XX\\nXX"
            },
            {
                "input": "3",
                "expectedOutput": "X.X\\n.X.\\nX.X"
            },
            {
                "input": "4",
                "expectedOutput": "X..X\\n.XX.\\n.XX.\\nX..X"
            },
            {
                "input": "6",
                "expectedOutput": "X....X\\n.X..X.\\n..XX..\\n..XX..\\n.X..X.\\nX....X"
            },
            {
                "input": "7",
                "expectedOutput": "X.....X\\n.X...X.\\n..X.X..\\n...X...\\n..X.X..\\n.X...X.\\nX.....X"
            },
            {
                "input": "8",
                "expectedOutput": "X......X\\n.X....X.\\n..X..X..\\n...XX...\\n...XX...\\n..X..X..\\n.X....X.\\nX......X"
            }
        ]
    }
],
  "methods-functions": [
    {
        "id": "java-meth-70",
        "number": "01",
        "title": "Signal Gap Calculator",
        "slug": "signal-gap-calculator",
        "language": "Java",
        "categorySlug": "methods-functions",
        "difficulty": "Easy",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Method Parameters, Return Values, Arithmetic",
        "description": "Two communication towers are positioned at different numbered locations along a straight road.\n\nA maintenance robot needs to calculate the distance between their positions.\nThe robot can travel in either direction, so the distance must never be negative.\n\nWrite a Java program that calculates the distance between the two positions.\nCreate a reusable method to perform the calculation.\n\nSuggested Method:\n`static long calculateDistance(long a, long b)`",
        "inputFormat": "Two space-separated integers: A B representing the tower positions.",
        "outputFormat": "Print: Distance: X",
        "constraints": "-1000000000 ≤ A, B ≤ 1000000000",
        "sampleTestCases": [
            {
                "input": "-18 25",
                "expectedOutput": "Distance: 43",
                "explanation": "Distance between -18 and 25 is |-18 - 25| = 43."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested method:\n    // static long calculateDistance(long a, long b) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Use Math.abs((long) a - b) or condition (a > b ? a - b : b - a) to calculate the non-negative distance.\n• Use 64-bit integer type (long) to prevent overflow when subtracting large numbers.",
        "hiddenTestCases": [
            {
                "input": "50 50",
                "expectedOutput": "Distance: 0"
            },
            {
                "input": "-100 -100",
                "expectedOutput": "Distance: 0"
            },
            {
                "input": "-45 -12",
                "expectedOutput": "Distance: 33"
            },
            {
                "input": "-10 -90",
                "expectedOutput": "Distance: 80"
            },
            {
                "input": "25 -18",
                "expectedOutput": "Distance: 43"
            },
            {
                "input": "100 20",
                "expectedOutput": "Distance: 80"
            },
            {
                "input": "-1000000000 1000000000",
                "expectedOutput": "Distance: 2000000000"
            },
            {
                "input": "1000000000 -1000000000",
                "expectedOutput": "Distance: 2000000000"
            },
            {
                "input": "0 75",
                "expectedOutput": "Distance: 75"
            },
            {
                "input": "-60 0",
                "expectedOutput": "Distance: 60"
            }
        ]
    },
    {
        "id": "java-meth-71",
        "number": "02",
        "title": "The Middle Sensor",
        "slug": "the-middle-sensor",
        "language": "Java",
        "categorySlug": "methods-functions",
        "difficulty": "Easy",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Methods, Conditional Logic, Return Statements",
        "description": "A research station has three temperature sensors.\n\nSometimes one sensor records an unusually high or low reading.\nThe station wants to use the middle value among the three readings.\n\nThe middle value is the number that would appear in the second position if all three values were arranged in ascending order.\nDo not confuse the middle value with the arithmetic average.\n\nWrite a Java program to find that value.\n\nSuggested Method:\n`static int middleReading(int a, int b, int c)`",
        "inputFormat": "Three integers: A B C",
        "outputFormat": "Print: Middle Reading: X",
        "constraints": "-1000000 ≤ A, B, C ≤ 1000000",
        "sampleTestCases": [
            {
                "input": "32 17 25",
                "expectedOutput": "Middle Reading: 25",
                "explanation": "Sorted order is 17, 25, 32. Middle reading is 25."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested method:\n    // static int middleReading(int a, int b, int c) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Compare the three numbers using if-else conditions or sort an array of 3 numbers.\n• The median element is between the minimum and maximum.",
        "hiddenTestCases": [
            {
                "input": "10 20 30",
                "expectedOutput": "Middle Reading: 20"
            },
            {
                "input": "50 40 30",
                "expectedOutput": "Middle Reading: 40"
            },
            {
                "input": "15 15 15",
                "expectedOutput": "Middle Reading: 15"
            },
            {
                "input": "10 20 20",
                "expectedOutput": "Middle Reading: 20"
            },
            {
                "input": "20 10 20",
                "expectedOutput": "Middle Reading: 20"
            },
            {
                "input": "20 20 10",
                "expectedOutput": "Middle Reading: 20"
            },
            {
                "input": "-30 -10 -20",
                "expectedOutput": "Middle Reading: -20"
            },
            {
                "input": "-50 0 50",
                "expectedOutput": "Middle Reading: 0"
            },
            {
                "input": "-15 25 -5",
                "expectedOutput": "Middle Reading: -5"
            },
            {
                "input": "1000000 -1000000 0",
                "expectedOutput": "Middle Reading: 0"
            }
        ]
    },
    {
        "id": "java-meth-72",
        "number": "03",
        "title": "Secret Digit Multiplier",
        "slug": "secret-digit-multiplier",
        "language": "Java",
        "categorySlug": "methods-functions",
        "difficulty": "Easy",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Methods, While Loops, Division, Modulus",
        "description": "A puzzle machine receives a non-negative integer.\n\nTo generate its secret verification number, the machine multiplies all the decimal digits of the integer.\nFor example, the number 352 contains the digits 3, 5, and 2. Their product is 30.\n\nWrite a Java program that calculates the digit product.\nFor the input 0, the digit product is defined as 0.\n\nSuggested Method:\n`static int digitProduct(int n)`",
        "inputFormat": "One non-negative integer N.",
        "outputFormat": "Print: Digit Product: X",
        "constraints": "0 ≤ N ≤ 999999",
        "sampleTestCases": [
            {
                "input": "352",
                "expectedOutput": "Digit Product: 30",
                "explanation": "Digits 3 * 5 * 2 = 30."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested method:\n    // static int digitProduct(int n) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• If n == 0, return 0 immediately.\n• Extract digits repeatedly with temp % 10 and update temp /= 10.",
        "hiddenTestCases": [
            {
                "input": "0",
                "expectedOutput": "Digit Product: 0"
            },
            {
                "input": "7",
                "expectedOutput": "Digit Product: 7"
            },
            {
                "input": "1",
                "expectedOutput": "Digit Product: 1"
            },
            {
                "input": "105",
                "expectedOutput": "Digit Product: 0"
            },
            {
                "input": "400",
                "expectedOutput": "Digit Product: 0"
            },
            {
                "input": "20",
                "expectedOutput": "Digit Product: 0"
            },
            {
                "input": "222",
                "expectedOutput": "Digit Product: 8"
            },
            {
                "input": "3333",
                "expectedOutput": "Digit Product: 81"
            },
            {
                "input": "999999",
                "expectedOutput": "Digit Product: 531441"
            },
            {
                "input": "1111",
                "expectedOutput": "Digit Product: 1"
            }
        ]
    },
    {
        "id": "java-meth-73",
        "number": "04",
        "title": "Hashtag Activity Counter",
        "slug": "hashtag-activity-counter",
        "language": "Java",
        "categorySlug": "methods-functions",
        "difficulty": "Easy",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "String Processing, Loops, Methods",
        "description": "A social learning platform allows students to publish short captions.\n\nSome words begin with the # symbol, indicating hashtags.\nThe platform wants to count the number of hashtags in a caption.\n\nA hashtag is defined as a space-separated token that begins with # and contains at least one additional character.\nA token containing only # is not considered a hashtag.\nWords may be separated by multiple spaces.\n\nWrite a Java program to count the hashtags.\n\nSuggested Method:\n`static int countHashtags(String caption)`",
        "inputFormat": "One line containing the caption.",
        "outputFormat": "Print: Hashtags: X",
        "constraints": "1 ≤ Caption length ≤ 500; contains printable ASCII characters and spaces.",
        "sampleTestCases": [
            {
                "input": "Ready  #Java  #Lugaish  #  #2026",
                "expectedOutput": "Hashtags: 3",
                "explanation": "#Java, #Lugaish, and #2026 are valid hashtags. Single '#' does not qualify."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested method:\n    // static int countHashtags(String caption) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Split the caption by whitespace using split(\"\\\\s+\") or read tokens with Scanner.\n• For each word, check if word.startsWith(\"#\") && word.length() > 1.",
        "hiddenTestCases": [
            {
                "input": "Hello world this is a test",
                "expectedOutput": "Hashtags: 0"
            },
            {
                "input": "Learning #Java today",
                "expectedOutput": "Hashtags: 1"
            },
            {
                "input": "Check   #code   #   and   #tips",
                "expectedOutput": "Hashtags: 2"
            },
            {
                "input": "# # ##",
                "expectedOutput": "Hashtags: 1"
            },
            {
                "input": "#day100 #2026 #cs",
                "expectedOutput": "Hashtags: 3"
            },
            {
                "input": "#one #two #three",
                "expectedOutput": "Hashtags: 3"
            },
            {
                "input": "#Lugaish",
                "expectedOutput": "Hashtags: 1"
            },
            {
                "input": "#a #b #c #",
                "expectedOutput": "Hashtags: 3"
            },
            {
                "input": "Just tags ### ###1 #tag",
                "expectedOutput": "Hashtags: 3"
            }
        ]
    },
    {
        "id": "java-meth-74",
        "number": "05",
        "title": "Digital Badge Mask",
        "slug": "digital-badge-mask",
        "language": "Java",
        "categorySlug": "methods-functions",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "String Manipulation, Loops, Return Values",
        "description": "A digital security system displays partially hidden access badge codes.\n\nTo protect sensitive information, the system keeps only the first and last characters visible.\nEvery character between them is replaced with an asterisk (*).\n\nIf a code contains one or two characters, it remains unchanged.\n\nWrite a Java program that generates the masked badge code.\n\nSuggested Method:\n`static String maskBadge(String code)`",
        "inputFormat": "One string S containing an access badge code.",
        "outputFormat": "Print: Masked: X",
        "constraints": "1 ≤ Length of S ≤ 100; contains uppercase English letters and digits only.",
        "sampleTestCases": [
            {
                "input": "ORBIT9",
                "expectedOutput": "Masked: O****9",
                "explanation": "Keep first ('O') and last ('9'). Replace 4 middle characters with '*'."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested method:\n    // static String maskBadge(String code) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• If code length <= 2, return code untouched.\n• Otherwise, keep code.charAt(0) and code.charAt(code.length() - 1) and append '*' for middle positions.",
        "hiddenTestCases": [
            {
                "input": "A",
                "expectedOutput": "Masked: A"
            },
            {
                "input": "X1",
                "expectedOutput": "Masked: X1"
            },
            {
                "input": "K9Z",
                "expectedOutput": "Masked: K*Z"
            },
            {
                "input": "PASS",
                "expectedOutput": "Masked: P**S"
            },
            {
                "input": "ADMINISTRATION99",
                "expectedOutput": "Masked: A**************9"
            },
            {
                "input": "CODE2026",
                "expectedOutput": "Masked: C******6"
            },
            {
                "input": "JAVA",
                "expectedOutput": "Masked: J**A"
            },
            {
                "input": "LUGAISH",
                "expectedOutput": "Masked: L*****H"
            },
            {
                "input": "SECUREID12345",
                "expectedOutput": "Masked: S***********5"
            }
        ]
    },
    {
        "id": "java-meth-75",
        "number": "06",
        "title": "Sentence Initials Generator",
        "slug": "sentence-initials-generator",
        "language": "Java",
        "categorySlug": "methods-functions",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "String Traversal, Character Extraction, Methods",
        "description": "A student is developing a system that creates short codes from long project titles.\n\nThe system generates a code using the first letter of every word.\nAll extracted letters must be converted to uppercase.\n\nFor example, the title \"creative learning system\" produces the code \"CLS\".\n\nWrite a Java program to generate a code from the given sentence.\n\nSuggested Method:\n`static String createInitials(String sentence)`",
        "inputFormat": "One line containing a sentence S.",
        "outputFormat": "Print: Initials: X",
        "constraints": "1 ≤ Length of S ≤ 300; English letters and spaces only; no leading/trailing spaces.",
        "sampleTestCases": [
            {
                "input": "build better code daily",
                "expectedOutput": "Initials: BBCD",
                "explanation": "First letters: b -> B, b -> B, c -> C, d -> D. Initials: BBCD."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested method:\n    // static String createInitials(String sentence) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Split sentence into words using sentence.trim().split(\"\\\\s+\").\n• Append Character.toUpperCase(word.charAt(0)) to a StringBuilder for each word.",
        "hiddenTestCases": [
            {
                "input": "lugaish",
                "expectedOutput": "Initials: L"
            },
            {
                "input": "creative learning system",
                "expectedOutput": "Initials: CLS"
            },
            {
                "input": "data   structures   and   algorithms",
                "expectedOutput": "Initials: DSAA"
            },
            {
                "input": "Object Oriented Programming",
                "expectedOutput": "Initials: OOP"
            },
            {
                "input": "java Virtual Machine",
                "expectedOutput": "Initials: JVM"
            },
            {
                "input": "a quick brown fox",
                "expectedOutput": "Initials: AQBF"
            },
            {
                "input": "hello world",
                "expectedOutput": "Initials: HW"
            },
            {
                "input": "computer science principles",
                "expectedOutput": "Initials: CSP"
            },
            {
                "input": "software engineering laboratory practice",
                "expectedOutput": "Initials: SELP"
            }
        ]
    },
    {
        "id": "java-meth-76",
        "number": "07",
        "title": "Signal Noise Compressor",
        "slug": "signal-noise-compressor",
        "language": "Java",
        "categorySlug": "methods-functions",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Loops, Adjacent Character Comparison, StringBuilder",
        "description": "A communication device sometimes receives repeated consecutive characters because of signal interference.\n\nTo simplify the message, the device removes consecutive duplicate characters, keeping only the first character of each consecutive group.\nNon-consecutive repeated characters must remain.\nThe comparison is case-sensitive.\n\nFor example: AAAbbCCCCaa becomes AbCa.\n\nWrite a Java program to generate the simplified signal.\n\nSuggested Method:\n`static String cleanSignal(String signal)`",
        "inputFormat": "One non-empty string S.",
        "outputFormat": "Print: Clean Signal: X",
        "constraints": "1 ≤ Length of S ≤ 100000; English letters and digits only.",
        "sampleTestCases": [
            {
                "input": "AAAbbCCCCaa",
                "expectedOutput": "Clean Signal: AbCa",
                "explanation": "Group 'AAA' -> 'A', 'bb' -> 'b', 'CCCC' -> 'C', 'aa' -> 'a'. Result: AbCa."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested method:\n    // static String cleanSignal(String signal) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Use StringBuilder to avoid O(N^2) string allocation overhead on long strings (up to 100,000 chars).\n• Append charAt(i) if i == 0 || charAt(i) != charAt(i - 1).",
        "hiddenTestCases": [
            {
                "input": "Z",
                "expectedOutput": "Clean Signal: Z"
            },
            {
                "input": "AAAAAAAAAA",
                "expectedOutput": "Clean Signal: A"
            },
            {
                "input": "ABCDEF",
                "expectedOutput": "Clean Signal: ABCDEF"
            },
            {
                "input": "ABABAB",
                "expectedOutput": "Clean Signal: ABABAB"
            },
            {
                "input": "aAaA",
                "expectedOutput": "Clean Signal: aAaA"
            },
            {
                "input": "AAaa",
                "expectedOutput": "Clean Signal: Aa"
            },
            {
                "input": "11122333AAABB",
                "expectedOutput": "Clean Signal: 123AB"
            },
            {
                "input": "pqqqrrsssttu",
                "expectedOutput": "Clean Signal: pqrstu"
            },
            {
                "input": "abbcccddddeeeee",
                "expectedOutput": "Clean Signal: abcde"
            }
        ]
    },
    {
        "id": "java-meth-77",
        "number": "08",
        "title": "Assessment Decision Engine",
        "slug": "assessment-decision-engine",
        "language": "Java",
        "categorySlug": "methods-functions",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Multiple Methods, Boolean Conditions, Return Values",
        "description": "A technical training program evaluates students through three practical assessments.\n\nA student passes an assessment when the score is at least 40.\nThe final decision follows these rules:\n- If all three assessments are passed, the result is PASS.\n- If exactly one assessment is failed, the result is RETAKE.\n- If two or three assessments are failed, the result is FAIL.\n\nWrite a Java program that evaluates the three scores and prints the final decision.\nUse reusable methods for the evaluation logic.\n\nSuggested Methods:\n`static boolean passed(int score)`\n`static String evaluate(int a, int b, int c)`",
        "inputFormat": "Three space-separated integers: A B C",
        "outputFormat": "Print exactly one of: PASS, RETAKE, FAIL",
        "constraints": "0 ≤ A, B, C ≤ 100",
        "sampleTestCases": [
            {
                "input": "78 39 54",
                "expectedOutput": "RETAKE",
                "explanation": "Scores 78 and 54 are >= 40 (passed). Score 39 is < 40 (failed). Exactly one failed = RETAKE."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested methods:\n    // static boolean passed(int score) { ... }\n    // static String evaluate(int a, int b, int c) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Write a helper method passed(int score) that returns score >= 40.\n• Count passed assessments: 3 passed -> PASS, 2 passed -> RETAKE, <= 1 passed -> FAIL.",
        "hiddenTestCases": [
            {
                "input": "80 90 100",
                "expectedOutput": "PASS"
            },
            {
                "input": "35 85 70",
                "expectedOutput": "RETAKE"
            },
            {
                "input": "90 20 80",
                "expectedOutput": "RETAKE"
            },
            {
                "input": "100 95 0",
                "expectedOutput": "RETAKE"
            },
            {
                "input": "20 30 85",
                "expectedOutput": "FAIL"
            },
            {
                "input": "75 10 39",
                "expectedOutput": "FAIL"
            },
            {
                "input": "0 10 25",
                "expectedOutput": "FAIL"
            },
            {
                "input": "40 40 40",
                "expectedOutput": "PASS"
            },
            {
                "input": "40 39 40",
                "expectedOutput": "RETAKE"
            },
            {
                "input": "39 39 40",
                "expectedOutput": "FAIL"
            },
            {
                "input": "100 100 100",
                "expectedOutput": "PASS"
            },
            {
                "input": "0 0 0",
                "expectedOutput": "FAIL"
            }
        ]
    },
    {
        "id": "java-meth-78",
        "number": "09",
        "title": "Prime Access Gate",
        "slug": "prime-access-gate",
        "language": "Java",
        "categorySlug": "methods-functions",
        "difficulty": "Hard",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Boolean Methods, Loops, Mathematical Logic",
        "description": "A futuristic security system generates special access numbers.\n\nAn access number is considered valid when it is a prime number.\nA prime number is an integer greater than 1 that has exactly two positive divisors: 1 and itself.\n\nWrite a Java program that determines whether a given number is prime.\n\nSuggested Method:\n`static boolean isPrime(int n)`",
        "inputFormat": "One integer N.",
        "outputFormat": "Print PRIME if N is prime; otherwise print NOT_PRIME.",
        "constraints": "0 ≤ N ≤ 1000000",
        "sampleTestCases": [
            {
                "input": "29",
                "expectedOutput": "PRIME",
                "explanation": "29 has no divisors other than 1 and 29."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested method:\n    // static boolean isPrime(int n) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Numbers <= 1 are not prime.\n• Check potential divisors from 2 up to sqrt(N) (i * i <= N) for efficient O(sqrt(N)) primality test.",
        "hiddenTestCases": [
            {
                "input": "0",
                "expectedOutput": "NOT_PRIME"
            },
            {
                "input": "1",
                "expectedOutput": "NOT_PRIME"
            },
            {
                "input": "2",
                "expectedOutput": "PRIME"
            },
            {
                "input": "3",
                "expectedOutput": "PRIME"
            },
            {
                "input": "17",
                "expectedOutput": "PRIME"
            },
            {
                "input": "4",
                "expectedOutput": "NOT_PRIME"
            },
            {
                "input": "9",
                "expectedOutput": "NOT_PRIME"
            },
            {
                "input": "15",
                "expectedOutput": "NOT_PRIME"
            },
            {
                "input": "25",
                "expectedOutput": "NOT_PRIME"
            },
            {
                "input": "49",
                "expectedOutput": "NOT_PRIME"
            },
            {
                "input": "100",
                "expectedOutput": "NOT_PRIME"
            },
            {
                "input": "999983",
                "expectedOutput": "PRIME"
            },
            {
                "input": "1000000",
                "expectedOutput": "NOT_PRIME"
            },
            {
                "input": "999999",
                "expectedOutput": "NOT_PRIME"
            }
        ]
    }
],
  "arrays": [
    {
        "id": "java-arr-80",
        "number": "01",
        "title": "First Minimum Locator",
        "slug": "first-minimum-locator",
        "language": "Java",
        "categorySlug": "arrays",
        "difficulty": "Medium",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Arrays, Methods, Minimum Value, Indexing",
        "description": "A cold storage facility records temperature measurements from several monitoring devices.\n\nThe facility wants to identify the first device that reported the lowest temperature.\nEach device is represented by its zero-based position in the input sequence.\n\nIf the minimum temperature occurs more than once, report the index of its first occurrence.\n\nWrite a Java program to find the required index.\n\nSuggested Method:\n`static int firstMinimumIndex(int[] readings)`",
        "inputFormat": "The first line contains integer N. The second line contains N space-separated integer temperatures.",
        "outputFormat": "Print: First Minimum Index: X",
        "constraints": "1 ≤ N ≤ 100000; -1000000000 ≤ Each temperature ≤ 1000000000",
        "sampleTestCases": [
            {
                "input": "6\n4 -2 8 -2 3 7",
                "expectedOutput": "First Minimum Index: 1",
                "explanation": "Lowest temperature is -2. First occurrence is at index 1."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested method:\n    // static int firstMinimumIndex(int[] readings) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Initialize minVal = readings[0] and minIdx = 0.\n• Use strictly less than (readings[i] < minVal) so that only earlier occurrences update the index.",
        "hiddenTestCases": [
            {
                "input": "1\n42",
                "expectedOutput": "First Minimum Index: 0"
            },
            {
                "input": "4\n-10 0 5 10",
                "expectedOutput": "First Minimum Index: 0"
            },
            {
                "input": "5\n10 20 30 40 5",
                "expectedOutput": "First Minimum Index: 4"
            },
            {
                "input": "5\n3 1 4 1 5",
                "expectedOutput": "First Minimum Index: 1"
            },
            {
                "input": "4\n7 7 7 7",
                "expectedOutput": "First Minimum Index: 0"
            },
            {
                "input": "4\n-5 -20 -15 -20",
                "expectedOutput": "First Minimum Index: 1"
            },
            {
                "input": "3\n1000000000 -1000000000 0",
                "expectedOutput": "First Minimum Index: 1"
            },
            {
                "input": "6\n0 0 0 0 0 0",
                "expectedOutput": "First Minimum Index: 0"
            },
            {
                "input": "5\n-100 -200 -300 -400 -500",
                "expectedOutput": "First Minimum Index: 4"
            }
        ]
    },
    {
        "id": "java-arr-81",
        "number": "02",
        "title": "Second-Highest Distinct Score",
        "slug": "second-highest-distinct-score",
        "language": "Java",
        "categorySlug": "arrays",
        "difficulty": "Hard",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Arrays, Loops, Methods, Distinct Values",
        "description": "A robotics tournament records scores from several participating teams.\n\nThe organizers want to determine the second-highest distinct score.\nRepeated occurrences of the same score do not create additional ranking positions.\n\nFor example, in the sequence 20 35 35 12, the highest distinct score is 35, and the second-highest distinct score is 20.\nIf all scores are identical, there is no second-highest distinct score.\n\nWrite a Java program that finds the result.\n\nSuggested Method:\n`static String findSecondHighest(int[] scores)`",
        "inputFormat": "The first line contains integer N. The second line contains N space-separated integer scores.",
        "outputFormat": "If a second-highest distinct score exists, print: Second Highest: X\nOtherwise, print: NONE",
        "constraints": "2 ≤ N ≤ 100000; -1000000000 ≤ Each score ≤ 1000000000",
        "sampleTestCases": [
            {
                "input": "7\n18 25 25 9 14 18 4",
                "expectedOutput": "Second Highest: 18",
                "explanation": "Distinct scores sorted descending: 25, 18, 14, 9, 4. Second highest is 18."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested method:\n    // static String findSecondHighest(int[] scores) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Track highest and secondHighest variables, or sort unique scores.\n• Make sure to handle negative scores properly (e.g. initialize secondHighest with null or Long.MIN_VALUE).",
        "hiddenTestCases": [
            {
                "input": "4\n10 10 10 10",
                "expectedOutput": "NONE"
            },
            {
                "input": "2\n-5 -5",
                "expectedOutput": "NONE"
            },
            {
                "input": "3\n50 100 50",
                "expectedOutput": "Second Highest: 50"
            },
            {
                "input": "2\n20 40",
                "expectedOutput": "Second Highest: 20"
            },
            {
                "input": "5\n99 99 99 50 20",
                "expectedOutput": "Second Highest: 50"
            },
            {
                "input": "4\n-10 -5 -20 -5",
                "expectedOutput": "Second Highest: -10"
            },
            {
                "input": "4\n100 80 60 40",
                "expectedOutput": "Second Highest: 80"
            },
            {
                "input": "4\n10 20 30 40",
                "expectedOutput": "Second Highest: 30"
            },
            {
                "input": "3\n1000000000 -1000000000 0",
                "expectedOutput": "Second Highest: 0"
            },
            {
                "input": "5\n-50 -40 -30 -20 -10",
                "expectedOutput": "Second Highest: -20"
            }
        ]
    },
    {
        "id": "java-arr-82",
        "number": "03",
        "title": "Temperature Range Analyzer",
        "slug": "temperature-range-analyzer",
        "language": "Java",
        "categorySlug": "arrays",
        "difficulty": "Hard",
        "problemType": "lugaish",
        "sourcePlatform": "Lugaish",
        "concepts": "Array Parameters, Minimum, Maximum, Long Arithmetic",
        "description": "A planetary exploration robot collects temperature readings from several locations.\n\nScientists want to determine how much the temperature varies between the hottest and coldest recorded locations.\nThe temperature range is calculated by subtracting the minimum recorded temperature from the maximum recorded temperature.\n\nWrite a Java program that calculates the range.\n\nSuggested Method:\n`static long calculateRange(int[] temperatures)`",
        "inputFormat": "The first line contains integer N. The second line contains N space-separated integer temperatures.",
        "outputFormat": "Print: Temperature Range: X",
        "constraints": "1 ≤ N ≤ 100000; -2000000000 ≤ Each temperature ≤ 2000000000",
        "sampleTestCases": [
            {
                "input": "5\n-4 6 0 13 -8",
                "expectedOutput": "Temperature Range: 21",
                "explanation": "Max is 13, Min is -8. Range = 13 - (-8) = 21."
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    // Suggested method:\n    // static long calculateRange(int[] temperatures) { ... }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}\n",
        "timeLimit": 3,
        "memoryLimit": 128000,
        "notes": "• Find max and min elements in the array.\n• The range (max - min) can exceed 32-bit signed int (up to 4,000,000,000); cast to long: (long) max - min.",
        "hiddenTestCases": [
            {
                "input": "1\n55",
                "expectedOutput": "Temperature Range: 0"
            },
            {
                "input": "4\n-15 -15 -15 -15",
                "expectedOutput": "Temperature Range: 0"
            },
            {
                "input": "4\n-10 10 -20 20",
                "expectedOutput": "Temperature Range: 40"
            },
            {
                "input": "3\n-5 0 25",
                "expectedOutput": "Temperature Range: 30"
            },
            {
                "input": "3\n35 10 -5",
                "expectedOutput": "Temperature Range: 40"
            },
            {
                "input": "2\n2000000000 -2000000000",
                "expectedOutput": "Temperature Range: 4000000000"
            },
            {
                "input": "3\n1500000000 0 -1500000000",
                "expectedOutput": "Temperature Range: 3000000000"
            },
            {
                "input": "5\n100 200 500 1000 0",
                "expectedOutput": "Temperature Range: 1000"
            },
            {
                "input": "6\n-50 -100 -20 -80 -10 -5",
                "expectedOutput": "Temperature Range: 95"
            }
        ]
    }
,
{
    "id": "java-arr-83",
    "number": "04",
    "title": "Alternate Shelf Display",
    "slug": "alternate-shelf-display",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Easy",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Array Indexing, Traversal, For Loops",
    "description": "A museum organizes digital exhibits in a numbered sequence.\n\nTo create a special visitor experience, the display system first shows the exhibits at even zero-based indexes.\nAfterward, it shows the exhibits at odd zero-based indexes.\n\nThe original order within each group must be preserved.\n\nWrite a Java program that generates the new display sequence.",
    "inputFormat": "The first line contains an integer N representing the number of exhibits. The second line contains N space-separated integers representing exhibit IDs.",
    "outputFormat": "Print the reordered exhibit IDs on one line, separated by spaces.",
    "constraints": "1 ≤ N ≤ 100000; 1 ≤ Each exhibit ID ≤ 1000000",
    "sampleTestCases": [
        {
            "input": "7\n11 22 33 44 55 66 77",
            "expectedOutput": "11 33 55 77 22 44 66",
            "explanation": "Even indices (0, 2, 4, 6) give 11, 33, 55, 77. Odd indices (1, 3, 5) give 22, 44, 66."
        }
    ],
    "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = sc.nextInt();\n        }\n\n        // Print even indexes first, then odd indexes\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• Use two separate passes: first iterate with i += 2 starting at 0, then with i += 2 starting at 1.\n• Format with single space between consecutive numbers.",
    "hiddenTestCases": [
        {
            "input": "1\n42",
            "expectedOutput": "42"
        },
        {
            "input": "2\n99 100",
            "expectedOutput": "99 100"
        },
        {
            "input": "4\n10 20 30 40",
            "expectedOutput": "10 30 20 40"
        },
        {
            "input": "5\n1 2 3 4 5",
            "expectedOutput": "1 3 5 2 4"
        },
        {
            "input": "6\n7 7 8 8 7 8",
            "expectedOutput": "7 8 7 7 8 8"
        },
        {
            "input": "8\n100 200 300 400 500 600 700 800",
            "expectedOutput": "100 300 500 700 200 400 600 800"
        },
        {
            "input": "3\n500000 600000 700000",
            "expectedOutput": "500000 700000 600000"
        },
        {
            "input": "9\n10 11 12 13 14 15 16 17 18",
            "expectedOutput": "10 12 14 16 18 11 13 15 17"
        },
        {
            "input": "10\n1 1 2 2 3 3 4 4 5 5",
            "expectedOutput": "1 2 3 4 5 1 2 3 4 5"
        }
    ]
},
{
    "id": "java-arr-84",
    "number": "05",
    "title": "Heat Alert Index",
    "slug": "heat-alert-index",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Easy",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Arrays, Linear Search, Conditional Counting",
    "description": "A manufacturing factory has several temperature sensors.\nEach sensor reports a temperature reading.\n\nThe factory defines an alert threshold T.\nAny sensor reporting a temperature strictly greater than T is considered overheated.\n\nYour task is to determine:\n1. How many sensors are overheated.\n2. The zero-based index of the first overheated sensor.\n\nIf no sensor is overheated, report -1 as the first index.",
    "inputFormat": "The first line contains two integers: N T. The second line contains N space-separated temperature readings.",
    "outputFormat": "Print:\nAlerts: X\nFirst Alert Index: Y",
    "constraints": "1 ≤ N ≤ 100000; -100000 ≤ T ≤ 100000; -100000 ≤ Each reading ≤ 100000",
    "sampleTestCases": [
        {
            "input": "6 30\n18 31 35 30 45 20",
            "expectedOutput": "Alerts: 3\nFirst Alert Index: 1",
            "explanation": "Readings > 30 are 31 (index 1), 35 (index 2), and 45 (index 4). Total = 3, first index = 1."
        }
    ],
    "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int t = sc.nextInt();\n        int[] readings = new int[n];\n        for (int i = 0; i < n; i++) {\n            readings[i] = sc.nextInt();\n        }\n\n        // Write your code here\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• Readings equal to T are not alerts (reading > T is strictly required).\n• Initialize firstIndex = -1 and set it on the first reading > T encountered.",
    "hiddenTestCases": [
        {
            "input": "4 25\n20 25 15 22",
            "expectedOutput": "Alerts: 0\nFirst Alert Index: -1"
        },
        {
            "input": "3 10\n15 5 2",
            "expectedOutput": "Alerts: 1\nFirst Alert Index: 0"
        },
        {
            "input": "4 50\n10 20 30 55",
            "expectedOutput": "Alerts: 1\nFirst Alert Index: 3"
        },
        {
            "input": "3 0\n0 0 0",
            "expectedOutput": "Alerts: 0\nFirst Alert Index: -1"
        },
        {
            "input": "5 -10\n-20 -10 -5 -8 -15",
            "expectedOutput": "Alerts: 2\nFirst Alert Index: 2"
        },
        {
            "input": "1 100\n100",
            "expectedOutput": "Alerts: 0\nFirst Alert Index: -1"
        },
        {
            "input": "1 100\n101",
            "expectedOutput": "Alerts: 1\nFirst Alert Index: 0"
        },
        {
            "input": "6 -50\n-60 -50 -49 -48 -51 -47",
            "expectedOutput": "Alerts: 3\nFirst Alert Index: 2"
        },
        {
            "input": "7 0\n1 2 3 4 5 6 7",
            "expectedOutput": "Alerts: 7\nFirst Alert Index: 0"
        },
        {
            "input": "5 10\n5 8 9 10 9",
            "expectedOutput": "Alerts: 0\nFirst Alert Index: -1"
        }
    ]
},
{
    "id": "java-arr-85",
    "number": "06",
    "title": "Battery Transaction Log",
    "slug": "battery-transaction-log",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Easy",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Array Traversal, Accumulation, Long Integers",
    "description": "A robotic charging station records changes to its stored energy.\nEvery transaction is represented by an integer:\n• A positive value represents energy added.\n• A negative value represents energy consumed.\n• Zero represents no change.\n\nThe station wants to calculate the net change in energy and count the transactions that caused no change.\n\nWrite a Java program that produces this summary.",
    "inputFormat": "The first line contains integer N. The second line contains N space-separated integers representing energy transactions.",
    "outputFormat": "Print:\nNet Change: X\nNo Change Events: Y",
    "constraints": "1 ≤ N ≤ 100000; -1000000000 ≤ Each transaction ≤ 1000000000",
    "sampleTestCases": [
        {
            "input": "6\n8 -3 0 -7 12 0",
            "expectedOutput": "Net Change: 10\nNo Change Events: 2",
            "explanation": "8 + (-3) + 0 + (-7) + 12 + 0 = 10. There are 2 zero transactions."
        }
    ],
    "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n\n        // Write your code here (use long for sum)\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• The net sum can exceed 32-bit int bounds: use a long accumulator initialized to 0L.\n• Count how many transactions equal 0.",
    "hiddenTestCases": [
        {
            "input": "3\n10 20 30",
            "expectedOutput": "Net Change: 60\nNo Change Events: 0"
        },
        {
            "input": "3\n-5 -15 -20",
            "expectedOutput": "Net Change: -40\nNo Change Events: 0"
        },
        {
            "input": "4\n0 0 0 0",
            "expectedOutput": "Net Change: 0\nNo Change Events: 4"
        },
        {
            "input": "1\n5",
            "expectedOutput": "Net Change: 5\nNo Change Events: 0"
        },
        {
            "input": "1\n0",
            "expectedOutput": "Net Change: 0\nNo Change Events: 1"
        },
        {
            "input": "4\n1000000000 1000000000 1000000000 0",
            "expectedOutput": "Net Change: 3000000000\nNo Change Events: 1"
        },
        {
            "input": "4\n-1000000000 -1000000000 -1000000000 0",
            "expectedOutput": "Net Change: -3000000000\nNo Change Events: 1"
        },
        {
            "input": "6\n500 -500 0 300 -300 0",
            "expectedOutput": "Net Change: 0\nNo Change Events: 2"
        },
        {
            "input": "5\n-100 200 -50 0 0",
            "expectedOutput": "Net Change: 50\nNo Change Events: 2"
        },
        {
            "input": "2\n1000000000 -1000000000",
            "expectedOutput": "Net Change: 0\nNo Change Events: 0"
        }
    ]
},
{
    "id": "java-arr-86",
    "number": "07",
    "title": "Robot Dock Swap",
    "slug": "robot-dock-swap",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Easy",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Array Access, Updating Elements, Swapping",
    "description": "An automated warehouse has N robot docking stations arranged in a row.\nEach station currently contains a robot identified by an integer ID.\n\nDuring maintenance, two robots must exchange their docking positions.\n\nWrite a Java program that performs the exchange and displays the updated sequence.\nThe positions use zero-based indexing.",
    "inputFormat": "The first line contains integer N. The second line contains N space-separated robot IDs. The third line contains two integers P Q representing the indexes to swap.",
    "outputFormat": "Print the updated array on a single line.",
    "constraints": "1 ≤ N ≤ 100000; 1 ≤ Each robot ID ≤ 1000000000; 0 ≤ P, Q < N",
    "sampleTestCases": [
        {
            "input": "5\n6 9 12 15 18\n1 3",
            "expectedOutput": "6 15 12 9 18",
            "explanation": "Exchanged index 1 (9) and index 3 (15)."
        }
    ],
    "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = sc.nextInt();\n        }\n        int p = sc.nextInt();\n        int q = sc.nextInt();\n\n        // Swap arr[p] and arr[q]\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• P and Q may be equal; in that case, the array remains unchanged.\n• Use a temporary variable to swap arr[p] and arr[q].",
    "hiddenTestCases": [
        {
            "input": "5\n10 20 30 40 50\n0 4",
            "expectedOutput": "50 20 30 40 10"
        },
        {
            "input": "4\n1 2 3 4\n1 2",
            "expectedOutput": "1 3 2 4"
        },
        {
            "input": "3\n7 8 9\n1 1",
            "expectedOutput": "7 8 9"
        },
        {
            "input": "1\n999\n0 0",
            "expectedOutput": "999"
        },
        {
            "input": "6\n5 5 10 10 15 15\n0 5",
            "expectedOutput": "15 5 10 10 15 5"
        },
        {
            "input": "2\n100 200\n0 1",
            "expectedOutput": "200 100"
        },
        {
            "input": "5\n1000000000 200000000 300000000 400000000 500000000\n0 2",
            "expectedOutput": "300000000 200000000 1000000000 400000000 500000000"
        },
        {
            "input": "4\n11 22 33 44\n3 0",
            "expectedOutput": "44 22 33 11"
        },
        {
            "input": "7\n1 3 5 7 9 11 13\n2 4",
            "expectedOutput": "1 3 9 7 5 11 13"
        }
    ]
},
{
    "id": "java-arr-87",
    "number": "08",
    "title": "Last Beacon Ping",
    "slug": "last-beacon-ping",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Medium",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Linear Search, Array Traversal, Index Tracking",
    "description": "A communication station records a sequence of beacon identifiers.\n\nA technician wants to know how many times a particular beacon appeared and the index of its most recent appearance.\n\nWrite a program to calculate:\n1. The total number of occurrences of beacon K.\n2. The zero-based index of the last occurrence.\n\nIf the beacon does not appear, the last index is -1.",
    "inputFormat": "The first line contains two integers: N K. The second line contains N space-separated beacon identifiers.",
    "outputFormat": "Print:\nOccurrences: X\nLast Index: Y",
    "constraints": "1 ≤ N ≤ 100000; -1000000000 ≤ K ≤ 1000000000; -1000000000 ≤ Each identifier ≤ 1000000000",
    "sampleTestCases": [
        {
            "input": "8 7\n4 7 4 9 4 7 8 7",
            "expectedOutput": "Occurrences: 3\nLast Index: 7",
            "explanation": "Beacon 7 appears 3 times (at index 1, 5, 7). Most recent is at index 7."
        }
    ],
    "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        long k = sc.nextLong();\n        long[] beacons = new long[n];\n        for (int i = 0; i < n; i++) {\n            beacons[i] = sc.nextLong();\n        }\n\n        // Write your code here\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• Track lastIndex initialized to -1.\n• Whenever beacons[i] == K, increment occurrences count and update lastIndex = i.",
    "hiddenTestCases": [
        {
            "input": "5 100\n1 2 3 4 5",
            "expectedOutput": "Occurrences: 0\nLast Index: -1"
        },
        {
            "input": "4 5\n5 1 2 3",
            "expectedOutput": "Occurrences: 1\nLast Index: 0"
        },
        {
            "input": "4 9\n1 2 3 9",
            "expectedOutput": "Occurrences: 1\nLast Index: 3"
        },
        {
            "input": "4 7\n7 7 7 7",
            "expectedOutput": "Occurrences: 4\nLast Index: 3"
        },
        {
            "input": "1 42\n42",
            "expectedOutput": "Occurrences: 1\nLast Index: 0"
        },
        {
            "input": "1 42\n40",
            "expectedOutput": "Occurrences: 0\nLast Index: -1"
        },
        {
            "input": "6 -10\n-10 20 -10 30 -10 40",
            "expectedOutput": "Occurrences: 3\nLast Index: 4"
        },
        {
            "input": "7 0\n0 1 0 2 0 3 0",
            "expectedOutput": "Occurrences: 4\nLast Index: 6"
        },
        {
            "input": "5 1000000000\n1000000000 2 3 1000000000 5",
            "expectedOutput": "Occurrences: 2\nLast Index: 3"
        },
        {
            "input": "6 -5\n1 -5 2 -5 3 4",
            "expectedOutput": "Occurrences: 2\nLast Index: 3"
        }
    ]
},
{
    "id": "java-arr-88",
    "number": "09",
    "title": "Rotating Exhibition Belt",
    "slug": "rotating-exhibition-belt",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Medium",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Arrays, Circular Rotation, Modulus",
    "description": "An exhibition center uses a circular display belt containing N objects.\n\nDuring each rotation, every object moves one position to the right.\nThe object at the last position moves to the first position.\n\nGiven the initial arrangement and the number of right rotations K, determine the final arrangement.",
    "inputFormat": "The first line contains N K. The second line contains N space-separated integers.",
    "outputFormat": "Print the final array after K right rotations on one line.",
    "constraints": "1 ≤ N ≤ 100000; 0 ≤ K ≤ 1000000000; -1000000000 ≤ Each element ≤ 1000000000",
    "sampleTestCases": [
        {
            "input": "5 2\n10 20 30 40 50",
            "expectedOutput": "40 50 10 20 30",
            "explanation": "After 2 right rotations, 40 and 50 move to the front."
        }
    ],
    "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        long k = sc.nextLong();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = sc.nextInt();\n        }\n\n        // Compute effective rotation: int r = (int)(k % n)\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• K may be much larger than N; take k = k % n.\n• An element at index i moves to (i + k) % n in the rotated array.",
    "hiddenTestCases": [
        {
            "input": "5 0\n10 20 30 40 50",
            "expectedOutput": "10 20 30 40 50"
        },
        {
            "input": "5 1\n10 20 30 40 50",
            "expectedOutput": "50 10 20 30 40"
        },
        {
            "input": "5 5\n10 20 30 40 50",
            "expectedOutput": "10 20 30 40 50"
        },
        {
            "input": "5 7\n10 20 30 40 50",
            "expectedOutput": "40 50 10 20 30"
        },
        {
            "input": "1 100\n42",
            "expectedOutput": "42"
        },
        {
            "input": "4 1000000000\n1 2 3 4",
            "expectedOutput": "1 2 3 4"
        },
        {
            "input": "4 1000000001\n1 2 3 4",
            "expectedOutput": "4 1 2 3"
        },
        {
            "input": "6 3\n-5 -4 -3 -2 -1 0",
            "expectedOutput": "-2 -1 0 -5 -4 -3"
        },
        {
            "input": "3 10\n100 200 300",
            "expectedOutput": "300 100 200"
        },
        {
            "input": "2 3\n9 8",
            "expectedOutput": "8 9"
        }
    ]
},
{
    "id": "java-arr-89",
    "number": "10",
    "title": "Terrain Sensor Jumps",
    "slug": "terrain-sensor-jumps",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Medium",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Adjacent Array Elements, Absolute Difference, Maximum Tracking",
    "description": "An exploration robot moves through a rocky landscape.\nAt each checkpoint, it records the terrain elevation.\n\nScientists want to identify the largest elevation change between any two consecutive checkpoints.\nThe change is calculated using the absolute difference between neighboring readings.\n\nWrite a program that determines the largest change.",
    "inputFormat": "The first line contains integer N. The second line contains N space-separated elevation readings.",
    "outputFormat": "Print:\nLargest Jump: X",
    "constraints": "2 ≤ N ≤ 100000; -1000000000 ≤ Each elevation ≤ 1000000000",
    "sampleTestCases": [
        {
            "input": "6\n3 12 -4 7 7 20",
            "expectedOutput": "Largest Jump: 16",
            "explanation": "Jumps are |12-3|=9, |-4-12|=16, |7-(-4)|=11, |7-7|=0, |20-7|=13. Largest is 16."
        }
    ],
    "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        long[] elev = new long[n];\n        for (int i = 0; i < n; i++) {\n            elev[i] = sc.nextLong();\n        }\n\n        // Track max absolute difference between consecutive checkpoints\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• Compare Math.abs(elev[i] - elev[i - 1]) for i from 1 to n - 1.\n• Elevation difference between 10^9 and -10^9 is 2*10^9; use long arithmetic.",
    "hiddenTestCases": [
        {
            "input": "2\n10 25",
            "expectedOutput": "Largest Jump: 15"
        },
        {
            "input": "4\n5 5 5 5",
            "expectedOutput": "Largest Jump: 0"
        },
        {
            "input": "4\n-10 -20 -15 -35",
            "expectedOutput": "Largest Jump: 20"
        },
        {
            "input": "5\n1 2 4 7 11",
            "expectedOutput": "Largest Jump: 4"
        },
        {
            "input": "5\n100 80 50 10 -40",
            "expectedOutput": "Largest Jump: 50"
        },
        {
            "input": "2\n1000000000 -1000000000",
            "expectedOutput": "Largest Jump: 2000000000"
        },
        {
            "input": "3\n-500000000 0 500000000",
            "expectedOutput": "Largest Jump: 500000000"
        },
        {
            "input": "6\n0 100 0 100 0 100",
            "expectedOutput": "Largest Jump: 100"
        },
        {
            "input": "5\n-5 5 -10 10 -20",
            "expectedOutput": "Largest Jump: 30"
        },
        {
            "input": "4\n12 18 20 22",
            "expectedOutput": "Largest Jump: 6"
        }
    ]
},
{
    "id": "java-arr-90",
    "number": "11",
    "title": "Even-First Parcel Order",
    "slug": "even-first-parcel-order",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Medium",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Arrays, Modulus, Stable Rearrangement",
    "description": "A delivery company processes parcels identified by integer codes.\n\nThe sorting machine follows a special arrangement rule:\n1. All even-numbered codes must appear first.\n2. All odd-numbered codes must appear afterward.\n\nThe original relative order of codes within the even and odd groups must remain unchanged.\n\nWrite a program to produce the rearranged list.",
    "inputFormat": "The first line contains integer N. The second line contains N space-separated integer codes.",
    "outputFormat": "Print the rearranged codes on one line.",
    "constraints": "1 ≤ N ≤ 100000; -1000000000 ≤ Each code ≤ 1000000000",
    "sampleTestCases": [
        {
            "input": "7\n5 8 3 6 2 9 4",
            "expectedOutput": "8 6 2 4 5 3 9",
            "explanation": "Evens: 8, 6, 2, 4. Odds: 5, 3, 9. Stable relative order preserved."
        }
    ],
    "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] codes = new int[n];\n        for (int i = 0; i < n; i++) {\n            codes[i] = sc.nextInt();\n        }\n\n        // Print all even codes first in original order, then all odd codes\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• In Java, negative even numbers satisfy code % 2 == 0.\n• Two separate loops over the array or separate collection lists ensure stable relative ordering.",
    "hiddenTestCases": [
        {
            "input": "4\n2 4 6 8",
            "expectedOutput": "2 4 6 8"
        },
        {
            "input": "4\n1 3 5 7",
            "expectedOutput": "1 3 5 7"
        },
        {
            "input": "4\n-2 -3 4 -5",
            "expectedOutput": "-2 4 -3 -5"
        },
        {
            "input": "3\n0 1 2",
            "expectedOutput": "0 2 1"
        },
        {
            "input": "1\n8",
            "expectedOutput": "8"
        },
        {
            "input": "1\n9",
            "expectedOutput": "9"
        },
        {
            "input": "6\n-10 -7 0 3 8 11",
            "expectedOutput": "-10 0 8 -7 3 11"
        },
        {
            "input": "5\n100 201 302 403 504",
            "expectedOutput": "100 302 504 201 403"
        },
        {
            "input": "6\n2 1 4 3 6 5",
            "expectedOutput": "2 4 6 1 3 5"
        },
        {
            "input": "4\n0 0 0 0",
            "expectedOutput": "0 0 0 0"
        }
    ]
},
{
    "id": "java-arr-91",
    "number": "12",
    "title": "Visitor Badge Deduplication",
    "slug": "visitor-badge-deduplication",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Medium",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Arrays, Duplicate Detection, Nested Loops",
    "description": "A conference registration system stores a sequence of visitor badge IDs.\nBecause visitors may scan their badges multiple times, the same ID can appear repeatedly.\n\nThe registration team wants a simplified list in which each distinct badge ID appears only once.\nKeep only the first occurrence of each ID and preserve the original order of those first occurrences.\n\nWrite a Java program that creates the simplified list.",
    "inputFormat": "The first line contains integer N. The second line contains N space-separated badge IDs.",
    "outputFormat": "Print:\nUnique Badges: X\nFollowed by the unique badge IDs in their first-occurrence order on the next line.",
    "constraints": "1 ≤ N ≤ 2000; -100000 ≤ Each badge ID ≤ 100000",
    "sampleTestCases": [
        {
            "input": "9\n5 2 5 7 2 8 7 7 9",
            "expectedOutput": "Unique Badges: 5\n5 2 7 8 9",
            "explanation": "Unique IDs in order of first appearance: 5, 2, 7, 8, 9."
        }
    ],
    "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] badges = new int[n];\n        for (int i = 0; i < n; i++) {\n            badges[i] = sc.nextInt();\n        }\n\n        // Deduplicate while preserving first-occurrence order\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• For each badge at index i, check if it already appeared at any index j < i.\n• Collect first-occurrence badges and output the count then the sequence.",
    "hiddenTestCases": [
        {
            "input": "4\n1 2 3 4",
            "expectedOutput": "Unique Badges: 4\n1 2 3 4"
        },
        {
            "input": "5\n9 9 9 9 9",
            "expectedOutput": "Unique Badges: 1\n9"
        },
        {
            "input": "4\n-10 20 -10 30",
            "expectedOutput": "Unique Badges: 3\n-10 20 30"
        },
        {
            "input": "1\n42",
            "expectedOutput": "Unique Badges: 1\n42"
        },
        {
            "input": "6\n5 5 5 1 2 3",
            "expectedOutput": "Unique Badges: 4\n5 1 2 3"
        },
        {
            "input": "6\n1 2 3 5 5 5",
            "expectedOutput": "Unique Badges: 4\n1 2 3 5"
        },
        {
            "input": "7\n0 10 0 20 0 30 0",
            "expectedOutput": "Unique Badges: 4\n0 10 20 30"
        },
        {
            "input": "8\n-5 -2 -5 0 2 -2 5 0",
            "expectedOutput": "Unique Badges: 5\n-5 -2 0 2 5"
        },
        {
            "input": "5\n100 200 100 200 300",
            "expectedOutput": "Unique Badges: 3\n100 200 300"
        },
        {
            "input": "4\n-100000 100000 -100000 100000",
            "expectedOutput": "Unique Badges: 2\n-100000 100000"
        }
    ]
},
{
    "id": "java-arr-92",
    "number": "13",
    "title": "Drone Cargo Leaderboard",
    "slug": "drone-cargo-leaderboard",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Hard",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Arrays, Sorting, Descending Order",
    "description": "A drone transportation company records the net cargo-weight adjustments made during several delivery missions.\n\nThe company wants to rank these adjustments from highest to lowest.\nWrite a Java program that sorts the values in descending numerical order.\n\nRepeated values must remain in the output.",
    "inputFormat": "The first line contains integer N. The second line contains N space-separated integers.",
    "outputFormat": "Print the values sorted in descending order on a single line.",
    "constraints": "1 ≤ N ≤ 2000; -1000000000 ≤ Each value ≤ 1000000000",
    "sampleTestCases": [
        {
            "input": "6\n18 7 18 -2 0 4",
            "expectedOutput": "18 18 7 4 0 -2",
            "explanation": "Ranked descending: 18, 18, 7, 4, 0, -2."
        }
    ],
    "starterCode": "import java.util.Scanner;\nimport java.util.Arrays;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        long[] arr = new long[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = sc.nextLong();\n        }\n\n        // Sort descending and print\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• Sort ascending using Arrays.sort(arr) and print in reverse order, or implement a custom sort.\n• Repeated elements must all be printed.",
    "hiddenTestCases": [
        {
            "input": "5\n50 40 30 20 10",
            "expectedOutput": "50 40 30 20 10"
        },
        {
            "input": "4\n-5 0 5 10",
            "expectedOutput": "10 5 0 -5"
        },
        {
            "input": "3\n7 7 7",
            "expectedOutput": "7 7 7"
        },
        {
            "input": "1\n9",
            "expectedOutput": "9"
        },
        {
            "input": "2\n3 8",
            "expectedOutput": "8 3"
        },
        {
            "input": "5\n-10 -20 -5 -30 -15",
            "expectedOutput": "-5 -10 -15 -20 -30"
        },
        {
            "input": "6\n1000000000 -1000000000 0 500000000 -500000000 100",
            "expectedOutput": "1000000000 500000000 100 0 -500000000 -1000000000"
        },
        {
            "input": "4\n0 0 0 0",
            "expectedOutput": "0 0 0 0"
        },
        {
            "input": "7\n12 5 8 19 1 2 15",
            "expectedOutput": "19 15 12 8 5 2 1"
        },
        {
            "input": "8\n4 2 8 6 1 3 7 5",
            "expectedOutput": "8 7 6 5 4 3 2 1"
        }
    ]
},
{
    "id": "java-arr-93",
    "number": "14",
    "title": "Merge Two Sensor Streams",
    "slug": "merge-two-sensor-streams",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Hard",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Arrays, Sorted Sequences, Two-Pointer Traversal",
    "description": "Two research devices independently collect integer measurements.\nEach device stores its measurements in non-decreasing order.\n\nScientists want to combine the two measurement sequences into one non-decreasing sequence.\nRepeated measurements must be preserved.\n\nWrite a Java program that produces the merged sequence.",
    "inputFormat": "The first line contains N M. The second line contains N sorted integers. The third line contains M sorted integers. (If a sequence has 0 elements, its line may be blank).",
    "outputFormat": "Print the merged measurements in non-decreasing order on one line.",
    "constraints": "0 ≤ N, M ≤ 100000; 1 ≤ N + M ≤ 200000; -1000000000 ≤ Each value ≤ 1000000000",
    "sampleTestCases": [
        {
            "input": "4 3\n1 4 4 10\n2 4 7",
            "expectedOutput": "1 2 4 4 4 7 10",
            "explanation": "Merged sorted sequence: 1 2 4 4 4 7 10."
        }
    ],
    "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int m = sc.nextInt();\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextLong();\n        long[] b = new long[m];\n        for (int j = 0; j < m; j++) b[j] = sc.nextLong();\n\n        // Merge two sorted arrays using two pointers in O(N + M) time\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• Use two pointers i and j comparing a[i] and b[j].\n• Advance the pointer of the smaller (or equal) element to maintain non-decreasing order.",
    "hiddenTestCases": [
        {
            "input": "0 3\n\n5 8 12",
            "expectedOutput": "5 8 12"
        },
        {
            "input": "3 0\n2 4 6\n",
            "expectedOutput": "2 4 6"
        },
        {
            "input": "1 1\n5\n3",
            "expectedOutput": "3 5"
        },
        {
            "input": "2 2\n3 3\n3 3",
            "expectedOutput": "3 3 3 3"
        },
        {
            "input": "2 2\n-10 -2\n-5 0",
            "expectedOutput": "-10 -5 -2 0"
        },
        {
            "input": "4 4\n1 3 5 7\n2 4 6 8",
            "expectedOutput": "1 2 3 4 5 6 7 8"
        },
        {
            "input": "3 3\n10 20 30\n1 2 3",
            "expectedOutput": "1 2 3 10 20 30"
        },
        {
            "input": "3 3\n1 2 3\n10 20 30",
            "expectedOutput": "1 2 3 10 20 30"
        },
        {
            "input": "5 5\n-100 -50 0 50 100\n-75 -25 25 75 125",
            "expectedOutput": "-100 -75 -50 -25 0 25 50 75 100 125"
        },
        {
            "input": "1 4\n10\n1 5 15 20",
            "expectedOutput": "1 5 10 15 20"
        }
    ]
},
{
    "id": "java-arr-94",
    "number": "15",
    "title": "Best Continuous Profit Window",
    "slug": "best-continuous-profit-window",
    "language": "Java",
    "categorySlug": "arrays",
    "difficulty": "Hard",
    "problemType": "lugaish",
    "sourcePlatform": "Lugaish",
    "concepts": "Arrays, Running Sums, Maximum Subarray",
    "description": "A small business records its net financial gain or loss at the end of each day.\nA positive number represents profit.\nA negative number represents loss.\n\nThe business wants to identify the consecutive period of one or more days that produces the greatest combined net result.\nThe selected period must consist of consecutive days.\n\nWrite a Java program that calculates the maximum sum of any non-empty contiguous subarray.",
    "inputFormat": "The first line contains integer N. The second line contains N space-separated integers representing daily gains and losses.",
    "outputFormat": "Print:\nBest Period: X",
    "constraints": "1 ≤ N ≤ 100000; -1000000 ≤ Each value ≤ 1000000",
    "sampleTestCases": [
        {
            "input": "8\n-3 4 -1 2 1 -5 4 2",
            "expectedOutput": "Best Period: 7",
            "explanation": "Contiguous segment 4 -1 2 1 -5 4 2 has sum 7."
        }
    ],
    "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        long[] arr = new long[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = sc.nextLong();\n        }\n\n        // Kadane's algorithm for maximum subarray sum\n        \n    }\n}\n",
    "timeLimit": 3,
    "memoryLimit": 128000,
    "notes": "• Use Kadane's algorithm in O(N) time.\n• Initialize maxSoFar and currentMax with the first element arr[0] (or Long.MIN_VALUE) so all-negative arrays return the single largest element.\n• Use long to avoid overflow.",
    "hiddenTestCases": [
        {
            "input": "1\n-5",
            "expectedOutput": "Best Period: -5"
        },
        {
            "input": "1\n10",
            "expectedOutput": "Best Period: 10"
        },
        {
            "input": "4\n-8 -3 -6 -2",
            "expectedOutput": "Best Period: -2"
        },
        {
            "input": "3\n10 20 30",
            "expectedOutput": "Best Period: 60"
        },
        {
            "input": "3\n0 0 0",
            "expectedOutput": "Best Period: 0"
        },
        {
            "input": "4\n10 20 -50 5",
            "expectedOutput": "Best Period: 30"
        },
        {
            "input": "4\n-10 2 15 20",
            "expectedOutput": "Best Period: 37"
        },
        {
            "input": "5\n1000000 1000000 1000000 1000000 1000000",
            "expectedOutput": "Best Period: 5000000"
        },
        {
            "input": "6\n-2 1 -3 4 -1 2",
            "expectedOutput": "Best Period: 5"
        },
        {
            "input": "5\n-100 -200 500 -100 -50",
            "expectedOutput": "Best Period: 500"
        }
    ]
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

