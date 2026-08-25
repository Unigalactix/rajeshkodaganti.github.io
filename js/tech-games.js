// Tech Games - Educational Games for Learning Programming Concepts
// Updated: 2025-07-24 with Speed Typing Test Game
class TechGamesManager {
    constructor() {
        this.currentGame = null;
        this.score = 0;
        this.currentLevel = 1;
        this.typingListenersBound = false;
        this.quizListenersBound = false;

        // Typing Test Game State
        this.typingGame = {
            currentText: '',
            userInput: '',
            startTime: null,
            endTime: null,
            errors: 0,
            currentCharIndex: 0,
            isActive: false,
            timeLimit: 60, // seconds
            mode: 'time', // 'time' or 'words'
            difficulty: 'medium',
            playerName: ''
        };

        // Leaderboard System
        this.leaderboard = this.loadLeaderboard();

        this.questions = {
            typing_test: {
                // Programming-themed typing tests
                easy: [
                    "function hello() { console.log('Hello World'); }",
                    "let x = 10; let y = 20; let sum = x + y;",
                    "if (true) { return 'success'; } else { return 'fail'; }",
                    "const array = [1, 2, 3, 4, 5]; array.push(6);",
                    "for (let i = 0; i < 10; i++) { console.log(i); }",
                    "const user = { name: 'John', age: 30, city: 'New York' };",
                    "function add(a, b) { return a + b; } add(5, 3);",
                    "const message = 'Hello, ' + name + '!'; alert(message);",
                    "try { riskyFunction(); } catch (error) { console.error(error); }",
                    "const numbers = [1, 2, 3].map(n => n * 2); console.log(numbers);"
                ],
                medium: [
                    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
                    "Programming is the art of telling another human being what one wants the computer to do.",
                    "Code is like humor. When you have to explain it, it's bad. Clean code always looks like it was written by someone who cares.",
                    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
                    "First, solve the problem. Then, write the code. The best error message is the one that never shows up.",
                    "There are only two hard things in Computer Science: cache invalidation and naming things.",
                    "Programming isn't about what you know; it's about what you can figure out. Talk is cheap. Show me the code.",
                    "The most important skill for a programmer is the ability to effectively communicate with other human beings.",
                    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
                    "Walking on water and developing software from a specification are easy if both are frozen."
                ],
                hard: [
                    "Implementation details matter. Abstractions are leaky. Performance is a feature. Premature optimization is the root of all evil, but when you need it, you really need it. The best code is no code at all.",
                    "In the world of software development, there are two types of people: those who understand recursion, and those who don't understand recursion, and those who understand recursion.",
                    "The fundamental problem with program testing is that testing can be used to show the presence of bugs, but never to show their absence. Every program has at least one bug and can be shortened by at least one instruction.",
                    "Measuring programming progress by lines of code is like measuring aircraft building progress by weight. The bearing of a child takes nine months, no matter how many women are assigned.",
                    "Computer science education cannot make anybody an expert programmer any more than studying brushes and pigment can make somebody an expert painter. The most amazing achievement of the computer software industry is its continuing cancellation of the steady and staggering gains made by the computer hardware industry.",
                    "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies. The first method is far more difficult."
                ],
                // Code snippets for programming practice
                code_snippets: [
                    "function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = arr.filter(x => x < pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}",
                    "class LinkedList {\n  constructor() {\n    this.head = null;\n    this.size = 0;\n  }\n  \n  add(data) {\n    const node = { data, next: null };\n    if (!this.head) {\n      this.head = node;\n    } else {\n      let current = this.head;\n      while (current.next) current = current.next;\n      current.next = node;\n    }\n    this.size++;\n  }\n}",
                    "async function fetchUserData(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}`);\n    if (!response.ok) throw new Error('User not found');\n    const userData = await response.json();\n    return userData;\n  } catch (error) {\n    console.error('Error fetching user data:', error);\n    throw error;\n  }\n}",
                    "const fibonacci = (n, memo = {}) => {\n  if (n in memo) return memo[n];\n  if (n <= 2) return 1;\n  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);\n  return memo[n];\n};\n\nconst result = fibonacci(40);\nconsole.log(`Fibonacci(40) = ${result}`);"
                ]
            },
            c_language: [
                {
                    question: "What is the correct syntax to print 'Hello World' in C?",
                    options: ["print('Hello World')", "printf('Hello World');", "cout << 'Hello World';", "echo 'Hello World';"],
                    correct: 1,
                    explanation: "printf() is the standard function in C to print formatted output to the screen."
                },
                {
                    question: "Which header file is needed for printf() function?",
                    options: ["<iostream>", "<string.h>", "<stdio.h>", "<stdlib.h>"],
                    correct: 2,
                    explanation: "stdio.h stands for 'standard input output header' and contains printf() function."
                },
                {
                    question: "What is the correct way to declare an integer variable in C?",
                    options: ["int x;", "integer x;", "var x;", "number x;"],
                    correct: 0,
                    explanation: "In C, 'int' is the keyword used to declare integer variables."
                },
                {
                    question: "Which symbol is used to end a statement in C?",
                    options: [":", ".", ";", ","],
                    correct: 2,
                    explanation: "Semicolon (;) is used to terminate statements in C programming."
                },
                {
                    question: "What does '&' operator do in scanf()?",
                    options: ["Logical AND", "Address of variable", "Bitwise AND", "String concatenation"],
                    correct: 1,
                    explanation: "The '&' operator gets the memory address of a variable for scanf() to store input."
                },
                {
                    question: "Which loop executes at least once?",
                    options: ["for loop", "while loop", "do-while loop", "nested loop"],
                    correct: 2,
                    explanation: "do-while loop checks condition after execution, so it runs at least once."
                },
                {
                    question: "What is the size of 'int' data type in most systems?",
                    options: ["1 byte", "2 bytes", "4 bytes", "8 bytes"],
                    correct: 2,
                    explanation: "On most modern systems, 'int' is typically 4 bytes (32 bits)."
                },
                {
                    question: "Which function is used to find string length in C?",
                    options: ["length()", "strlen()", "size()", "count()"],
                    correct: 1,
                    explanation: "strlen() function from string.h header returns the length of a string."
                }
            ],
            python: [
                {
                    question: "How do you print 'Hello World' in Python?",
                    options: ["printf('Hello World')", "print('Hello World')", "echo 'Hello World'", "console.log('Hello World')"],
                    correct: 1,
                    explanation: "print() is the built-in function in Python to display output."
                },
                {
                    question: "Which symbol is used for comments in Python?",
                    options: ["//", "/*", "#", "<!--"],
                    correct: 2,
                    explanation: "Hash symbol (#) is used for single-line comments in Python."
                },
                {
                    question: "What is the correct way to create a list in Python?",
                    options: ["list = {1, 2, 3}", "list = (1, 2, 3)", "list = [1, 2, 3]", "list = <1, 2, 3>"],
                    correct: 2,
                    explanation: "Square brackets [] are used to create lists in Python."
                },
                {
                    question: "Which keyword is used to define a function in Python?",
                    options: ["function", "def", "func", "define"],
                    correct: 1,
                    explanation: "'def' keyword is used to define functions in Python."
                },
                {
                    question: "How do you get user input in Python?",
                    options: ["scanf()", "input()", "read()", "get()"],
                    correct: 1,
                    explanation: "input() function is used to get user input in Python."
                },
                {
                    question: "What does 'len()' function do?",
                    options: ["Length of string/list", "Last element", "First element", "Sort elements"],
                    correct: 0,
                    explanation: "len() returns the number of items in an object like string, list, etc."
                },
                {
                    question: "Which method adds an element to the end of a list?",
                    options: ["add()", "append()", "insert()", "push()"],
                    correct: 1,
                    explanation: "append() method adds a single element to the end of a list."
                },
                {
                    question: "What is the correct syntax for an if statement?",
                    options: ["if x = 5:", "if (x == 5):", "if x == 5:", "if x equals 5:"],
                    correct: 2,
                    explanation: "Python uses 'if condition:' syntax with a colon at the end."
                }
            ],
            github: [
                {
                    question: "Which command initializes a new Git repository?",
                    options: ["git start", "git init", "git create", "git new"],
                    correct: 1,
                    explanation: "'git init' creates a new Git repository in the current directory."
                },
                {
                    question: "How do you add all files to staging area?",
                    options: ["git add *", "git add all", "git add .", "git stage all"],
                    correct: 2,
                    explanation: "'git add .' adds all modified files in the current directory to staging."
                },
                {
                    question: "Which command commits changes with a message?",
                    options: ["git commit 'message'", "git commit -m 'message'", "git save -m 'message'", "git push 'message'"],
                    correct: 1,
                    explanation: "'git commit -m' commits staged changes with a commit message."
                },
                {
                    question: "How do you check the status of your repository?",
                    options: ["git check", "git status", "git info", "git state"],
                    correct: 1,
                    explanation: "'git status' shows the status of files in your working directory."
                },
                {
                    question: "Which command uploads changes to GitHub?",
                    options: ["git upload", "git send", "git push", "git sync"],
                    correct: 2,
                    explanation: "'git push' uploads your committed changes to the remote repository."
                },
                {
                    question: "How do you create a new branch?",
                    options: ["git branch new-branch", "git create new-branch", "git checkout new-branch", "git new new-branch"],
                    correct: 0,
                    explanation: "'git branch branch-name' creates a new branch with the specified name."
                },
                {
                    question: "Which command downloads changes from GitHub?",
                    options: ["git download", "git pull", "git fetch", "git get"],
                    correct: 1,
                    explanation: "'git pull' downloads and merges changes from the remote repository."
                },
                {
                    question: "How do you switch to a different branch?",
                    options: ["git switch branch-name", "git change branch-name", "git checkout branch-name", "git goto branch-name"],
                    correct: 2,
                    explanation: "'git checkout branch-name' switches to the specified branch."
                }
            ],
            html: [
                {
                    question: "What does HTML stand for?",
                    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
                    correct: 0,
                    explanation: "HTML stands for Hypertext Markup Language, used to create web pages."
                },
                {
                    question: "Which tag is used to create a hyperlink?",
                    options: ["<link>", "<a>", "<href>", "<url>"],
                    correct: 1,
                    explanation: "The <a> tag (anchor tag) is used to create hyperlinks in HTML."
                },
                {
                    question: "What is the correct way to create a heading in HTML?",
                    options: ["<heading>", "<h1>", "<head>", "<title>"],
                    correct: 1,
                    explanation: "HTML headings are created using <h1> to <h6> tags, with <h1> being the largest."
                },
                {
                    question: "Which tag is used to display images?",
                    options: ["<image>", "<img>", "<pic>", "<photo>"],
                    correct: 1,
                    explanation: "The <img> tag is used to embed images in HTML documents."
                },
                {
                    question: "What is the correct HTML for creating a line break?",
                    options: ["<break>", "<lb>", "<br>", "<newline>"],
                    correct: 2,
                    explanation: "The <br> tag creates a line break in HTML."
                },
                {
                    question: "Which attribute specifies the URL of a link?",
                    options: ["src", "href", "url", "link"],
                    correct: 1,
                    explanation: "The 'href' attribute in the <a> tag specifies the URL of the link."
                },
                {
                    question: "What tag is used to create an unordered list?",
                    options: ["<ol>", "<ul>", "<list>", "<li>"],
                    correct: 1,
                    explanation: "The <ul> tag creates an unordered (bulleted) list in HTML."
                },
                {
                    question: "Which tag defines the document type in HTML5?",
                    options: ["<doctype>", "<!DOCTYPE html>", "<html5>", "<!DOCTYPE HTML>"],
                    correct: 1,
                    explanation: "<!DOCTYPE html> declares the document as HTML5."
                }
            ],
            java: [
                {
                    question: "Which method is the entry point of a Java program?",
                    options: ["start()", "main()", "run()", "begin()"],
                    correct: 1,
                    explanation: "The main() method is the entry point where Java program execution begins."
                },
                {
                    question: "How do you print text to the console in Java?",
                    options: ["print('text')", "System.out.println('text')", "console.log('text')", "printf('text')"],
                    correct: 1,
                    explanation: "System.out.println() is used to print text to the console in Java."
                },
                {
                    question: "Which keyword is used to create a class in Java?",
                    options: ["class", "Class", "create", "new"],
                    correct: 0,
                    explanation: "The 'class' keyword is used to define a class in Java."
                },
                {
                    question: "What is the correct way to declare an integer variable?",
                    options: ["int x;", "integer x;", "Integer x;", "var x;"],
                    correct: 0,
                    explanation: "'int' is the primitive data type for integers in Java."
                },
                {
                    question: "Which operator is used for string concatenation in Java?",
                    options: ["&", ".", "+", "concat"],
                    correct: 2,
                    explanation: "The '+' operator is used to concatenate strings in Java."
                },
                {
                    question: "What keyword is used to create an object?",
                    options: ["create", "new", "object", "instance"],
                    correct: 1,
                    explanation: "The 'new' keyword is used to create objects in Java."
                },
                {
                    question: "Which access modifier makes a member accessible everywhere?",
                    options: ["private", "protected", "public", "default"],
                    correct: 2,
                    explanation: "'public' access modifier makes class members accessible from anywhere."
                },
                {
                    question: "What is the extension of Java source files?",
                    options: [".java", ".class", ".jar", ".jvm"],
                    correct: 0,
                    explanation: "Java source files have the .java extension."
                }
            ],
            powershell: [
                {
                    question: "What is the correct command to list files and folders in PowerShell?",
                    options: ["ls", "dir", "Get-ChildItem", "list"],
                    correct: 2,
                    explanation: "Get-ChildItem is the PowerShell cmdlet to list directory contents (ls and dir are aliases)."
                },
                {
                    question: "Which command displays the current working directory?",
                    options: ["pwd", "Get-Location", "whereami", "current-dir"],
                    correct: 1,
                    explanation: "Get-Location shows the current working directory (pwd is an alias)."
                },
                {
                    question: "How do you get help for a PowerShell command?",
                    options: ["help command", "Get-Help command", "man command", "command --help"],
                    correct: 1,
                    explanation: "Get-Help cmdlet provides detailed help information for PowerShell commands."
                },
                {
                    question: "What symbol is used for variables in PowerShell?",
                    options: ["#", "&", "$", "%"],
                    correct: 2,
                    explanation: "Variables in PowerShell are prefixed with the dollar sign ($)."
                },
                {
                    question: "Which command creates a new directory?",
                    options: ["mkdir", "New-Item -ItemType Directory", "md", "All of the above"],
                    correct: 3,
                    explanation: "All options work: mkdir and md are aliases for New-Item -ItemType Directory."
                },
                {
                    question: "How do you pipe output from one command to another?",
                    options: [">>", "|", "->", "=>"],
                    correct: 1,
                    explanation: "The pipe symbol (|) passes output from one cmdlet to another in PowerShell."
                },
                {
                    question: "Which command stops a running process?",
                    options: ["Stop-Process", "Kill-Process", "End-Process", "Terminate-Process"],
                    correct: 0,
                    explanation: "Stop-Process cmdlet terminates running processes in PowerShell."
                },
                {
                    question: "What does 'Get-Command' do?",
                    options: ["Shows command history", "Lists available commands", "Executes a command", "Creates a new command"],
                    correct: 1,
                    explanation: "Get-Command lists all available PowerShell commands and their sources."
                }
            ],
            linux: [
                {
                    question: "Which command lists files and directories in Linux?",
                    options: ["list", "ls", "dir", "show"],
                    correct: 1,
                    explanation: "The 'ls' command lists files and directories in Linux/Unix systems."
                },
                {
                    question: "How do you change to the parent directory?",
                    options: ["cd ..", "cd up", "cd parent", "cd -1"],
                    correct: 0,
                    explanation: "cd .. moves to the parent directory (.. represents parent directory)."
                },
                {
                    question: "Which command shows the current working directory?",
                    options: ["cwd", "pwd", "where", "current"],
                    correct: 1,
                    explanation: "pwd (print working directory) displays the current directory path."
                },
                {
                    question: "How do you copy a file in Linux?",
                    options: ["copy source dest", "cp source dest", "duplicate source dest", "clone source dest"],
                    correct: 1,
                    explanation: "The 'cp' command copies files or directories in Linux."
                },
                {
                    question: "Which command removes a file?",
                    options: ["delete", "remove", "rm", "del"],
                    correct: 2,
                    explanation: "The 'rm' command removes (deletes) files in Linux."
                },
                {
                    question: "How do you display file contents?",
                    options: ["show", "display", "cat", "view"],
                    correct: 2,
                    explanation: "The 'cat' command displays the contents of a file."
                },
                {
                    question: "Which command changes file permissions?",
                    options: ["chmod", "chown", "perm", "access"],
                    correct: 0,
                    explanation: "chmod (change mode) modifies file and directory permissions."
                },
                {
                    question: "How do you search for text in files?",
                    options: ["find", "search", "grep", "locate"],
                    correct: 2,
                    explanation: "grep searches for patterns/text within files in Linux."
                }
            ],
            verilog: [
                {
                    question: "What keyword is used to define a module in Verilog?",
                    options: ["module", "entity", "component", "block"],
                    correct: 0,
                    explanation: "The 'module' keyword is used to define a design unit in Verilog."
                },
                {
                    question: "Which data type represents a single bit in Verilog?",
                    options: ["bit", "wire", "reg", "logic"],
                    correct: 1,
                    explanation: "'wire' is used to represent connections and single bits in Verilog."
                },
                {
                    question: "What operator is used for bitwise AND in Verilog?",
                    options: ["&&", "&", "AND", "and"],
                    correct: 1,
                    explanation: "The '&' operator performs bitwise AND operation in Verilog."
                },
                {
                    question: "Which keyword ends a module definition?",
                    options: ["end", "endmodule", "finish", "stop"],
                    correct: 1,
                    explanation: "'endmodule' keyword marks the end of a module definition."
                },
                {
                    question: "What is used to model sequential logic?",
                    options: ["assign", "always", "wire", "initial"],
                    correct: 1,
                    explanation: "'always' blocks are used to model sequential and combinational logic."
                },
                {
                    question: "Which event triggers on positive clock edge?",
                    options: ["posedge", "negedge", "edge", "clock"],
                    correct: 0,
                    explanation: "'posedge' keyword detects the positive (rising) edge of a signal."
                },
                {
                    question: "What data type can store values in Verilog?",
                    options: ["wire", "reg", "net", "signal"],
                    correct: 1,
                    explanation: "'reg' data type can hold values and is used in procedural blocks."
                },
                {
                    question: "Which statement is used for continuous assignment?",
                    options: ["always", "assign", "initial", "task"],
                    correct: 1,
                    explanation: "'assign' statement is used for continuous assignments in Verilog."
                }
            ]
        };
        this.init();
    }

    // Leaderboard methods
    loadLeaderboard() {
        try {
            const savedLeaderboard = localStorage.getItem('typingTestLeaderboard');
            return savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            return [];
        }
    }

    saveLeaderboard() {
        try {
            localStorage.setItem('typingTestLeaderboard', JSON.stringify(this.leaderboard));
        } catch (error) {
            console.error('Error saving leaderboard:', error);
        }
    }

    addToLeaderboard(playerName, wpm, accuracy, errors, difficulty, mode) {
        const score = {
            name: playerName,
            wpm: wpm,
            accuracy: accuracy,
            errors: errors,
            difficulty: difficulty,
            mode: mode,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        };

        this.leaderboard.push(score);

        // Sort by WPM descending, then by accuracy descending, then by errors ascending
        this.leaderboard.sort((a, b) => {
            if (b.wpm !== a.wpm) return b.wpm - a.wpm;
            if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
            return a.errors - b.errors;
        });

        // Keep only top 5
        this.leaderboard = this.leaderboard.slice(0, 5);

        this.saveLeaderboard();

        // Find the rank of this score
        const scoreIndex = this.leaderboard.findIndex(s => s.timestamp === score.timestamp);
        return scoreIndex >= 0 ? scoreIndex + 1 : -1; // Return rank (1-based) or -1 if not found
    }

    displayLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');

        if (this.leaderboard.length === 0) {
            leaderboardList.innerHTML = '<div class="empty-leaderboard">No scores yet. Be the first to play!</div>';
            return;
        }

        leaderboardList.innerHTML = this.leaderboard.map((score, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

            return `
                <div class="leaderboard-entry ${rankClass}">
                    <div class="leaderboard-rank">${medal || rank}</div>
                    <div class="leaderboard-name">${score.name}</div>
                    <div class="leaderboard-stats">
                        <div class="leaderboard-stat">
                            <span class="leaderboard-stat-value">${score.wpm}</span>
                            <span class="leaderboard-stat-label">WPM</span>
                        </div>
                        <div class="leaderboard-stat">
                            <span class="leaderboard-stat-value">${score.accuracy}%</span>
                            <span class="leaderboard-stat-label">Accuracy</span>
                        </div>
                        <div class="leaderboard-stat">
                            <span class="leaderboard-stat-value">${score.errors}</span>
                            <span class="leaderboard-stat-label">Errors</span>
                        </div>
                        <div class="leaderboard-stat">
                            <span class="leaderboard-stat-value">${score.difficulty}</span>
                            <span class="leaderboard-stat-label">Difficulty</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    showPlayerNameInput() {
        document.getElementById('playerNameInput').style.display = 'block';
        document.getElementById('playerNameField').focus();
    }

    hidePlayerNameInput() {
        document.getElementById('playerNameInput').style.display = 'none';
    }

    showLeaderboardDisplay() {
        this.displayLeaderboard();
        document.getElementById('leaderboardDisplay').style.display = 'block';
    }

    hideLeaderboardDisplay() {
        document.getElementById('leaderboardDisplay').style.display = 'none';
    }

    init() {
        // Add event listener for Tech Games button
        const techGamesBtn = document.getElementById('techGamesButton');
        if (techGamesBtn) {
            techGamesBtn.addEventListener('click', () => this.showTechGamesModal());
        }
    }

    showTechGamesModal() {
        // Create or show tech games modal
        let modal = document.getElementById('techGamesModal');

        if (!modal) {
            console.log('Creating Tech Games Modal');
            modal = this.createTechGamesModal();
            document.body.appendChild(modal);
        }

        modal.style.display = 'flex';
        modal.classList.add('is-open');
        document.body.classList.add('game-modal-open');

        // Ensure typing game card is present
        this.ensureTypingGameCard();

        this.showGameSelection();
    }

    ensureTypingGameCard() {
        const grid = document.querySelector('.tech-games-grid');
        let typingCard = document.querySelector('.tech-game-card[data-game="typing_test"]');

        if (!typingCard && grid) {
            console.log('Typing card not found, creating it manually');
            typingCard = document.createElement('div');
            typingCard.className = 'tech-game-card recommended';
            typingCard.dataset.game = 'typing_test';
            typingCard.innerHTML = `
                <div class="tech-game-icon">⌨️</div>
                <div class="recommended-badge">🌟 RECOMMENDED</div>
                <h4>Speed Typing Test</h4>
                <p>Improve your typing speed and accuracy with MonkeyType-inspired challenges</p>
                <div class="difficulty-badge">All Levels</div>
                <button class="start-tech-game-btn">Start Typing</button>
            `;

            // Add event listener
            typingCard.querySelector('.start-tech-game-btn').addEventListener('click', () => {
                this.startTechGame('typing_test');
            });

            // Insert at the beginning
            grid.insertBefore(typingCard, grid.firstChild);
            console.log('Typing card manually added');
        }
    }

    createTechGamesModal() {
        console.log('Creating modal with typing test card');
        const modal = document.createElement('div');
        modal.id = 'techGamesModal';
        modal.className = 'tech-games-modal';

        modal.innerHTML = `
            <div class="tech-games-modal-content">
                <div class="tech-games-modal-header">
                    <h2>🎯 Tech Learning Games</h2>
                    <span class="tech-games-close-btn">&times;</span>
                </div>
                <div class="tech-games-modal-body">
                    <div id="techGameSelection" class="tech-game-selection">
                        <h3>Choose Your Learning Adventure</h3>
                        <div class="tech-games-grid">
                            <div class="tech-game-card recommended" data-game="typing_test">
                                <div class="tech-game-icon">⌨️</div>
                                <div class="recommended-badge">🌟 RECOMMENDED</div>
                                <h4>Speed Typing Test</h4>
                                <p>Improve your typing speed and accuracy with MonkeyType-inspired challenges</p>
                                <div class="difficulty-badge">All Levels</div>
                                <button class="start-tech-game-btn">Start Typing</button>
                            </div>
                            <div class="tech-game-card" data-game="c_language">
                                <div class="tech-game-icon">⚙️</div>
                                <h4>C Language Quiz</h4>
                                <p>Master the fundamentals of C programming</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="python">
                                <div class="tech-game-icon">🐍</div>
                                <h4>Python Quiz</h4>
                                <p>Learn Python syntax and concepts</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="github">
                                <div class="tech-game-icon">📚</div>
                                <h4>GitHub Commands</h4>
                                <p>Master Git version control commands</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="html">
                                <div class="tech-game-icon">🌐</div>
                                <h4>HTML Quiz</h4>
                                <p>Learn HTML markup and web structure</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="java">
                                <div class="tech-game-icon">☕</div>
                                <h4>Java Quiz</h4>
                                <p>Master Java programming fundamentals</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="verilog">
                                <div class="tech-game-icon">⚡</div>
                                <h4>Verilog Quiz</h4>
                                <p>Learn hardware description language basics</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="powershell">
                                <div class="tech-game-icon">💻</div>
                                <h4>PowerShell Quiz</h4>
                                <p>Master Windows PowerShell commands</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="linux">
                                <div class="tech-game-icon">🐧</div>
                                <h4>Linux Commands</h4>
                                <p>Learn essential Linux terminal commands</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                        </div>
                    </div>
                    <div id="techGamePlay" class="tech-game-play" style="display: none;">
                        <div class="game-header">
                            <div class="game-info">
                                <h3 id="currentGameTitle">Game Title</h3>
                                <div class="game-stats">
                                    <span class="score">Score: <span id="gameScore">0</span></span>
                                    <span class="level">Level: <span id="gameLevel">1</span></span>
                                    <span class="progress">Question: <span id="questionNumber">1</span> / <span id="totalQuestions">8</span></span>
                                </div>
                            </div>
                            <button id="backToSelection" class="back-btn">← Back to Games</button>
                        </div>
                        <div class="question-container">
                            <div class="question-card">
                                <h4 id="questionText">Question will appear here</h4>
                                <div class="options-container" id="optionsContainer"></div>
                                <div class="question-feedback" id="questionFeedback" style="display: none;">
                                    <div class="feedback-content">
                                        <div class="feedback-icon"></div>
                                        <div class="feedback-text">
                                            <h5 class="feedback-title"></h5>
                                            <p class="feedback-explanation"></p>
                                        </div>
                                    </div>
                                    <button id="nextQuestion" class="next-btn">Next Question →</button>
                                </div>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                    </div>
                    <div id="techGameResults" class="tech-game-results" style="display: none;">
                        <div class="results-container">
                            <div class="results-icon" id="resultsIcon">🎉</div>
                            <h3 id="resultsTitle">Congratulations!</h3>
                            <div class="results-stats">
                                <div class="stat">
                                    <span class="stat-value" id="finalScore">0</span>
                                    <span class="stat-label">Final Score</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value" id="correctAnswers">0</span>
                                    <span class="stat-label">Correct Answers</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value" id="accuracy">0%</span>
                                    <span class="stat-label">Accuracy</span>
                                </div>
                            </div>
                            <div class="results-message" id="resultsMessage"></div>
                            <div class="results-actions">
                                <button id="playAgain" class="play-again-btn">Play Again</button>
                                <button id="backToGames" class="back-to-games-btn">Choose Another Game</button>
                            </div>
                        </div>
                    </div>
                    <div id="typingTestGame" class="typing-test-game" style="display: none;">
                        <div class="typing-header">
                            <div class="typing-info">
                                <h3>⌨️ Speed Typing Test</h3>
                                <div class="typing-stats">
                                    <span class="stat-item">WPM: <span id="currentWPM">0</span></span>
                                    <span class="stat-item">Accuracy: <span id="currentAccuracy">100%</span></span>
                                    <span class="stat-item">Time: <span id="timeRemaining">60</span>s</span>
                                    <span class="stat-item">Errors: <span id="errorCount">0</span></span>
                                </div>
                            </div>
                            <button id="backToTypingSelection" class="back-btn">← Back to Games</button>
                        </div>
                        <div id="playerNameInput" class="player-name-section">
                            <div class="name-input-container">
                                <h3>🏆 Enter Your Name</h3>
                                <p>Enter your name to compete on the leaderboard!</p>
                                <div class="name-input-group">
                                    <input type="text" id="playerNameField" placeholder="Enter your name..." maxlength="20" />
                                    <button id="continueWithName" class="continue-btn">Continue</button>
                                </div>
                            </div>
                        </div>
                        <div id="leaderboardDisplay" class="leaderboard-section">
                            <h3>🏆 Top 5 Leaderboard</h3>
                            <div class="leaderboard-list" id="leaderboardList"></div>
                            <button id="closeLeaderboard" class="close-leaderboard-btn">Continue to Game</button>
                        </div>
                        <div class="typing-settings">
                            <div class="setting-group">
                                <label>Mode:</label>
                                <select id="typingMode">
                                    <option value="time">Time Mode (60s)</option>
                                    <option value="words">Word Mode (50 words)</option>
                                    <option value="quote">Quote Mode</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label>Difficulty:</label>
                                <select id="typingDifficulty">
                                    <option value="easy">Easy (Simple code)</option>
                                    <option value="medium" selected>Medium (Quotes)</option>
                                    <option value="hard">Hard (Complex text)</option>
                                    <option value="code">Code (Programming)</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label>Player:</label>
                                <span id="currentPlayerName" class="player-name-display">-</span>
                                <button id="changePlayerName" class="change-name-btn">Change Name</button>
                            </div>
                            <button id="startTypingTest" class="start-typing-btn">Start Test</button>
                            <button id="restartTypingTest" class="restart-typing-btn" style="display: none;">Restart</button>
                            <button id="showLeaderboard" class="show-leaderboard-btn">View Leaderboard 🏆</button>
                        </div>
                        <div class="typing-container">
                            <div class="text-display" id="textDisplay">
                                <div class="typing-text" id="typingText">Click "Start Test" to begin your typing challenge...</div>
                            </div>
                            <div class="typing-input-container">
                                <textarea id="typingInput" class="typing-input" placeholder="Click 'Start Test' and start typing here..." disabled spellcheck="false" autocomplete="off"></textarea>
                            </div>
                        </div>
                        <div class="typing-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="typingProgressFill"></div>
                            </div>
                        </div>
                    </div>
                    <div id="typingTestResults" class="typing-test-results" style="display: none;">
                        <div class="results-container">
                            <div class="results-icon">⌨️</div>
                            <h3>Typing Test Complete!</h3>
                            <div class="typing-results-stats">
                                <div class="stat-card">
                                    <span class="stat-value" id="finalWPM">0</span>
                                    <span class="stat-label">Words Per Minute</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value" id="finalAccuracy">0%</span>
                                    <span class="stat-label">Accuracy</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value" id="finalTime">0</span>
                                    <span class="stat-label">Time (seconds)</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value" id="finalErrors">0</span>
                                    <span class="stat-label">Total Errors</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value" id="finalCharacters">0</span>
                                    <span class="stat-label">Characters Typed</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value" id="typingRank">Beginner</span>
                                    <span class="stat-label">Typing Rank</span>
                                </div>
                            </div>
                            <div class="performance-message" id="performanceMessage"></div>
                            <div class="results-actions">
                                <button id="retakeTypingTest" class="play-again-btn">Take Test Again</button>
                                <button id="backToTypingGames" class="back-to-games-btn">Choose Another Game</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        console.log('Modal HTML created successfully');

        // Add event listeners
        modal.querySelector('.tech-games-close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
            modal.classList.remove('is-open');
            document.body.classList.remove('game-modal-open');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                modal.classList.remove('is-open');
                document.body.classList.remove('game-modal-open');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                modal.classList.remove('is-open');
                document.body.classList.remove('game-modal-open');
            }
        });

        // Add game selection event listeners
        modal.querySelectorAll('.start-tech-game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameType = e.target.closest('.tech-game-card').dataset.game;
                this.startTechGame(gameType);
            });
        });

        return modal;
    }

    showGameSelection() {
        this.setTechView('selection');
    }

    setTechView(view) {
        const map = {
            selection: ['techGameSelection'],
            quiz: ['techGamePlay'],
            quizResults: ['techGameResults'],
            typing: ['typingTestGame'],
            typingResults: ['typingTestResults']
        };

        const all = ['techGameSelection', 'techGamePlay', 'techGameResults', 'typingTestGame', 'typingTestResults'];
        all.forEach(id => {
            const node = document.getElementById(id);
            if (!node) return;
            node.style.display = (map[view] || []).includes(id) ? 'block' : 'none';
        });
    }

    startTechGame(gameType) {
        this.currentGame = gameType;
        this.score = 0;
        this.currentLevel = 1;
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;

        // Handle typing test game differently
        if (gameType === 'typing_test') {
            this.startTypingTest();
            return;
        }

        this.setTechView('quiz');

        // Set game title
        const titles = {
            typing_test: 'Speed Typing Test',
            c_language: 'C Language Quiz',
            python: 'Python Quiz',
            github: 'GitHub Commands Quiz',
            html: 'HTML Quiz',
            java: 'Java Quiz',
            verilog: 'Verilog Quiz',
            powershell: 'PowerShell Quiz',
            linux: 'Linux Commands Quiz'
        };
        document.getElementById('currentGameTitle').textContent = titles[gameType];

        if (!this.quizListenersBound) {
            this.quizListenersBound = true;
            document.getElementById('backToSelection').addEventListener('click', () => {
                this.showGameSelection();
            });

            document.getElementById('nextQuestion').addEventListener('click', () => {
                this.nextQuestion();
            });

            document.getElementById('playAgain').addEventListener('click', () => {
                this.startTechGame(this.currentGame);
            });

            document.getElementById('backToGames').addEventListener('click', () => {
                this.showGameSelection();
            });
        }

        // Start first question
        this.loadQuestion();
    }

    loadQuestion() {
        const questions = this.questions[this.currentGame];
        const question = questions[this.currentQuestionIndex];

        // Update UI
        document.getElementById('gameScore').textContent = this.score;
        document.getElementById('gameLevel').textContent = this.currentLevel;
        document.getElementById('questionNumber').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = questions.length;

        // Update progress bar
        const progress = ((this.currentQuestionIndex) / questions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';

        // Load question
        document.getElementById('questionText').textContent = question.question;

        // Clear and load options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = option;
            optionBtn.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(optionBtn);
        });

        // Hide feedback
        document.getElementById('questionFeedback').style.display = 'none';
    }

    selectAnswer(selectedIndex) {
        const question = this.questions[this.currentGame][this.currentQuestionIndex];
        const optionBtns = document.querySelectorAll('.option-btn');
        const feedback = document.getElementById('questionFeedback');

        // Disable all buttons
        optionBtns.forEach(btn => btn.disabled = true);

        // Show correct and incorrect answers
        optionBtns.forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && selectedIndex !== question.correct) {
                btn.classList.add('incorrect');
            }
        });

        // Update score and stats
        const isCorrect = selectedIndex === question.correct;
        if (isCorrect) {
            this.score += 10;
            this.correctAnswers++;
        }

        // Show feedback
        const feedbackIcon = feedback.querySelector('.feedback-icon');
        const feedbackTitle = feedback.querySelector('.feedback-title');
        const feedbackExplanation = feedback.querySelector('.feedback-explanation');

        if (isCorrect) {
            feedbackIcon.textContent = '✅';
            feedbackTitle.textContent = 'Correct!';
            feedbackTitle.className = 'feedback-title correct';
        } else {
            feedbackIcon.textContent = '❌';
            feedbackTitle.textContent = 'Incorrect';
            feedbackTitle.className = 'feedback-title incorrect';
        }

        feedbackExplanation.textContent = question.explanation;
        feedback.style.display = 'block';
    }

    nextQuestion() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex >= this.questions[this.currentGame].length) {
            this.showResults();
        } else {
            // Level up every 3 questions
            if (this.currentQuestionIndex % 3 === 0) {
                this.currentLevel++;
            }
            this.loadQuestion();
        }
    }

    showResults() {
        this.setTechView('quizResults');

        const totalQuestions = this.questions[this.currentGame].length;
        const accuracy = Math.round((this.correctAnswers / totalQuestions) * 100);

        // Update results
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('correctAnswers').textContent = `${this.correctAnswers}/${totalQuestions}`;
        document.getElementById('accuracy').textContent = accuracy + '%';

        // Set results message and icon based on performance
        const resultsIcon = document.getElementById('resultsIcon');
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsMessage = document.getElementById('resultsMessage');

        if (accuracy >= 80) {
            resultsIcon.textContent = '🏆';
            resultsTitle.textContent = 'Excellent!';
            resultsMessage.textContent = 'You have mastered the basics! Keep up the great work!';
        } else if (accuracy >= 60) {
            resultsIcon.textContent = '👍';
            resultsTitle.textContent = 'Good Job!';
            resultsMessage.textContent = 'You\'re on the right track! Practice a bit more to improve.';
        } else {
            resultsIcon.textContent = '📚';
            resultsTitle.textContent = 'Keep Learning!';
            resultsMessage.textContent = 'Don\'t worry, everyone starts somewhere. Try again and learn from the explanations!';
        }
    }

    // Typing Test Game Methods
    startTypingTest() {
        this.setTechView('typing');

        // Setup event listeners
        this.setupTypingTestEventListeners();

        // Reset typing game state
        this.resetTypingGameState();
    }

    setupTypingTestEventListeners() {
        if (this.typingListenersBound) return;
        this.typingListenersBound = true;

        // Back to selection
        document.getElementById('backToTypingSelection').addEventListener('click', () => {
            this.showGameSelection();
        });

        // Start typing test
        document.getElementById('startTypingTest').addEventListener('click', () => {
            this.beginTypingTest();
        });

        // Restart typing test
        document.getElementById('restartTypingTest').addEventListener('click', () => {
            this.beginTypingTest();
        });

        // Typing input handler
        const typingInput = document.getElementById('typingInput');
        typingInput.addEventListener('input', (e) => {
            this.handleTypingInput(e);
        });

        typingInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
            }
        });

        // Results screen handlers
        document.getElementById('retakeTypingTest').addEventListener('click', () => {
            this.startTypingTest();
        });

        document.getElementById('backToTypingGames').addEventListener('click', () => {
            this.showGameSelection();
        });

        // Player name input handlers
        document.getElementById('continueWithName').addEventListener('click', () => {
            const playerName = document.getElementById('playerNameField').value.trim();
            if (playerName) {
                this.typingGame.playerName = playerName;
                document.getElementById('currentPlayerName').textContent = playerName;
                this.hidePlayerNameInput();
                this.showLeaderboardDisplay();
            } else {
                alert('Please enter your name to continue!');
            }
        });

        document.getElementById('playerNameField').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('continueWithName').click();
            }
        });

        document.getElementById('changePlayerName').addEventListener('click', () => {
            this.showPlayerNameInput();
        });

        // Leaderboard handlers
        document.getElementById('showLeaderboard').addEventListener('click', () => {
            this.showLeaderboardDisplay();
        });

        document.getElementById('closeLeaderboard').addEventListener('click', () => {
            this.hideLeaderboardDisplay();
        });
    }

    resetTypingGameState() {
        this.typingGame = {
            currentText: '',
            userInput: '',
            startTime: null,
            endTime: null,
            errors: 0,
            currentCharIndex: 0,
            isActive: false,
            timeLimit: 60,
            mode: 'time',
            difficulty: 'medium',
            totalCharacters: 0,
            correctCharacters: 0
        };

        // Reset UI
        document.getElementById('currentWPM').textContent = '0';
        document.getElementById('currentAccuracy').textContent = '100%';
        document.getElementById('timeRemaining').textContent = '60';
        document.getElementById('errorCount').textContent = '0';
        document.getElementById('typingInput').value = '';
        document.getElementById('typingInput').disabled = true;
        document.getElementById('startTypingTest').style.display = 'block';
        document.getElementById('restartTypingTest').style.display = 'none';

        this.updateTypingProgress(0);
    }

    beginTypingTest() {
        // Check if player name is set
        if (!this.typingGame.playerName) {
            this.showPlayerNameInput();
            return;
        }

        // Get selected settings
        const mode = document.getElementById('typingMode').value;
        const difficulty = document.getElementById('typingDifficulty').value;

        this.typingGame.mode = mode;
        this.typingGame.difficulty = difficulty;

        // Set time limit based on mode
        if (mode === 'time') {
            this.typingGame.timeLimit = 60;
        } else if (mode === 'words') {
            this.typingGame.timeLimit = 300; // 5 minutes max for word mode
        } else {
            this.typingGame.timeLimit = 120; // 2 minutes for quotes
        }

        // Select text based on difficulty
        this.selectTypingText();

        // Setup the test
        this.displayTypingText();

        // Enable input and start
        const typingInput = document.getElementById('typingInput');
        typingInput.disabled = false;
        typingInput.value = '';
        typingInput.focus();
        typingInput.placeholder = 'Start typing here...';

        // Reset state
        this.typingGame.startTime = Date.now();
        this.typingGame.isActive = true;
        this.typingGame.errors = 0;
        this.typingGame.currentCharIndex = 0;
        this.typingGame.userInput = '';

        // Update UI
        document.getElementById('startTypingTest').style.display = 'none';
        document.getElementById('restartTypingTest').style.display = 'block';
        document.getElementById('timeRemaining').textContent = this.typingGame.timeLimit;

        // Start timer
        this.startTypingTimer();
    }

    selectTypingText() {
        const { difficulty, mode } = this.typingGame;
        const texts = this.questions.typing_test;

        let selectedTexts;
        if (difficulty === 'code') {
            selectedTexts = texts.code_snippets;
        } else {
            selectedTexts = texts[difficulty] || texts.medium;
        }

        // Select random text
        const randomIndex = Math.floor(Math.random() * selectedTexts.length);
        this.typingGame.currentText = selectedTexts[randomIndex];

        // For word mode, limit to ~50 words
        if (mode === 'words') {
            const words = this.typingGame.currentText.split(' ');
            if (words.length > 50) {
                this.typingGame.currentText = words.slice(0, 50).join(' ');
            }
        }
    }

    displayTypingText() {
        const textDisplay = document.getElementById('typingText');
        textDisplay.innerHTML = '';

        // Create spans for each character
        for (let i = 0; i < this.typingGame.currentText.length; i++) {
            const span = document.createElement('span');
            span.textContent = this.typingGame.currentText[i];
            span.id = `char-${i}`;
            textDisplay.appendChild(span);
        }
    }

    handleTypingInput(e) {
        if (!this.typingGame.isActive) return;

        const input = e.target.value;
        this.typingGame.userInput = input;

        // Update character highlighting
        this.updateCharacterHighlighting();

        // Update stats
        this.updateTypingStats();

        // Check completion
        if (input.length >= this.typingGame.currentText.length) {
            this.finishTypingTest();
        }
    }

    updateCharacterHighlighting() {
        const text = this.typingGame.currentText;
        const input = this.typingGame.userInput;

        let correctCount = 0;
        let errorCount = 0;

        for (let i = 0; i < text.length; i++) {
            const char = document.getElementById(`char-${i}`);
            if (!char) continue;

            if (i < input.length) {
                if (input[i] === text[i]) {
                    char.className = 'correct';
                    correctCount++;
                } else {
                    char.className = 'incorrect';
                    errorCount++;
                }
            } else if (i === input.length) {
                char.className = 'current';
            } else {
                char.className = '';
            }
        }

        this.typingGame.correctCharacters = correctCount;
        this.typingGame.errors = errorCount;
        this.typingGame.currentCharIndex = input.length;
    }

    updateTypingStats() {
        const currentTime = Date.now();
        const timeElapsed = (currentTime - this.typingGame.startTime) / 1000;
        const timeRemaining = Math.max(0, this.typingGame.timeLimit - timeElapsed);

        // Calculate WPM (assuming average word length of 5 characters)
        const charactersTyped = this.typingGame.currentCharIndex;
        const wordsTyped = charactersTyped / 5;
        const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;

        // Calculate accuracy
        const totalTyped = this.typingGame.userInput.length;
        const accuracy = totalTyped > 0 ? Math.round((this.typingGame.correctCharacters / totalTyped) * 100) : 100;

        // Update UI
        document.getElementById('currentWPM').textContent = wpm;
        document.getElementById('currentAccuracy').textContent = accuracy + '%';
        document.getElementById('timeRemaining').textContent = Math.ceil(timeRemaining);
        document.getElementById('errorCount').textContent = this.typingGame.errors;

        // Update progress
        const progress = (charactersTyped / this.typingGame.currentText.length) * 100;
        this.updateTypingProgress(progress);

        // Check time limit
        if (timeRemaining <= 0 && this.typingGame.mode === 'time') {
            this.finishTypingTest();
        }
    }

    updateTypingProgress(percentage) {
        const progressFill = document.getElementById('typingProgressFill');
        progressFill.style.width = Math.min(percentage, 100) + '%';
    }

    startTypingTimer() {
        this.typingTimer = setInterval(() => {
            if (!this.typingGame.isActive) {
                clearInterval(this.typingTimer);
                return;
            }
            this.updateTypingStats();
        }, 100);
    }

    finishTypingTest() {
        this.typingGame.isActive = false;
        this.typingGame.endTime = Date.now();

        // Clear timer
        if (this.typingTimer) {
            clearInterval(this.typingTimer);
        }

        // Disable input
        document.getElementById('typingInput').disabled = true;

        // Calculate final stats
        this.calculateTypingResults();

        // Show results
        setTimeout(() => {
            this.showTypingResults();
        }, 1000);
    }

    calculateTypingResults() {
        const timeElapsed = (this.typingGame.endTime - this.typingGame.startTime) / 1000;
        const totalCharacters = this.typingGame.userInput.length;
        const correctCharacters = this.typingGame.correctCharacters;
        const errors = this.typingGame.errors;

        // Calculate WPM
        const wordsTyped = correctCharacters / 5;
        const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;

        // Calculate accuracy
        const accuracy = totalCharacters > 0 ? Math.round((correctCharacters / totalCharacters) * 100) : 100;

        // Determine rank
        let rank = 'Beginner';
        if (wpm >= 80) rank = 'Expert';
        else if (wpm >= 60) rank = 'Advanced';
        else if (wpm >= 40) rank = 'Intermediate';
        else if (wpm >= 20) rank = 'Beginner+';

        this.typingGame.finalStats = {
            wpm,
            accuracy,
            timeElapsed: Math.round(timeElapsed),
            totalCharacters,
            correctCharacters,
            errors,
            rank
        };

        // Add to leaderboard
        const leaderboardRank = this.addToLeaderboard(
            this.typingGame.playerName,
            wpm,
            accuracy,
            errors,
            this.typingGame.difficulty,
            this.typingGame.mode
        );

        this.typingGame.finalStats.leaderboardRank = leaderboardRank;
    }

    showTypingResults() {
        // Hide typing game
        document.getElementById('typingTestGame').style.display = 'none';

        // Show results
        document.getElementById('typingTestResults').style.display = 'block';

        const stats = this.typingGame.finalStats;

        // Update result values
        document.getElementById('finalWPM').textContent = stats.wpm;
        document.getElementById('finalAccuracy').textContent = stats.accuracy + '%';
        document.getElementById('finalTime').textContent = stats.timeElapsed;
        document.getElementById('finalErrors').textContent = stats.errors;
        document.getElementById('finalCharacters').textContent = stats.totalCharacters;
        document.getElementById('typingRank').textContent = stats.rank;

        // Performance message
        const messageEl = document.getElementById('performanceMessage');
        let performanceMessage = '';
        if (stats.wpm >= 60 && stats.accuracy >= 95) {
            performanceMessage = '🏆 Outstanding! You type like a professional programmer!';
        } else if (stats.wpm >= 40 && stats.accuracy >= 90) {
            performanceMessage = '🌟 Great job! Your typing skills are above average!';
        } else if (stats.wpm >= 20 && stats.accuracy >= 80) {
            performanceMessage = '👍 Good work! Keep practicing to improve your speed and accuracy!';
        } else {
            performanceMessage = '📈 Don\'t worry, everyone improves with practice. Try again!';
        }

        // Add leaderboard rank information
        if (stats.leaderboardRank && stats.leaderboardRank <= 5) {
            const rankEmoji = stats.leaderboardRank === 1 ? '🥇' : stats.leaderboardRank === 2 ? '🥈' : stats.leaderboardRank === 3 ? '🥉' : '🏅';
            performanceMessage += ` ${rankEmoji} You ranked #${stats.leaderboardRank} on the leaderboard!`;
        }

        messageEl.textContent = performanceMessage;
    }
}

window.initTechGames = function () {
    return new TechGamesManager();
};
