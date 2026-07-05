export type Lang = "pt" | "en";

export interface FocusItem {
  h: string;
  p: string;
}

export interface UIStrings {
  nav: string[];
  rolePrefix: string;
  roleWords: string[];
  projectsTitle: string;
  projectsSub: string;
  contactCta: string;
  statusDone: string;
  statusDev: string;
  repoLabel: string;
  siteLabel: string;
  showMore: string;
  showLess: string;
  aboutTitle: string;
  aboutLead: string;
  aboutParas: string[];
  aboutCats: string[];
  focus: FocusItem[];
  skillsCap: string;
  skills: string[];
  eduTitle: string;
  eduDegree: string;
  eduInst: string;
  eduStatus: string;
  langTitle: string;
  langName: string;
  langLevel: string;
  contactTitle: string;
  contactLead: string;
  contactEmailBtn: string;
  contactLinkedinBtn: string;
}

export const ui: Record<Lang, UIStrings> = {
  pt: {
    nav: ["Projetos", "Sobre", "Contato", "CV"],
    rolePrefix: "Desenvolvedor de",
    roleWords: ["Sistemas", "APIs", "Automações", "Soluções"],
    projectsTitle: "Projetos",
    projectsSub:
      "Aqui, você encontra uma seleção de projetos variados que já desenvolvi e venho desenvolvendo atualmente.",
    contactCta: "Contate-me",
    statusDone: "Concluído",
    statusDev: "Em desenvolvimento",
    repoLabel: "Repositório",
    siteLabel: "Acessar site",
    showMore: "Mostrar mais",
    showLess: "Mostrar menos",
    aboutTitle: "Sobre mim",
    aboutLead: "Desenvolvedor Full Stack",
    aboutParas: [
      "Meu diferencial vem de unir desenvolvimento com vivência prática em operação de negócio. Antes de programar, passei anos lidando diretamente com atendimento, estoque, controle financeiro, vendas e suporte técnico. Essa experiência me ensinou a olhar para um problema além da tela: entender o fluxo, identificar gargalos, reduzir erros e pensar em soluções que realmente funcionem no dia a dia.",
      "Hoje analiso e desenvolvo soluções com essa mesma visão. Antes de sair codando, busco entender o contexto, quem vai usar, quais processos precisam ser melhorados e como o sistema pode ser simples de manter, evoluir e gerar valor de verdade. Gosto de construir com organização, clareza e uma estrutura bem pensada desde o início.",
    ],
    aboutCats: ["Backend", "Frontend", "Dados & Infra", "Ferramentas"],
    focus: [
      { h: "Sistemas & APIs", p: "Estruturação de sistemas, regras de negócio e integrações pensadas para funcionar bem hoje e continuar evoluindo depois." },
      { h: "Automação", p: "Desenvolvimento de soluções que conectam ferramentas, reduzem trabalho manual e tornam a operação mais ágil." },
      { h: "Processos em software", p: "Leitura do fluxo real do negócio para transformar problemas operacionais em soluções simples, úteis e bem organizadas." },
    ],
    skillsCap: "Pontos fortes",
    skills: [
      "Comprometimento",
      "Organização",
      "Aprendizado contínuo",
      "Foco em resultado",
      "Resolução de problemas",
      "Proatividade",
      "Trabalho em equipe",
      "Comunicação",
    ],
    eduTitle: "Formação",
    eduDegree: "Sistemas de Informação",
    eduInst: "PUC Minas · Betim, MG",
    eduStatus: "Cursando",
    langTitle: "Idiomas",
    langName: "Inglês",
    langLevel: "Leitura e compreensão avançadas, conversação intermediária",
    contactTitle: "Contato",
    contactLead: "Vamos conversar? Me mande um email ou me chame no LinkedIn para nos falarmos melhor.",
    contactEmailBtn: "Enviar um email",
    contactLinkedinBtn: "Chamar no LinkedIn",
  },
  en: {
    nav: ["Work", "About", "Contact", "CV"],
    rolePrefix: "Developer of",
    roleWords: ["Systems", "APIs", "Automation", "Solutions"],
    projectsTitle: "Work",
    projectsSub:
      "Here, you’ll find a curated selection of projects I’ve developed and continue to improve.",
    contactCta: "Contact me",
    statusDone: "Completed",
    statusDev: "In progress",
    repoLabel: "Repository",
    siteLabel: "Visit site",
    showMore: "Show more",
    showLess: "Show less",
    aboutTitle: "About me",
    aboutLead: "Full Stack Developer",
    aboutParas: [
      "What sets me apart is combining development with hands-on experience running a business operation. Before coding, I spent years dealing directly with customer service, inventory, finances, sales and technical support. That experience taught me to look at a problem beyond the screen: understanding the flow, spotting bottlenecks, reducing errors and thinking of solutions that actually work day to day.",
      "Today I analyze and build solutions with that same mindset. Before jumping into code, I work to understand the context, who will use it, which processes need improving and how the system can be simple to maintain, evolve and deliver real value. I like to build with organization, clarity and a well-thought structure from the start.",
    ],
    aboutCats: ["Backend", "Frontend", "Data & Infra", "Tools"],
    focus: [
      { h: "Systems & APIs", p: "Structuring systems, business rules and integrations designed to work well today and keep evolving later." },
      { h: "Automation", p: "Building solutions that connect tools, cut manual work and make the operation more agile." },
      { h: "Software processes", p: "Reading the real business flow to turn operational problems into simple, useful and well-organized solutions." },
    ],
    skillsCap: "Strengths",
    skills: [
      "Commitment",
      "Organization",
      "Continuous learning",
      "Result-oriented",
      "Problem solving",
      "Proactivity",
      "Teamwork",
      "Communication",
    ],
    eduTitle: "Education",
    eduDegree: "Information Systems",
    eduInst: "PUC Minas · Betim, BR",
    eduStatus: "In progress",
    langTitle: "Languages",
    langName: "English",
    langLevel: "Advanced reading and comprehension, intermediate speaking",
    contactTitle: "Contact",
    contactLead: "Let's talk? Send me an email or reach out on LinkedIn and we can chat.",
    contactEmailBtn: "Send an email",
    contactLinkedinBtn: "Message on LinkedIn",
  },
};


export interface ProjectLocale {
  desc: string;
}

export interface Project {
  id: "kmcontrol" | "maisgrana" | "cinema";
  title: string;
  tags: string[];
  repo: string;
  site?: string;
  status: "dev" | "done";
  image?: string;
  pt: ProjectLocale;
  en: ProjectLocale;
}

export const projects: Project[] = [
  {
    id: "kmcontrol",
    title: "KM-Control",
    tags: ["C#", "ASP.NET Core", "EF Core", "MySQL"],
    repo: "https://github.com/DanielMeirelesSi/KM_Control",
    site: "https://km-control-pi.vercel.app/",
    status: "dev",
    image: "/km-control.png",
    pt: { desc: "Sistema web para controle de veículos e abastecimentos, com dashboard de consumo, custo por km e histórico. Nasceu de uma necessidade real e já tem versão demo publicada." },
    en: { desc: "Web system for vehicle and fuel tracking, with a dashboard for consumption, cost per km and history. Born from a real need, with a published demo version." },
  },
  {
    id: "maisgrana",
    title: "+Grana",
    tags: ["NestJS", "React", "MongoDB", "JWT", "Docker"],
    repo: "https://github.com/DanielMeirelesSi/MaisGrana",
    status: "dev",
    image: "/mais-grana.png",
    pt: { desc: "Sistema de gestão financeira com dashboard, metas e controle de gastos. Backend em NestJS com autenticação JWT, isolamento de dados por usuário, MongoDB e execução em Docker Compose." },
    en: { desc: "Financial management system with dashboard, goals and expense tracking. NestJS backend with JWT auth, per-user data isolation, MongoDB and Docker Compose." },
  },
  {
    id: "cinema",
    title: "CinemaTicketsAPI",
    tags: ["C#", "ASP.NET Core", "REST", "Swagger"],
    repo: "https://github.com/DanielMeirelesSi/CinemaTicketsAPI",
    status: "done",
    image: "/cinema-tickets.png",
    pt: { desc: "API REST em C# para venda de ingressos de cinema, com controle de sessões e assentos, prevenção de venda duplicada e controle de concorrência com lock." },
    en: { desc: "REST API in C# for cinema ticket sales, with session and seat control, duplicate-sale prevention and lock-based concurrency control." },
  },
];


export interface Tech {
  n: string;
  url: string;
  dark?: boolean;
}

const ICON = (name: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;

export const stack: Tech[][] = [
  [
    { n: "C#", url: ICON("csharp") },
    { n: "ASP.NET Core", url: ICON("dotnetcore") },
    { n: "Node.js", url: ICON("nodejs") },
    { n: "NestJS", url: ICON("nestjs") },
  ],
  [
    { n: "React", url: ICON("react") },
    { n: "JavaScript", url: ICON("javascript") },
    { n: "HTML5", url: ICON("html5") },
    { n: "CSS3", url: ICON("css3") },
    { n: "Bootstrap", url: ICON("bootstrap") },
  ],
  [
    { n: "MySQL", url: ICON("mysql") },
    { n: "MongoDB", url: ICON("mongodb") },
    { n: "Docker", url: ICON("docker") },
    { n: "NGINX", url: ICON("nginx") },
    { n: "Linux", url: ICON("linux") },
  ],
  [
    { n: "Git", url: ICON("git") },
    { n: "GitHub", url: ICON("github"), dark: true },
    { n: "Postman", url: ICON("postman") },
    { n: "Vercel", url: ICON("vercel"), dark: true },
  ],
];

export const socials = {
  email: "daniel.meireles.pro@gmail.com",
  github: "https://github.com/DanielMeirelesSi",
  githubLabel: "github.com/DanielMeirelesSi",
  linkedin: "https://www.linkedin.com/in/daniel-meireles-343821354",
  linkedinLabel: "linkedin.com/in/daniel-meireles",
  cv: "/cv-daniel-meireles.pdf",
};