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
    times: number[]; // Time in seconds per question
    totalScore: number;
}

export interface UeqAssessment extends BaseAssessment {
    type: 'UEQ';
    scores: number[];
    times: number[]; // Time in seconds per question
    results: UeqResult[];
}

export type Assessment = SusAssessment | UeqAssessment;