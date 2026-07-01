export const ACCEPTED_RESUME_FORMATS = ['.txt', '.pdf', '.docx'] as const;

/** Score maxima per the scoring API (overall = 100). */
export const SCORE_MAX = {
  experience: 50,
  skills: 40,
  extra: 10,
} as const;
