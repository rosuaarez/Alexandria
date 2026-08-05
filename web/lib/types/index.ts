export interface Protocol {
  id: string;
  _supabaseId?: string;
  name: string;
  type: 'express' | 'complete' | 'presentation' | 'ab';
  platform?: 'maze' | 'forms';
  template?: string;
  protoStatus: 'draft' | 'in-review' | 'approved' | 'ready' | 'completed' | 'onhold' | 'cerrado' | 'finalizado' | 'changes_requested' | 'activo';
  data?: Record<string, unknown>;
  generatedData?: GeneratedProtocolData;
  folderId?: string;
  sharedWith?: SharedUser[];
  comments?: Record<string, FieldComment[]>;
  findingsLink?: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  proyecto?: string;
  cliente?: string;
  tema?: string;
  icon?: string;
}

export interface GeneratedProtocolData {
  [key: string]: unknown;
}

export interface Folder {
  id: string;
  name: string;
  fecha?: string;
  desc?: string;
  icon?: string;
}

// Carpeta de proyecto de la Biblioteca de Protocolos (gestor de carpetas).
export interface ProjectFolder {
  id: string;
  name: string;
  emoji: string; // emoji del ícono, default '📁'
  description?: string;
  createdAt: string;
  protocolCount: number; // calculado desde protocols
}

export interface SharedUser {
  id: string;
  name: string;
  email: string;
  role?: 'researcher' | 'leader' | 'stakeholder';
}

export interface FieldComment {
  id: string;
  author: string;
  text: string;
  resolved?: boolean;
  replies?: FieldCommentReply[];
  createdAt: string;
}

export interface FieldCommentReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface AlexandriaUser {
  id: string;
  email: string;
  name: string;
  role: 'researcher' | 'leader';
  initials: string;
  // Datos de equipo provenientes de UiX Lingo (SSO). Opcionales: un usuario
  // sin `emp_id` (no está en ranking_user o no tiene equipo) opera en scope
  // personal.
  emp_id?: string;
  proyectos?: string[];
}

export type ProtocolStatus = Protocol['protoStatus'];
export type ProtocolType = Protocol['type'];
export type ProtocolPlatform = Protocol['platform'];

export type QuestionType =
  // Grupo "Preguntas"
  | 'open'
  | 'likert'
  | 'multiple'
  | 'yesno'
  | 'abtest'
  // Grupo "Técnicas UX"
  | 'five-second'
  | 'prototype'
  | 'context-screen'
  | 'tree-test'
  | 'card-sort'
  // Valores heredados (plantillas/datos previos); no se ofrecen en el dropdown.
  | 'instruction'
  | 'first-click'
  | 'survey'
  | 'design-survey'
  | 'preference'
  | 'navigation'
  | 'live-website'
  | 'closed'
  | 'scale5'
  | 'scale7'
  | 'nps';

// Variante para el bloque de configuración de A/B Test.
export interface ABVariant {
  id: string;
  desc: string;
  link: string;
  imageUrl?: string;
}

// Configuración dinámica por tipo de pregunta (todos los campos opcionales:
// cada subcomponente de TypeConfigFields usa solo los que le corresponden).
// Se serializa junto a la pregunta, por lo que persiste sin lógica extra.
export interface QuestionConfig {
  // Likert
  scale?: string;
  startLabel?: string;
  endLabel?: string;
  // Opción múltiple
  options?: string[];
  // A/B Test
  criterio?: string;
  variants?: ABVariant[];
  // 5 Seconds Test
  duration?: string;
  stimulusType?: string;
  measure?: string;
  instruction?: string;
  // Prototype Test
  tool?: string;
  fidelity?: string;
  task?: string;
  metric?: string;
  prototypeUrl?: string;
  // Context Screen
  screen?: string;
  usageContext?: string;
  scenario?: string;
  aspects?: string[];
  // Tree Test
  depth?: string;
  navTask?: string;
  expectedAnswer?: string;
  nodes?: string[];
  // Card Sort
  sortType?: string;
  cards?: string[];
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  config?: QuestionConfig;
}

export interface LibraryResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'template' | 'guide' | 'tool' | 'book';
  category:
    | 'usabilidad'
    | 'entrevistas'
    | 'metricas'
    | 'accesibilidad'
    | 'investigacion'
    | 'herramientas'
    | 'metodologia';
  tags: string[];
  url?: string;
  thumbnailEmoji: string; // emoji representativo
  author?: string;
  readTime?: string; // ej: "8 min"
  isFavorite: boolean;
  isNew: boolean; // badge "Nuevo"
  createdAt: string;
}

export type LibraryResourceType = LibraryResource['type'];
export type LibraryCategory = LibraryResource['category'];

export interface Capsula {
  id: string;
  title: string;
  description: string;
  content: string; // markdown o texto largo
  category: 'metodo' | 'consejo' | 'caso-estudio' | 'herramienta' | 'dato';
  tags: string[];
  emoji: string;
  readTime: string;
  isFavorite: boolean;
  isNew: boolean;
  author: string;
  createdAt: string;
  relatedProtocolTypes?: ProtocolType[];
}

export type CapsulaCategory = Capsula['category'];

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'researcher' | 'leader' | 'stakeholder';
  initials: string;
  avatarColor: string; // color hex para el avatar
  joinedAt: string;
  protocolsCount: number;
  status: 'active' | 'invited' | 'inactive';
}

export interface ProtocolComment {
  id: string;
  protocolId: string;
  fieldKey: string; // qué campo del protocolo comentan
  fieldLabel: string; // label legible del campo
  quote?: string; // fragmento del texto original sobre el que se comentó
  author: TeamMember;
  text: string;
  resolved: boolean;
  replies: CommentReply[];
  createdAt: string;
}

export interface CommentReply {
  id: string;
  author: TeamMember;
  text: string;
  createdAt: string;
}

export type TeamRole = TeamMember['role'];
export type MemberStatus = TeamMember['status'];
