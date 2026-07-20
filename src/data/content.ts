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
  contactWhatsappBtn: string;
  contactWaMsg: string;
  contactFreela: string;
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
    contactWhatsappBtn: "Chamar no WhatsApp",
    contactWaMsg: "Olá Daniel, vi seu portfólio e gostaria de conversar",
    contactFreela: "Também estou disponível para projetos freelancer.",
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
    contactWhatsappBtn: "Message on WhatsApp",
    contactWaMsg: "Hi Daniel, I saw your portfolio and would like to talk",
    contactFreela: "I'm also available for freelance projects.",
  },
};

export type CategoryId = "all" | "web" | "backend" | "client";

export interface Category {
  id: CategoryId;
  pt: string;
  en: string;
}

export const categories: Category[] = [
  { id: "all", pt: "Todos", en: "All" },
  { id: "web", pt: "Sistemas web", en: "Web systems" },
  { id: "backend", pt: "APIs e backend", en: "APIs & backend" },
  { id: "client", pt: "Trabalhos para clientes", en: "Client work" },
];

export interface ProjectLocale {
  desc: string;
}

export interface Project {
  id: "kmcontrol" | "maisgrana" | "cinema" | "atelie" | "internal" | "banqueiro" | "mmoveis";
  title: string;
  tags: string[];
  categories: Exclude<CategoryId, "all">[];
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
    categories: ["web"],
    repo: "https://github.com/DanielMeirelesSi/KM_Control",
    site: "https://km-control-pi.vercel.app/",
    status: "dev",
    image: "/km-control.png",
    pt: { desc: "Sistema web para controle de veículos e abastecimentos, com dashboard de consumo, custo por km e histórico. Nasceu de uma necessidade real e já tem versão demo publicada." },
    en: { desc: "Web system for vehicle and fuel tracking, with a dashboard for consumption, cost per km and history. Born from a real need, with a published demo version." },
  },
  {
    id: "atelie",
    title: "Ateliê Biblioteca Aromática",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    categories: ["client"],
    repo: "https://github.com/DanielMeirelesSi/atelie-biblioteca-aromatica",
    site: "https://www.ateliebibliotecaaromatica.com.br",
    status: "done",
    image: "/atelie.png",
    pt: { desc: "Site institucional e catálogo virtual para uma marca artesanal, com layout mobile-first e pedidos encaminhados direto para o WhatsApp da loja." },
    en: { desc: "Marketing site and online catalog for an artisanal brand, with a mobile-first layout and orders routed straight to the shop's WhatsApp." },
  },
  {
    id: "mmoveis",
    title: "M Móveis Rústicos",
    tags: ["Nuvemshop", "E-commerce", "Design", "Configuração de Domínio"],
    categories: ["client"],
    repo: "",
    site: "https://www.mmoveisrusticos.com.br",
    status: "done",
    image: "/mmoveis.png",
    pt: { desc: "Criação e personalização completa de loja virtual para uma marca de móveis rústicos, incluindo design, layout, catálogo de produtos e configuração de domínio." },
    en: { desc: "Full setup and customization of an online store for a rustic furniture brand, including design, layout, product catalog and domain configuration." },
  },
  {
    id: "maisgrana",
    title: "+Grana",
    tags: ["NestJS", "React", "MongoDB", "JWT", "Docker"],
    categories: ["web"],
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
    categories: ["backend"],
    repo: "https://github.com/DanielMeirelesSi/CinemaTicketsAPI",
    status: "done",
    image: "/cinema-tickets.png",
    pt: { desc: "API REST em C# para venda de ingressos de cinema, com controle de sessões e assentos, prevenção de venda duplicada e controle de concorrência com lock." },
    en: { desc: "REST API in C# for cinema ticket sales, with session and seat control, duplicate-sale prevention and lock-based concurrency control." },
  },
  {
    id: "internal",
    title: "InternalTicketsAPI",
    tags: ["Node.js", "Express", "REST"],
    categories: ["backend"],
    repo: "https://github.com/DanielMeirelesSi/InternalTicketsAPI",
    status: "done",
    image: "/tickets.png",
    pt: { desc: "API para controle de chamados internos entre setores, desenvolvida com Node.js e Express, com rotas para abertura, acompanhamento e resolução de chamados." },
    en: { desc: "API for managing internal support tickets between departments, built with Node.js and Express, with routes to open, track and resolve tickets." },
  },
  {
    id: "banqueiro",
    title: "Algoritmo do Banqueiro",
    tags: ["C#", "Sistemas Operacionais", "Algoritmos"],
    categories: ["backend"],
    repo: "https://github.com/DanielMeirelesSi/SO-T1-Algoritmo-do-Banqueiro",
    status: "done",
    image: "/banqueiro.png",
    pt: { desc: "Implementação em C# do Algoritmo do Banqueiro, de Sistemas Operacionais, para alocação segura de recursos e prevenção de deadlocks." },
    en: { desc: "C# implementation of the Banker's Algorithm from Operating Systems, for safe resource allocation and deadlock prevention." },
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
  whatsapp: "5531997111572",
  cv: "/cv-daniel-meireles.pdf",
};