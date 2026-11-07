-- Migration 011: Add BCA Faculty, Subjects, Quizzes, and MCQ Questions
-- Description: Seeds the Bachelor of Computer Application (BCA) curriculum, subjects, quizzes, and 42 comprehensive MCQs.

BEGIN;

-- 1. Insert BCA Faculty under Bachelor's Degree
-- Note: faculties_or_streams schema has columns (id, program_id, name)
INSERT INTO public.faculties_or_streams (id, program_id, name)
VALUES (
  '22222222-0000-0000-0000-000000000016',
  '11111111-0000-0000-0000-000000000004',
  'Bachelor of Computer Application (BCA)'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name;

-- 2. Insert BCA Subjects
INSERT INTO public.subjects (id, faculty_id, name, grade_or_semester, description, icon_key, color_key)
VALUES
  ('33333333-0000-0000-0000-000000000080', '22222222-0000-0000-0000-000000000016', 'C Programming', 'Semester 1 (BCA)', 'Structured programming concepts, pointers, memory allocation, arrays, structures, and file IO in C.', 'computer', 'indigo'),
  ('33333333-0000-0000-0000-000000000081', '22222222-0000-0000-0000-000000000016', 'Computer Fundamentals & Applications', 'Semester 1 (BCA)', 'Computer hardware architecture, operating system basics, number systems, and business application software.', 'computer', 'blue'),
  ('33333333-0000-0000-0000-000000000082', '22222222-0000-0000-0000-000000000016', 'Discrete Mathematics', 'Semester 2 (BCA)', 'Sets, relations, recurrence relations, graph theory, trees, and logic gates for computer application students.', 'math', 'orange'),
  ('33333333-0000-0000-0000-000000000083', '22222222-0000-0000-0000-000000000016', 'Data Structures & Algorithms', 'Semester 3 (BCA)', 'Stacks, queues, linked lists, trees, graphs, hashing, sorting algorithms, and time complexity analysis.', 'computer', 'purple'),
  ('33333333-0000-0000-0000-000000000084', '22222222-0000-0000-0000-000000000016', 'Object Oriented Programming in Java', 'Semester 3 (BCA)', 'Java OOP, inheritance, interfaces, packages, exception handling, multithreading, and GUI with Swing.', 'computer', 'amber'),
  ('33333333-0000-0000-0000-000000000085', '22222222-0000-0000-0000-000000000016', 'Database Management System', 'Semester 4 (BCA)', 'ER modeling, relational schemas, SQL, normalization (1NF-BCNF), concurrency control, and transactions.', 'computer', 'green'),
  ('33333333-0000-0000-0000-000000000086', '22222222-0000-0000-0000-000000000016', 'Web Technology', 'Semester 4 (BCA)', 'HTML5, CSS3, modern JavaScript ES6+, PHP, MySQL backend, and building responsive dynamic web apps.', 'computer', 'rose')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  grade_or_semester = EXCLUDED.grade_or_semester,
  description = EXCLUDED.description,
  icon_key = EXCLUDED.icon_key,
  color_key = EXCLUDED.color_key;

-- 3. Insert BCA Quizzes
INSERT INTO public.quizzes (id, subject_id, title, question_count, time_limit_minutes)
VALUES
  ('44444444-0000-0000-0000-000000000080', '33333333-0000-0000-0000-000000000080', 'BCA C Programming — Pointers, Arrays & Memory Management', 6, 15),
  ('44444444-0000-0000-0000-000000000081', '33333333-0000-0000-0000-000000000081', 'BCA Computer Fundamentals & Architecture Mock Quiz', 6, 15),
  ('44444444-0000-0000-0000-000000000082', '33333333-0000-0000-0000-000000000082', 'BCA Discrete Mathematics — Propositional Logic & Graph Theory', 6, 15),
  ('44444444-0000-0000-0000-000000000083', '33333333-0000-0000-0000-000000000083', 'BCA Data Structures & Algorithms — Core Concepts & Big-O', 6, 15),
  ('44444444-0000-0000-0000-000000000084', '33333333-0000-0000-0000-000000000084', 'BCA Java OOP — Inheritance, Exceptions & Multithreading', 6, 15),
  ('44444444-0000-0000-0000-000000000085', '33333333-0000-0000-0000-000000000085', 'BCA DBMS — Relational Schemas, Normal Forms & SQL', 6, 15),
  ('44444444-0000-0000-0000-000000000086', '33333333-0000-0000-0000-000000000086', 'BCA Web Technology — HTML5, CSS3, JavaScript & PHP', 6, 15)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  question_count = EXCLUDED.question_count,
  time_limit_minutes = EXCLUDED.time_limit_minutes;

-- 4. Clean up existing questions for these BCA quizzes to allow idempotent execution
DELETE FROM public.questions
WHERE quiz_id IN (
  '44444444-0000-0000-0000-000000000080',
  '44444444-0000-0000-0000-000000000081',
  '44444444-0000-0000-0000-000000000082',
  '44444444-0000-0000-0000-000000000083',
  '44444444-0000-0000-0000-000000000084',
  '44444444-0000-0000-0000-000000000085',
  '44444444-0000-0000-0000-000000000086'
);

-- 5. Insert All 42 BCA MCQ Questions
INSERT INTO public.questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
  -- BCA C Programming
  ('44444444-0000-0000-0000-000000000080', 'Which format specifier is used to print the memory address of a pointer variable in C?', '%u', '%x', '%p', '%d', 'c', 'In C, %p is the standard format specifier used with printf to print pointer addresses.'),
  ('44444444-0000-0000-0000-000000000080', 'What is the primary difference between malloc() and calloc() in standard C?', 'malloc allocates contiguous memory while calloc does not', 'calloc initializes allocated memory to zero while malloc leaves it uninitialized', 'malloc is faster than calloc because it takes two arguments', 'calloc can only allocate memory on the stack', 'b', 'calloc(n, size) initializes all allocated bytes to zero, whereas malloc(size) leaves memory uninitialized with garbage values.'),
  ('44444444-0000-0000-0000-000000000080', 'Which operator cannot be overloaded or redefined in C?', 'sizeof', '+', '->', '==', 'a', 'C does not support operator overloading, and sizeof is evaluated at compile time.'),
  ('44444444-0000-0000-0000-000000000080', 'What will be the output of printf("%d", 10 >> 1); in C?', '20', '5', '10', '1', 'b', 'Right-shift operator >> 1 divides an integer by 2: 10 >> 1 = 5.'),
  ('44444444-0000-0000-0000-000000000080', 'In C, what is the size of a union that contains int a (4 bytes), double b (8 bytes), and char c[10] (10 bytes)?', '22 bytes', 'At least 10 bytes (padded to 16 bytes for double alignment)', '4 bytes', '8 bytes', 'b', 'A union allocates memory equal to its largest member (10 bytes), aligned to the largest scalar member.'),
  ('44444444-0000-0000-0000-000000000080', 'Which mode in fopen() opens an existing file for both reading and writing without truncating it?', '"w+"', '"a"', '"r+"', '"w"', 'c', '"r+" opens an existing text file for both reading and writing from the start without truncating it.'),

  -- BCA Computer Fundamentals
  ('44444444-0000-0000-0000-000000000081', 'Which register holds the memory address of the next machine instruction to be fetched?', 'Instruction Register (IR)', 'Memory Data Register (MDR)', 'Program Counter (PC)', 'Accumulator (AC)', 'c', 'The Program Counter (PC) stores the memory address of the next sequential instruction to execute.'),
  ('44444444-0000-0000-0000-000000000081', 'What is the 2''s complement of the 8-bit binary number 00001010 (+10)?', '11110101', '11110110', '11111010', '00001011', 'b', '1''s complement of 00001010 is 11110101; adding 1 yields 11110110 (-10).'),
  ('44444444-0000-0000-0000-000000000081', 'Why does DRAM (Dynamic RAM) require periodic electrical refreshing?', 'Because it uses flip-flops that consume continuous power', 'Because it uses tiny capacitors that gradually leak their electrical charge', 'To clear temporary data after each CPU clock cycle', 'To prevent thermal breakdown in magnetic memory', 'b', 'DRAM cells store bits as charge on microscopic capacitors that leak and must be refreshed thousands of times per second.'),
  ('44444444-0000-0000-0000-000000000081', 'Which memory hierarchy level has the smallest access time (fastest)?', 'L1 Cache', 'L2 Cache', 'CPU Registers', 'Main RAM', 'c', 'CPU registers reside directly inside the processor ALU/datapath and provide sub-nanosecond access.'),
  ('44444444-0000-0000-0000-000000000081', 'Which CPU scheduling algorithm is non-preemptive and selects the process with the shortest burst time?', 'Round Robin (RR)', 'Shortest Job First (SJF Non-preemptive)', 'Shortest Remaining Time First (SRTF)', 'Priority Preemptive', 'b', 'Non-preemptive SJF executes the process with the shortest CPU burst until completion.'),
  ('44444444-0000-0000-0000-000000000081', 'Which of the following is considered a Universal Logic Gate?', 'AND Gate', 'OR Gate', 'NAND Gate', 'XOR Gate', 'c', 'NAND and NOR gates are universal gates because any combinational circuit can be created using them alone.'),

  -- BCA Discrete Mathematics
  ('44444444-0000-0000-0000-000000000082', 'According to the Handshaking Theorem in graph theory, the sum of degrees of all vertices is equal to:', 'Number of edges |E|', '2 × Number of edges (2|E|)', 'Number of vertices |V|', '2 × Number of vertices (2|V|)', 'b', 'The Handshaking Lemma states that ∑ deg(v) = 2|E|, since every undirected edge contributes 2 to the total degree sum.'),
  ('44444444-0000-0000-0000-000000000082', 'A relation R on a set A is an equivalence relation if and only if it is:', 'Reflexive, Symmetric, and Transitive', 'Reflexive, Antisymmetric, and Transitive', 'Irreflexive, Symmetric, and Transitive', 'Reflexive and Symmetric only', 'a', 'By definition, an equivalence relation must satisfy reflexivity, symmetry, and transitivity.'),
  ('44444444-0000-0000-0000-000000000082', 'If a tree has 15 vertices, how many edges does it contain?', '15', '14', '16', '30', 'b', 'Any tree with n vertices has exactly n - 1 edges: 15 - 1 = 14 edges.'),
  ('44444444-0000-0000-0000-000000000082', 'What is the truth value of the compound proposition P → Q when P is False and Q is False?', 'False', 'True', 'Indeterminate', 'Contradictory', 'b', 'In material implication, False implies False is vacuously True.'),
  ('44444444-0000-0000-0000-000000000082', 'How many subsets does a set with 5 distinct elements have?', '25', '10', '32', '64', 'c', 'The power set of a set with n elements contains 2ⁿ subsets. For n = 5, 2⁵ = 32 subsets.'),
  ('44444444-0000-0000-0000-000000000082', 'A connected undirected graph contains an Euler circuit if and only if:', 'It has exactly two vertices of odd degree', 'Every vertex has an even degree', 'It contains no cycles', 'The number of vertices is prime', 'b', 'Euler''s theorem proves a connected graph has an Eulerian circuit iff every vertex has an even degree.'),

  -- BCA Data Structures & Algorithms
  ('44444444-0000-0000-0000-000000000083', 'Which data structure operates strictly on the Last-In, First-Out (LIFO) principle?', 'Queue', 'Stack', 'Binary Search Tree', 'Priority Queue', 'b', 'A Stack permits insertion and deletion only at one end (the top), enforcing LIFO order.'),
  ('44444444-0000-0000-0000-000000000083', 'What is the worst-case time complexity of the QuickSort algorithm?', 'O(n log n)', 'O(n²)', 'O(log n)', 'O(n)', 'b', 'QuickSort degrades to O(n²) when the chosen pivot is consistently the smallest or largest element.'),
  ('44444444-0000-0000-0000-000000000083', 'In a circular queue of capacity SIZE implemented using an array, the condition for being full is:', 'front == rear', '(rear + 1) % SIZE == front', '(front + 1) % SIZE == rear', 'rear == SIZE', 'b', 'In a circular queue, the full condition is (rear + 1) % SIZE == front.'),
  ('44444444-0000-0000-0000-000000000083', 'Which tree traversal of a Binary Search Tree (BST) produces keys in ascending sorted order?', 'Pre-order Traversal', 'In-order Traversal', 'Post-order Traversal', 'Level-order Traversal', 'b', 'In-order traversal visits (Left, Root, Right), which naturally outputs keys in ascending sorted order for a BST.'),
  ('44444444-0000-0000-0000-000000000083', 'The balance factor of any node in an AVL tree is defined as:', 'Height of Left Subtree - Height of Right Subtree', 'Number of Left Children - Number of Right Children', 'Depth of Root - Depth of Node', 'Total Nodes in Left Subtree / Total Nodes in Right Subtree', 'a', 'Balance factor = Height(Left) - Height(Right), and must be -1, 0, or +1 for all nodes in an AVL tree.'),
  ('44444444-0000-0000-0000-000000000083', 'Which algorithm finds a Minimum Spanning Tree (MST) using a greedy edge-by-edge approach with cycle detection?', 'Dijkstra''s Algorithm', 'Kruskal''s Algorithm', 'Bellman-Ford Algorithm', 'Floyd-Warshall Algorithm', 'b', 'Kruskal''s algorithm sorts edges by weight and greedily connects vertices while preventing cycles using Disjoint Sets.'),

  -- BCA Java OOP
  ('44444444-0000-0000-0000-000000000084', 'In Java, what is the key difference between final, finally, and finalize()?', 'final is a block, finally is a method, finalize is an access modifier', 'final is a modifier, finally is a cleanup block in exception handling, finalize() is a method called before GC', 'final creates constant objects only, finally throws exceptions, finalize is an interface', 'They are identical in modern Java', 'b', 'final defines immutable variables/classes/methods; finally is a block that always executes after try-catch; finalize() is invoked prior to garbage collection.'),
  ('44444444-0000-0000-0000-000000000084', 'Why does Java not support multiple inheritance of classes directly?', 'Due to CPU instruction limits', 'To avoid the Diamond Problem and ambiguous method resolutions', 'Because classes in Java cannot have constructors', 'Because Java bytecode only supports single pointers', 'b', 'Java avoids ambiguous method inheritance (the Diamond Problem) by enforcing single class inheritance while supporting multiple interfaces.'),
  ('44444444-0000-0000-0000-000000000084', 'Which collection class in Java is synchronized and thread-safe by default?', 'ArrayList', 'Vector', 'LinkedList', 'HashSet', 'b', 'Vector is synchronized and thread-safe, whereas ArrayList is unsynchronized for higher single-threaded throughput.'),
  ('44444444-0000-0000-0000-000000000084', 'What happens when an unhandled NullPointerException occurs during Java runtime?', 'The JVM automatically initializes the reference to a default object', 'The current thread terminates and outputs an exception stack trace', 'The compiler re-runs with debug flags', 'The program restarts from main()', 'b', 'NullPointerException is an unchecked RuntimeException that aborts the thread if left uncaught.'),
  ('44444444-0000-0000-0000-000000000084', 'Which access modifier allows members to be accessible within the package and by subclasses in other packages?', 'private', 'default (package-private)', 'protected', 'public', 'c', 'protected permits access within the defining package and to subclasses in different packages.'),
  ('44444444-0000-0000-0000-000000000084', 'In Java, String objects are immutable. What does this mean?', 'A String reference variable cannot be reassigned', 'Once created, the character sequence inside a String object cannot be altered', 'Strings can only be stored in CPU cache', 'Strings cannot be passed as method arguments', 'b', 'String immutability means the character content cannot change in-place; modifications create new String objects.'),

  -- BCA DBMS
  ('44444444-0000-0000-0000-000000000085', 'Which ACID property guarantees that either all operations of a transaction succeed or none are applied?', 'Consistency', 'Isolation', 'Atomicity', 'Durability', 'c', 'Atomicity guarantees all-or-nothing execution for database transactions.'),
  ('44444444-0000-0000-0000-000000000085', 'A database relation is in Second Normal Form (2NF) if it is in 1NF and:', 'Has no transitive functional dependencies', 'Has no partial functional dependencies on candidate keys', 'Every determinant is a super key', 'Contains only numeric columns', 'b', '2NF requires all non-prime attributes to be fully functionally dependent on the primary key, eliminating partial dependencies.'),
  ('44444444-0000-0000-0000-000000000085', 'What is the primary difference between WHERE and HAVING clauses in SQL?', 'WHERE filters rows before grouping; HAVING filters groups after GROUP BY', 'WHERE is only used with SELECT; HAVING is used with UPDATE', 'WHERE can use aggregate functions like COUNT(); HAVING cannot', 'They are completely interchangeable in ANSI SQL', 'a', 'WHERE filters individual candidate rows prior to aggregation, while HAVING filters grouped results after GROUP BY.'),
  ('44444444-0000-0000-0000-000000000085', 'In relational algebra, which operator returns tuples that are present in relation R but not in relation S?', 'Union (R ∪ S)', 'Cartesian Product (R × S)', 'Set Difference (R - S)', 'Intersection (R ∩ S)', 'c', 'Set Difference (R - S) selects tuples present in R that do not exist in relation S.'),
  ('44444444-0000-0000-0000-000000000085', 'What is the role of a Foreign Key constraint in relational schemas?', 'To automatically encrypt sensitive columns', 'To enforce referential integrity between child and parent tables', 'To generate auto-incrementing integer IDs', 'To enable full-text indexing on char columns', 'b', 'A Foreign Key enforces referential integrity by ensuring values in the child table reference valid primary keys in the parent table.'),
  ('44444444-0000-0000-0000-000000000085', 'Which concurrency protocol guarantees conflict serializability without allowing cascading rollbacks?', 'Strict Two-Phase Locking (Strict 2PL)', 'Simple Read Locking', 'Timestamp Ordering without validation', 'Dirty Read Isolation', 'a', 'Strict 2PL holds all exclusive write locks until transaction completion, ensuring serializability and avoiding cascading rollbacks.'),

  -- BCA Web Technology
  ('44444444-0000-0000-0000-000000000086', 'What is the difference between == and === in JavaScript?', '== checks both value and data type; === converts types automatically', '== performs type coercion before comparison; === checks strict equality without type conversion', '== is for numbers only; === is for strings', '== assigns values; === compares values', 'b', '=== checks strict equality with no type coercion; == coerces values to common types before comparing.'),
  ('44444444-0000-0000-0000-000000000086', 'Which CSS Flexbox property distributes items along the main axis?', 'align-items', 'justify-content', 'align-content', 'flex-direction', 'b', 'justify-content controls alignment and spacing of flex items along the main axis.'),
  ('44444444-0000-0000-0000-000000000086', 'How does localStorage differ from sessionStorage in web browsers?', 'localStorage expires after 24 hours; sessionStorage never expires', 'localStorage persists across browser tabs and sessions; sessionStorage clears when the tab is closed', 'localStorage only stores binary files; sessionStorage stores text', 'sessionStorage is encrypted while localStorage is plain text', 'b', 'localStorage persists permanently until explicitly removed; sessionStorage is isolated to the tab session.'),
  ('44444444-0000-0000-0000-000000000086', 'In the DOM event flow, what is the phase called when an event propagates upwards to the root document?', 'Capturing Phase', 'Target Phase', 'Bubbling Phase', 'Dispatching Phase', 'c', 'Event Bubbling propagates an event from the deepest target element upwards through parent ancestor nodes.'),
  ('44444444-0000-0000-0000-000000000086', 'In PHP, which superglobal array is populated when an HTML form is submitted with method="POST"?', '$_GET', '$_POST', '$_REQUEST_DATA', '$_FORM', 'b', '$_POST is the superglobal associative array containing data sent via HTTP POST requests.'),
  ('44444444-0000-0000-0000-000000000086', 'Which HTTP response status code indicates that the requested resource could not be found?', '200 OK', '301 Moved Permanently', '404 Not Found', '500 Internal Server Error', 'c', 'HTTP 404 Not Found signifies that the origin server did not find a current representation for the target URL.')
;

COMMIT;
