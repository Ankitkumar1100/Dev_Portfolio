import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalLine {
  id: string;
  command?: string;
  output?: string;
  isCommand: boolean;
}

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      output: 'Welcome to Ankit\'s Portfolio Terminal v1.0.0',
      isCommand: false
    },
    {
      id: '2',
      output: 'Type "help" to see available commands.',
      isCommand: false
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const commands = {
    help: {
      description: 'Show available commands',
      output: `Available commands:\n\nabout        - Learn about me\nprojects     - View my projects  \nskills       - See my technical skills\nexperience   - My work experience\ncontact      - How to reach me\neducation    - My educational background\ncertifications - View my certifications\nleadership   - Leadership and community involvement\nsudo         - Secret developer info\nclear        - Clear the terminal\n\nType any command to continue...`
    },
    about: {
      description: 'Learn about me',
      output: `👋 Hi there! I'm Ankit Kumar, a passionate Full Stack Developer and coder.\n\n💻 I know C, Java, a little bit of Python, and I have a hobby of playing games.\n\n🚀 I love building innovative web applications and solving complex problems.\n📚 Always eager to learn new technologies and best practices.\n\n🎮 When I'm not coding, you'll find me playing games, exploring new tech trends, or contributing to open source projects.`
    },
    projects: {
      description: 'View my projects',
      output: `Recent Projects:\n\n🌐 Agency Website\n   A modern, responsive website for a digital agency built with React and TypeScript.\n   Features include dynamic content management, contact forms, and SEO optimization.\n   Technologies: React, TypeScript, Tailwind CSS, Node.js\n\n🛒 E-commerce Store\n   Full-featured online store with shopping cart, payment integration, and admin dashboard.\n   Includes user authentication, product catalog, and order management system.\n   Technologies: React, Node.js, MongoDB, Stripe API\n\n🏫 School Management System\n   Comprehensive system to manage students, teachers, classes, and academic records.\n   Features include attendance tracking, grade management, and parent portal.\n   Technologies: Java, Spring Boot, MySQL, React\n\n📱 Recipe App (Mobile)\n   Cross-platform mobile app for browsing, saving, and sharing recipes.\n   Includes search functionality, favorites, and social sharing features.\n   Technologies: React Native, Firebase, Redux\n\n🩺 Doctor Appointment Booking Website\n   Web platform for booking doctor appointments with real-time availability.\n   Features include user registration, appointment scheduling, and notifications.\n   Technologies: React, Node.js, PostgreSQL, Socket.io`
    },
    skills: {
      description: 'See my technical skills',
      output: `Technical Skills:\n\nFrontend:\n• React, Vue.js, Angular\n• TypeScript, JavaScript (ES6+)\n• HTML5, CSS3, Sass/SCSS\n• Tailwind CSS, Bootstrap\n• React Native, Flutter\n\nBackend:\n• Node.js, Express.js\n• Python, Django, Flask\n• PHP, Laravel\n• RESTful APIs, GraphQL\n\nDatabases:\n• MongoDB, PostgreSQL\n• MySQL, Firebase\n• Redis, Elasticsearch\n\nDevOps & Tools:\n• AWS, Docker, Kubernetes\n• Git, GitHub Actions\n• Jest, Cypress, Webpack\n• Linux, Nginx, PM2`
    },
    experience: {
      description: 'My work experience',
      output: `Experience:\n\n🎓 Education & Foundation:\n   Recently completed Diploma in Computer Science from Ambedkar Institute of Technology.\n   Strong foundation in computer science principles, data structures, and algorithms.\n\n🛠️ Project Development:\n   Developed multiple full-stack applications demonstrating proficiency in modern web technologies.\n   Experience with both frontend and backend development, database design, and API integration.\n   Projects showcase skills in React, Node.js, Java, and various databases.\n\n💼 Internship Experience:\n   Completed summer internship at TechMahindra, gaining exposure to enterprise-level development.\n   Worked on real-world projects and collaborated with experienced developers.\n\n🌍 Open Source Contributions:\n   Actively contribute to open source projects, particularly in React, Java, and web technologies.\n   Built and open-sourced a School Management System and Doctor Appointment Booking Website.\n   Demonstrated ability to write clean, maintainable code and collaborate with the developer community.`
    },
    contact: {
      description: 'How to reach me',
      output: `Let's Connect:\n\n📧 Email: ankitio437@gmail.com\n🐙 GitHub: github.com/Ankitkumar1100\n💼 LinkedIn: Ankit Kumar\n🐦 Twitter: Ankitkumar\n🌐 Website: ankitkumar.dev\n\nAlways open to interesting projects and collaboration opportunities!\nFeel free to reach out for freelance work, job opportunities, or just to chat about tech.`
    },
    education: {
      description: 'My educational background',
      output: `Education:\n\n🎓 Diploma in Computer Science\n   Ambedkar Institute of Technology\n\n🏫 10th Grade\n   Govt. School of Dallupura\n\nRelevant Coursework:\n• Data Structures and Algorithms\n• Database Management Systems\n• Software Engineering\n• Computer Networks\n• Machine Learning`
    },
    certifications: {
      description: 'View my certifications',
      output: `Certifications:\n\n🐍 Python Certificate (Harvard University, CS50 online)\n🗄️ SQL Certificate (Harvard University, CS50 online)\n☁️ Google Cloud Generative AI\n\n👑 Leadership & Clubs:\n• Ran a blockchain club in college\n\n☁️ Cloud:\n• Google Cloud Generative AI\n\n💾 Database:\n• SQL\n\n🧑‍💼 Other:\n• Experience running a blockchain club in college.`
    },
    leadership: {
      description: 'Leadership and community involvement',
      output: `Leadership & Community:\n\n👥 Vice Secretary of Blockchain Club in college\n\n🌟 Open Source Contributions:\n• React, Java, C, HTML5, CSS, Tailwind\n\n🎓 Community Involvement:\n• Organizer and contributor to open source and tech communities\n\n🏆 Achievements:\n• "Developer of the Year" award at previous company\n• Top 1% contributor on Stack Overflow\n• Featured in "Top 30 Under 30 Developers" list`
    },
    sudo: {
      description: 'Secret developer info',
      output: `[sudo] password for ankit: ********\n\nHi, I am Ankit! 👋\n\n🎮 Fun fact: I played the full trilogy of Dark Souls (which is a very hard game!)\n☕ Coffee consumption: ~4 cups/day (optimized for peak performance)\n🎵 Coding playlist: Lo-fi beats and synthwave\n🦆 Rubber duck debugging success rate: 87%\n🌙 Preferred coding hours: 11 PM - 3 AM\n🐛 Bugs fixed: 2,847 (and counting...)\n💡 "Hello World" in 15+ programming languages\n🎯 Life motto: "Code with passion, debug with patience"`
    },
    clear: {
      description: 'Clear the terminal',
      output: 'CLEAR_COMMAND'
    }
  };

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    // Add command line
    const commandLine: TerminalLine = {
      id: Date.now().toString(),
      command: command,
      isCommand: true
    };
    
    setLines(prev => [...prev, commandLine]);

    if (cmd === 'clear') {
      setTimeout(() => {
        setLines([]);
      }, 100);
      return;
    }

    if (commands[cmd as keyof typeof commands]) {
      const outputLine: TerminalLine = {
        id: (Date.now() + 1).toString(),
        output: commands[cmd as keyof typeof commands].output,
        isCommand: false
      };
      
      setTimeout(() => {
        setLines(prev => [...prev, outputLine]);
      }, 100);
    } else {
      const errorLine: TerminalLine = {
        id: (Date.now() + 1).toString(),
        output: `Command not found: ${command}\nType "help" to see available commands.`,
        isCommand: false
      };
      
      setTimeout(() => {
        setLines(prev => [...prev, errorLine]);
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  // Focus input when terminal area is clicked
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ fontFamily: 'Courier New, Fira Code, monospace' }}>
      {/* Terminal Header */}
      <div className="bg-gray-900 px-4 py-2 border-b border-green-400 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-green-400 text-sm">ankit@portfolio:~</div>
        <div className="text-green-400 text-xs">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
      {/* Available Commands Bar */}
      <div className="bg-gray-800 px-4 py-2 text-xs text-green-400 whitespace-nowrap border-b border-gray-700 overflow-x-auto scrollbar-hide">
        <span className="text-blue-400">help</span> | <span className="text-blue-400">about</span> | <span className="text-blue-400">projects</span> | <span className="text-blue-400">skills</span> | <span className="text-blue-400">experience</span> | <span className="text-blue-400">contact</span> | <span className="text-blue-400">education</span> | <span className="text-blue-400">certifications</span> | <span className="text-blue-400">leadership</span> | <span className="text-blue-400">sudo</span> | <span className="text-blue-400">clear</span>
      </div>
      {/* Extra line below command bar */}
      <div className="px-4 py-1 text-xs text-green-400 border-b border-gray-700 bg-black text-left">Type any command to continue...</div>
      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto text-sm space-y-1 bg-black"
        style={{ fontFamily: 'Courier New, Fira Code, monospace' }}
        onClick={handleTerminalClick}
      >
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {line.isCommand ? (
                <div className="text-blue-400">
                  <span className="text-green-400">ankit@portfolio:~$</span> {line.command}
                </div>
              ) : (
                <div className="text-gray-300 whitespace-pre-line pl-0">
                  {line.output}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Current Input Line */}
        <div className="flex items-center mt-2">
          <span className="mr-2">ankit@portfolio:~$</span>
          <div className="relative flex items-center w-full max-w-xs">
            {/* Visually hidden input for keyboard input */}
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute left-0 top-0 w-full h-full opacity-0 z-10"
              style={{ fontFamily: 'Courier New, Fira Code, monospace' }}
              placeholder=""
              autoComplete="off"
              spellCheck="false"
              tabIndex={0}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            {/* Displayed text and blinking block cursor */}
            <span className="whitespace-pre text-green-400 bg-black px-1 py-0.5 rounded border border-green-700 min-w-[2ch]">
              {currentInput}
              {inputFocused && showCursor && (
                <span style={{ fontWeight: 'bold', color: '#00ff99' }}>&#9608;</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;