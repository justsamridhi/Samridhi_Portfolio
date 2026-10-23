// Verified project data
export const projectsData = [
  {
    id: "apk-xray",
    name: "APK-Xray",
    tagline: "Evidence-first Android APK static analysis",
    description: "Inspect an Android APK before installing it. Deterministic rule-based engines decide the security findings; AI explains implications clearly without hallucinating.",
    tags: ["React", "FastAPI", "Python", "Androguard", "Static Analysis"],
    github: "https://github.com/justsamridhi/APK-Xray",
    demo: "https://apk-xray.vercel.app/",
    status: "Completed",
    icon: "/assets/samridhi_ui_workspace_assets/17_folder_projects.png"
  },
  {
    id: "aves-migration",
    name: "Aves Migration System",
    tagline: "Predictive bird migration intelligence",
    description: "Analyzes and predicts avian migration trajectories across 4.8 million GPS fixes using engineered movement metrics, spatial indexing, and machine learning models.",
    tags: ["Python", "Pandas", "Scikit-learn", "Spatial Analysis", "GIS"],
    github: "https://github.com/justsamridhi/Aves_Migration_System",
    demo: null, // Verified: No public live demo
    status: "Research Project",
    icon: "/assets/samridhi_ui_workspace_assets/18_folder_research.png"
  },
  {
    id: "skillswap",
    name: "SkillSwap",
    tagline: "Peer-to-peer talent discovery & exchange",
    description: "An intuitive collaborative platform enabling students and professionals to exchange skills, discover mentorship, schedule sessions, and connect through real-time communication.",
    tags: ["React", "Firebase", "Node.js", "Three.js", "WebRTC"],
    github: "https://github.com/justsamridhi/SkillSwap",
    demo: "https://skill-swap-pied-three.vercel.app/",
    status: "Active / Maintained",
    icon: "/assets/samridhi_ui_workspace_assets/20_folder_favorites.png"
  }
];

// Verified skills with qualitative practical descriptions
export const skillsData = [
  {
    category: "Languages",
    icon: "/assets/samridhi_decorative_navigation_assets/22_folder_skills.png",
    items: [
      { name: "C / C++", level: 85, tier: "core", desc: "Data structures, algorithm complexity, pointer mechanics, systems development" },
      { name: "Python", level: 90, tier: "core", desc: "Data pipelines, static analysis, automation, machine learning" },
      { name: "JavaScript (ES6+)", level: 88, tier: "core", desc: "Modern asynchronous workflows, browser APIs, DOM architecture" },
      { name: "Java", level: 75, tier: "comfortable", desc: "Object-oriented software design, JVM concepts, Android fundamentals" }
    ]
  },
  {
    category: "Frontend Development",
    icon: "/assets/samridhi_ui_workspace_assets/04_stickered_laptop.png",
    items: [
      { name: "React.js", level: 88, tier: "core", desc: "Component architecture, hooks, context state management, SPA routing" },
      { name: "HTML5 & Semantic Markup", level: 95, tier: "core", desc: "Accessible ARIA roles, clean document flow, responsive viewports" },
      { name: "CSS3 & Modern SCSS", level: 90, tier: "core", desc: "Design systems, CSS grid/flexbox, keyframe animations, responsive UX" },
      { name: "Three.js & Canvas API", level: 70, tier: "exploring", desc: "Interactive 3D scenes, 2D pixel manipulation, canvas rendering" }
    ]
  },
  {
    category: "Backend & Databases",
    icon: "/assets/samridhi_decorative_navigation_assets/86_code_impact_card.png",
    items: [
      { name: "Node.js & Express", level: 85, tier: "core", desc: "RESTful API architecture, middleware pipelines, authentication" },
      { name: "FastAPI", level: 80, tier: "comfortable", desc: "High-performance Python microservices, Pydantic data schemas" },
      { name: "MongoDB & Mongoose", level: 82, tier: "core", desc: "Document schemas, indexing, aggregation pipelines, validation" },
      { name: "Relational DBMS & SQL", level: 78, tier: "comfortable", desc: "Queries, normalization, integrity constraints (Infosys certified)" }
    ]
  },
  {
    category: "Systems & Security",
    icon: "/assets/samridhi_decorative_navigation_assets/21_folder_experience.png",
    items: [
      { name: "Linux / System Administration", level: 80, tier: "comfortable", desc: "Bash scripting, user management, process isolation (RH124)" },
      { name: "Static APK Analysis", level: 85, tier: "core", desc: "Manifest inspection, decompilation, permission security auditing" },
      { name: "Cybersecurity Job Simulation", level: 80, tier: "comfortable", desc: "Threat analysis, incident forensics, vulnerability mitigation" },
      { name: "Deepfake Audio Detection", level: 78, tier: "comfortable", desc: "Acoustic feature analysis, spectrogram inspection (LNMIIT LUSIP)" }
    ]
  },
  {
    category: "Tools & Platforms",
    icon: "/assets/samridhi_ui_workspace_assets/28_plan_create_notes.png",
    items: [
      { name: "Git & GitHub", level: 90, tier: "core", desc: "Branching workflows, version control, release tags, CI collaboration" },
      { name: "Vite / Modern Bundlers", level: 85, tier: "core", desc: "HMR dev tooling, ES modules, tree-shaking production builds" },
      { name: "Firebase", level: 75, tier: "comfortable", desc: "Auth providers, Firestore real-time databases, hosting" },
      { name: "Postman & API Testing", level: 85, tier: "core", desc: "Endpoint validation, mock servers, payload debugging" }
    ]
  }
];

// Verified education and experience timeline
export const timelineData = [
  {
    period: "2024 — Present",
    title: "B.Tech in Computer Science & Engineering",
    organization: "Undergraduate Studies — Jaipur, Rajasthan",
    type: "education",
    description: "Focusing on core computer science foundations: Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks, and Full-Stack Engineering."
  },
  {
    period: "June 2024 — July 2024",
    title: "Cybersecurity Research Intern (ISEA-III)",
    organization: "Malaviya National Institute of Technology (MNIT), Jaipur",
    type: "experience",
    description: "Engaged in national Information Security Education and Awareness (ISEA Phase-III) research. Investigated network security protocols, vulnerability assessment methodologies, and defensive cyber practices."
  },
  {
    period: "Summer 2024",
    title: "Audio Deepfake Detection Research (LUSIP 2024)",
    organization: "The LNM Institute of Information Technology (LNMIIT), Jaipur",
    type: "experience",
    description: "Selected for LUSIP research internship program. Explored audio signal processing, feature extraction, and machine learning classification to distinguish synthetic AI-generated voices from authentic human speech."
  }
];

// Verified certificate credentials from documents/Certificates
export const certificatesData = [
  {
    id: "mnit-isea",
    title: "ISEA-III Internship Certificate",
    issuer: "MNIT Jaipur",
    category: "Research Internship",
    date: "2024",
    badge: "Government Project",
    file: "/documents/Certificates/MNIT Jaipur — ISEA-III Internship.pdf",
    description: "National Information Security Education and Awareness Project (Phase-III) research completion."
  },
  {
    id: "lnmiit-lusip",
    title: "LUSIP 2024 — Audio Deepfake Detection",
    issuer: "LNMIIT Jaipur",
    category: "Research Internship",
    date: "2024",
    badge: "Undergraduate Research",
    file: "/documents/Certificates/LNMIIT — LUSIP 2026.pdf",
    description: "Summer research internship certificate investigating acoustic detection models for voice synthesis."
  },
  {
    id: "redhat-rh124",
    title: "Red Hat System Administration I (RH124)",
    issuer: "Red Hat Training",
    category: "Course Attendance",
    date: "2024",
    badge: "Linux Systems",
    file: "/documents/Certificates/Red Hat — System Administration I (RH124).pdf",
    description: "Comprehensive core Linux system administration, storage management, and process control."
  },
  {
    id: "infosys-dbms",
    title: "Database Management System Part 1",
    issuer: "Infosys Springboard",
    category: "Course Completion",
    date: "2024",
    badge: "Database",
    file: "/documents/Certificates/Infosys Springboard — Database Management System Part 1.pdf",
    description: "Relational database concepts, normalization, query optimization, and transaction ACID properties."
  },
  {
    id: "deloitte-cyber",
    title: "Deloitte Cyber Job Simulation",
    issuer: "Deloitte (Forage)",
    category: "Simulation Completion",
    date: "2024",
    badge: "Industry Simulation",
    file: "/documents/Certificates/Deloitte — Cyber Job Simulation.pdf",
    description: "Practical simulation of enterprise cybersecurity operations, risk assessment, and incident response."
  },
  {
    id: "google-ai",
    title: "Build with AI Bootcamp",
    issuer: "Google for Developers",
    category: "Bootcamp Attendance",
    date: "2024",
    badge: "AI/ML",
    file: "/documents/Certificates/Google for Developers — Build with AI Bootcamp.pdf",
    description: "Hands-on engineering bootcamp covering multimodal AI models, generative workflows, and APIs."
  },
  {
    id: "hacktoberfest",
    title: "Hack Day Jaipur Attendance",
    issuer: "Hacktoberfest 2024",
    category: "Event Attendance",
    date: "October 2024",
    badge: "Open Source",
    file: "/documents/Certificates/Hacktoberfest 2026 — Hack Day Jaipur.png",
    description: "Participation in community open source hack day, code reviews, and collaborative development."
  },
  {
    id: "drone-workshop",
    title: "Introduction to Drone Engineering",
    issuer: "Robotics & Engineering Society",
    category: "Workshop Participation",
    date: "2023",
    badge: "Engineering Workshop",
    file: "/documents/Certificates/Introduction to Drone Engineering Workshop.jpeg",
    description: "Foundational workshop in UAV flight mechanics, hardware telemetry, and sensor integration."
  }
];

// Clean sticker assets (all verified clean PNG expressions)
export const stickerPack = [
  { id: "smiling", name: "Smiling", src: "/assets/samridhi_individual_avatar_poses/13_expression_smiling.png" },
  { id: "laughing", name: "Laughing", src: "/assets/samridhi_individual_avatar_poses/08_expression_laughing.png" },
  { id: "idea", name: "Idea", src: "/assets/samridhi_individual_avatar_poses/10_expression_idea.png" },
  { id: "dreamy", name: "Dreamy", src: "/assets/samridhi_individual_avatar_poses/09_expression_dreamy.png" },
  { id: "curious", name: "Curious", src: "/assets/samridhi_individual_avatar_poses/11_expression_curious.png" },
  { id: "winking", name: "Winking", src: "/assets/samridhi_individual_avatar_poses/12_expression_winking.png" },
  { id: "bashful", name: "Bashful", src: "/assets/samridhi_individual_avatar_poses/14_expression_bashful.png" }
];

// Rebuilt About section data: Developer_ID.EXE × Creative_ID.EXE
export const aboutData = {
  eyebrow: "ABOUT / COMPUTER SCIENCE",
  heading: "Building systems. Understanding how they work.",
  identityLine: "Undergraduate · B.Tech Computer Science & Engineering · JKLU · Batch 2024–2028",

  profiles: {
    developer: {
      id: "developer",
      tabLabel: "Developer_ID.EXE",
      card: {
        title: "DEVELOPER_ID.EXE",
        subtitle: "// COMPUTER SCIENCE MODE",
        status: "ACCESS: GRANTED",
        name: "SAMRIDHI GUPTA",
        education: "B.Tech Computer Science & Engineering",
        university: "JK Lakshmipat University (JKLU)",
        batch: "2024–2028",
        focusChips: [
          "Systems",
          "Cloud",
          "Cybersecurity",
          "Software Engineering",
          "AI / ML",
          "Data Structures & Algorithms"
        ],
        techChips: [
          "C",
          "C++",
          "Python",
          "Java",
          "React",
          "Node.js",
          "Express",
          "MongoDB",
          "FastAPI",
          "SQL",
          "Linux (RH124)",
          "Git & GitHub"
        ],
        roleStrip: "STUDENT · RESEARCHER · DEVELOPER",
        quote: "Building reliable software. Exploring what's next.",
        footer: "// VERSION 3.0"
      },
      written: {
        research: {
          title: "Research & Engineering",
          intro: "My technical passion lies at the intersection of systems programming, cybersecurity static analysis, and practical full-stack web applications. I enjoy understanding the internal mechanics of how systems execute—from parsing compiled bytecodes in Android APKs to modeling large-scale spatial migrations.",
          items: [
            {
              role: "Cybersecurity Research Intern (ISEA-III)",
              org: "MNIT Jaipur",
              details: "Investigated network security protocols, vulnerability assessment methodologies, and Android platform bytecode security analysis."
            },
            {
              role: "Audio Deepfake Detection Research (LUSIP 2024)",
              org: "LNMIIT Jaipur",
              details: "Researched audio signal processing and acoustic feature classification to detect synthetic AI-generated voices."
            }
          ]
        },
        howIWork: {
          title: "How I Work",
          items: [
            {
              title: "Evidence-first engineering",
              text: "I prioritize rigorous, deterministic logic and reproducible benchmarks over surface-level claims or hand-waving abstractions."
            },
            {
              title: "Continuous systems learning",
              text: "From low-level Linux administration (RH124) to distributed document stores, I invest in deep computer science foundations."
            }
          ]
        },
        direction: {
          title: "Engineering Direction",
          text: "I'm interested in how software systems are designed, built, and secured. I want to deepen my understanding of cloud computing, cybersecurity, system design, software engineering, and applied AI/ML through hands-on engineering and research. Game development is another area I'd like to explore in the future."
        },
        facts: [
          { label: "Location", val: "Jaipur, Rajasthan, India" },
          { label: "Current Status", val: "Undergraduate · 2024–2028" },
          { label: "Core Focus", val: "MERN Stack • Systems • Security Analysis" },
          { label: "Interests", val: "Research, Deepfake Forensics, Retro Pixel Art" }
        ]
      }
    },
    creative: {
      id: "creative",
      tabLabel: "Creative_ID.EXE",
      card: {
        title: "CREATIVE_ID.EXE",
        subtitle: "// CREATIVE MODE ON",
        status: "ACCESS: GRANTED",
        name: "SAMRIDHI GUPTA",
        interests: [
          "Animation",
          "Romcoms & K-dramas",
          "Fitness",
          "Art",
          "Photography",
          "Nature Walks"
        ],
        tools: [
          "Figma",
          "Canva",
          "Adobe Creative Suite",
          "Stitch",
          "Lovable"
        ],
        quote: "Same girl. More dimensions.",
        footer: "CREATE / EXPLORE / EXPERIMENT / REPEAT"
      },
      written: {
        paragraph: "Outside my technical work, I enjoy art, photography, animation, and visual storytelling. I like experimenting with creative tools and exploring how design and technology can combine to create thoughtful, expressive digital experiences.",
        howIWork: {
          title: "Creative & thoughtful design",
          text: "Digital tools should feel tactile, responsive, and humane—combining pixel craft with modern responsive architecture."
        }
      }
    }
  }
};

// 12 Original Paintings in Creative Corner Sketchbook Gallery
export const paintingsData = [
  { id: 1, src: "/art/art1.png", alt: "Original Painting 1" },
  { id: 2, src: "/art/art2.png", alt: "Original Painting 2" },
  { id: 3, src: "/art/art3.png", alt: "Original Painting 3" },
  { id: 4, src: "/art/art4.png", alt: "Original Painting 4" },
  { id: 5, src: "/art/art5.png", alt: "Original Painting 5" },
  { id: 6, src: "/art/art6.png", alt: "Original Painting 6" },
  { id: 7, src: "/art/art7.png", alt: "Original Painting 7" },
  { id: 8, src: "/art/art8.png", alt: "Original Painting 8" },
  { id: 9, src: "/art/art9.png", alt: "Original Painting 9" },
  { id: 10, src: "/art/art10.png", alt: "Original Painting 10" },
  { id: 11, src: "/art/art11.png", alt: "Original Painting 11" },
  { id: 12, src: "/art/art12.png", alt: "Original Painting 12" }
];
