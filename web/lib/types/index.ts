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
}

export type ProtocolStatus = Protocol['protoStatus'];
export type ProtocolType = Protocol['type'];
export type ProtocolPlatform = Protocol['platform'];

export type QuestionType =
  | 'open'
  | 'closed'
  | 'scale5'
  | 'scale7'
  | 'multiple'
  | 'nps';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
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
