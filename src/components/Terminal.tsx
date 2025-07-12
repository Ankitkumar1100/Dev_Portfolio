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
      output: `Available commands:

about        - Learn about me
projects     - View my projects  
skills       - See my technical skills
experience   - My work experience
contact      - How to reach me
education    - My educational background
certifications - View my certifications
leadership   - Leadership and community involvement
sudo         - Secret developer info
clear        - Clear the terminal

Type any command to continue...`
    },
    about: {
      description: 'Learn about me',
      output: `Hi there! I'm Ankit Kumar, a passionate Full Stack Developer.

🚀 I love building innovative web applications and solving complex problems
🎯 Specialized in React, Node.js, TypeScript, and modern web technologies
💡 Always eager to learn new technologies and best practices
🌟 Passionate about clean code, user experience, and performance optimization

When I'm not coding, you'll find me exploring new tech trends,
contributing to open source projects, or mentoring fellow developers.`
    },
    projects: {
      description: 'View my projects',
      output: `Recent Projects:

🛒 E-commerce Platform
   Full-stack application with React, Node.js, MongoDB
   Features: Payment integration, real-time inventory, admin dashboard

💬 Real-time Chat Application  
   Built with Socket.io, React, Express
   Features: Group chats, file sharing, message encryption

📊 Data Visualization Dashboard
   Interactive charts using D3.js and React
   Features: Real-time data, custom filters, export functionality

📱 Mobile-First Progressive Web App
   React Native, TypeScript, Firebase
   Features: Offline support, push notifications, cross-platform`
    },
    skills: {
      description: 'See my technical skills',
      output: `Technical Skills:

Frontend:
• React, Vue.js, Angular
• TypeScript, JavaScript (ES6+)
• HTML5, CSS3, Sass/SCSS
• Tailwind CSS, Bootstrap
• React Native, Flutter

Backend:
• Node.js, Express.js
• Python, Django, Flask
• PHP, Laravel
• RESTful APIs, GraphQL

Databases:
• MongoDB, PostgreSQL
• MySQL, Firebase
• Redis, Elasticsearch

DevOps & Tools:
• AWS, Docker, Kubernetes
• Git, GitHub Actions
• Jest, Cypress, Webpack
• Linux, Nginx, PM2`
    },
    experience: {
      description: 'My work experience',
      output: `Work Experience:

Senior Full Stack Developer @ TechCorp (2022 - Present)
• Lead development of microservices architecture
• Mentored junior developers and conducted code reviews
• Implemented CI/CD pipelines reducing deployment time by 60%

Full Stack Developer @ StartupXYZ (2020 - 2022)
• Built and maintained React-based web applications
• Developed RESTful APIs using Node.js and Express
• Collaborated with cross-functional teams using Agile methodology

Frontend Developer @ WebAgency (2019 - 2020)
• Created responsive websites for various clients
• Optimized website performance and SEO
• Implemented modern JavaScript frameworks`
    },
    contact: {
      description: 'How to reach me',
      output: `Let's Connect:

📧 Email: ankit.kumar.dev@example.com
🐙 GitHub: github.com/ankit-kumar
💼 LinkedIn: linkedin.com/in/ankit-kumar-dev
🐦 Twitter: @ankitdev
🌐 Website: ankitkumar.dev
📱 Phone: +1 (555) 123-4567

Always open to interesting projects and collaboration opportunities!
Feel free to reach out for freelance work, job opportunities, or just to chat about tech.`
    },
    education: {
      description: 'My educational background',
      output: `Education:

🎓 Bachelor of Technology in Computer Science
   XYZ University (2015 - 2019)
   CGPA: 8.5/10.0
   
   Relevant Coursework:
   • Data Structures and Algorithms
   • Database Management Systems
   • Software Engineering
   • Computer Networks
   • Machine Learning

🏆 Certifications:
   • AWS Certified Developer - Associate
   • Google Cloud Professional Developer
   • MongoDB Certified Developer
   • React Developer Certification

📚 Continuous Learning:
   Currently exploring Web3, Blockchain, and AI/ML technologies`
    },
    certifications: {
      description: 'View my certifications',
      output: `Professional Certifications:

☁️ Cloud Platforms:
   • AWS Certified Developer - Associate (2023)
   • Google Cloud Professional Developer (2022)
   • Microsoft Azure Fundamentals (2022)

🗄️ Databases:
   • MongoDB Certified Developer Associate (2023)
   • Oracle Database SQL Certified Associate (2021)

🚀 Frameworks & Technologies:
   • React Developer Certification - Meta (2023)
   • Node.js Application Developer - OpenJS Foundation (2022)
   • Kubernetes Application Developer (CKAD) (2023)

🔒 Security:
   • Certified Ethical Hacker (CEH) - EC-Council (2022)
   • CompTIA Security+ (2021)`
    },
    leadership: {
      description: 'Leadership and community involvement',
      output: `Leadership & Community:

👥 Technical Leadership:
   • Team Lead for 5-member development team
   • Organized monthly tech talks and knowledge sharing sessions
   • Mentored 10+ junior developers in their career growth

🌟 Open Source Contributions:
   • Contributor to React, Vue.js, and Node.js ecosystems
   • Maintained 3 popular npm packages (1000+ weekly downloads)
   • Speaker at 5+ tech conferences and meetups

🎓 Community Involvement:
   • Volunteer coding instructor for underserved communities
   • Organizer of local JavaScript meetup group (200+ members)
   • Technical reviewer for programming books and courses

🏆 Achievements:
   • "Developer of the Year" award at previous company
   • Top 1% contributor on Stack Overflow
   • Featured in "Top 30 Under 30 Developers" list`
    },
    sudo: {
      description: 'Secret developer info',
      output: `[sudo] password for ankit: ********

Hi, I am Ankit! 👋

🎮 Fun fact: I once debugged a production issue while on a roller coaster
☕ Coffee consumption: ~4 cups/day (optimized for peak performance)
🎵 Coding playlist: Lo-fi beats and synthwave
🦆 Rubber duck debugging success rate: 87%
🌙 Preferred coding hours: 11 PM - 3 AM
🐛 Bugs fixed: 2,847 (and counting...)
💡 "Hello World" in 15+ programming languages
🎯 Life motto: "Code with passion, debug with patience"`
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

  return (
    <div className="w-full h-full bg-black border border-green-400 rounded-lg overflow-hidden flex flex-col" style={{ fontFamily: '"Courier New", "Fira Code", monospace' }}>
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
      <div className="bg-gray-800 px-4 py-2 text-xs text-green-400 overflow-x-auto whitespace-nowrap border-b border-gray-700">
        <span className="text-blue-400">help</span> | <span className="text-blue-400">about</span> | <span className="text-blue-400">projects</span> | <span className="text-blue-400">skills</span> | <span className="text-blue-400">experience</span> | <span className="text-blue-400">contact</span> | <span className="text-blue-400">education</span> | <span className="text-blue-400">certifications</span> | <span className="text-blue-400">leadership</span> | <span className="text-blue-400">sudo</span> | <span className="text-blue-400">clear</span>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto text-sm space-y-1"
        style={{ fontFamily: '"Courier New", "Fira Code", monospace' }}
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
        <div className="flex items-center text-green-400">
          <span className="mr-2">ankit@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none flex-1 text-white"
            style={{ fontFamily: '"Courier New", "Fira Code", monospace' }}
            placeholder=""
            autoComplete="off"
          />
          <span className={`ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
            █
          </span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;