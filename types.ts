
export interface Word {
  id: string;
  label: string;
}

export interface RecommendedCourse {
  curso: string;
  badge: string;
  area: string;
  grau: string;
  semestres: number;
}

export interface RankedArea {
  area: string;
  score: number;
}

export interface Recommendation {
  perfil_dominante: string;
  cursos_recomendados: RecommendedCourse[];
  resumo_executivo: string;
  relatorio_completo: string;
  areas_rankeadas?: RankedArea[];
}
