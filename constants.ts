
export const SUS_QUESTIONS = [
  { id: 1, text: "I think that I would like to use this system frequently." },
  { id: 2, text: "I found the system unnecessarily complex." },
  { id: 3, text: "I thought the system was easy to use." },
  { id: 4, text: "I think that I would need the support of a technical person to be able to use this system." },
  { id: 5, text: "I found the various functions in this system were well integrated." },
  { id: 6, text: "I thought there was too much inconsistency in this system." },
  { id: 7, text: "I would imagine that most people would learn to use this system very quickly." },
  { id: 8, text: "I found the system very cumbersome to use." },
  { id: 9, text: "I felt very confident using the system." },
  { id: 10, text: "I needed to learn a lot of things before I could get going with this system." },
];

// Each pair has a left and right adjective. Polarity is 1 if right is positive, -1 if left is positive.
export const UEQ_ITEM_PAIRS = [
    { left: "annoying", right: "enjoyable", scale: "Attractiveness", polarity: 1 },
    { left: "not understandable", right: "understandable", scale: "Perspicuity", polarity: 1 },
    { left: "creative", right: "dull", scale: "Stimulation", polarity: -1 },
    { left: "easy to learn", right: "difficult to learn", scale: "Perspicuity", polarity: -1 },
    { left: "valuable", right: "inferior", scale: "Attractiveness", polarity: -1 },
    { left: "boring", right: "exciting", scale: "Stimulation", polarity: 1 },
    { left: "not interesting", right: "interesting", scale: "Stimulation", polarity: 1 },
    { left: "unpredictable", right: "predictable", scale: "Dependability", polarity: 1 },
    { left: "fast", right: "slow", scale: "Efficiency", polarity: -1 },
    { left: "inventive", right: "conventional", scale: "Novelty", polarity: -1 },
    { left: "obstructive", right: "supportive", scale: "Dependability", polarity: 1 },
    { left: "good", right: "bad", scale: "Attractiveness", polarity: -1 },
    { left: "complicated", right: "easy", scale: "Perspicuity", polarity: 1 },
    { left: "unlikable", right: "pleasing", scale: "Attractiveness", polarity: 1 },
    { left: "usual", right: "leading edge", scale: "Novelty", polarity: 1 },
    { left: "unpleasant", right: "pleasant", scale: "Attractiveness", polarity: 1 },
    { left: "secure", right: "not secure", scale: "Dependability", polarity: -1 },
    { left: "motivating", right: "demotivating", scale: "Stimulation", polarity: -1 },
    { left: "meets expectations", right: "does not meet expectations", scale: "Dependability", polarity: -1 },
    { left: "inefficient", right: "efficient", scale: "Efficiency", polarity: 1 },
    { left: "clear", right: "confusing", scale: "Perspicuity", polarity: -1 },
    { left: "unattractive", right: "attractive", scale: "Attractiveness", polarity: 1 },
    { left: "friendly", right: "unfriendly", scale: "Attractiveness", polarity: -1 },
    { left: "conservative", right: "innovative", scale: "Novelty", polarity: 1 },
    { left: "impractical", right: "practical", scale: "Efficiency", polarity: 1 },
    { left: "disorganized", right: "organized", scale: "Efficiency", polarity: 1 },
];

export const UEQ_SCALES = [
    "Attractiveness",
    "Perspicuity",
    "Efficiency",
    "Dependability",
    "Stimulation",
    "Novelty",
];

// From https://www.ueq-online.org/wp-content/uploads/2016/06/Data_analysis_UEQ_Version8.xls
export const UEQ_BENCHMARK = {
    Excellent: { low: 1.83, high: 3.00 },
    Good: { low: 1.51, high: 1.83 },
    AboveAverage: { low: 1.25, high: 1.51 },
    BelowAverage: { low: 0.96, high: 1.25 },
    Bad: { low: -3.00, high: 0.96 },
};
