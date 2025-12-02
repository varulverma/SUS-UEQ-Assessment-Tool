export type QuestionnaireType = 'SUS' | 'UEQ';

export interface UeqResult {
  scale: string;
  mean: number;
}

interface BaseAssessment {
    id: string;
    participant: string;
    product: string;
    timestamp: string;
}

export interface SusAssessment extends BaseAssessment {
    type: 'SUS';
    scores: number[];
    totalScore: number;
}

export interface UeqAssessment extends BaseAssessment {
    type: 'UEQ';
    scores: number[];
    results: UeqResult[];
}

export type Assessment = SusAssessment | UeqAssessment;
