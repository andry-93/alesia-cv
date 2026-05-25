export type Locale = 'en' | 'ru';

export interface NavItem {
  id: string;
  label: string;
}

export interface AchievementItem {
  number: string;
  label: string;
}

export interface ExperienceItem {
  period: string;
  company: string;
  position: string;
  paragraphs: string[];
}

export interface EducationItem {
  period: string;
  institution: string;
  degree: string;
}

export interface CertificateItem {
  file: string;
  name: string;
  date: string;
  issuer: string;
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface CvData {
  pageTitle: string;
  name: string;
  heroTitle: string;
  heroStatus: string;
  heroLocation: string;
  nav: NavItem[];
  about: { title: string; text: string };
  achievements: { title: string; items: AchievementItem[] };
  skills: { title: string; items: string[] };
  experience: { title: string; items: ExperienceItem[] };
  education: { title: string; items: EducationItem[] };
  certificates: { title: string; items: CertificateItem[] };
  languages: { title: string; items: LanguageItem[] };
  contact: {
    title: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    telegram: string;
    downloadLabel: string;
    cvFile: string;
  };
}

export type CvDictionary = Record<Locale, CvData>;
