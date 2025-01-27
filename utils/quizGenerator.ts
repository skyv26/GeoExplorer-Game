import { Country, Question } from "@/types/rest-countries";

const getRandomIndex = (max: number): number => Math.floor(Math.random() * max);

// Function to pick unique random countries
const pickUniqueCountries = (countries: Country[], count: number): Country[] => {
  const selected: Country[] = [];
  const usedIndexes = new Set<number>();

  while (selected.length < count) {
    const index = getRandomIndex(countries.length);
    if (!usedIndexes.has(index)) {
      usedIndexes.add(index);
      selected.push(countries[index]);
    }
  }

  return selected;
};

const generateHints = (country: Country, questionType: string): string[] => {
  const hints: string[] = [];

  // Avoid hints that may overlap with the question type
  if (!questionType.includes("capital")) {
    hints.push(`The capital of the country is ${country.capital}.`);
  }
  if (!questionType.includes("region")) {
    hints.push(`The country is located in the region ${country.region}, and its subregion is ${country.subregion}.`);
  }
  if (!questionType.includes("population")) {
    hints.push(`The country has a population of ${country.population.toLocaleString()}.`);
  }
  if (!questionType.includes("area")) {
    hints.push(`The area of the country is ${country.area} square kilometers.`);
  }
  if (!questionType.includes("languages")) {
    if (country.languages.length > 0) {
      hints.push(
        `The country uses the following language(s): ${country.languages
          .map((language) => language.name)
          .join(", ")}.`
      );
    }
  }
  if (!questionType.includes("currency")) {
    if (country.currencies.length > 0) {
      hints.push(
        `The currency used is ${country.currencies
          .map((currency) => `${currency.name} (${currency.symbol})`)
          .join(", ")}.`
      );
    }
  }
  if (!questionType.includes("timezone")) {
    hints.push(`One of the timezones in the country is ${country.timezones[0]}.`);
  }
  if (!questionType.includes("flag")) {
    hints.push(`Here is the flag of the country: ${country.flag}`);
  }

  return hints;
};

// Function to generate a quiz question
export const generateQuestion = (countries: Country[]): Question => {
  if (countries.length < 4) {
    throw new Error("You must provide at least 4 countries.");
  }

  // Pick 4 unique countries, one for the correct answer and 3 as distractors
  const selectedCountries = pickUniqueCountries(countries, 4);
  const correctCountry = selectedCountries[0]; // Use the first one as the correct answer
  const shuffledOptions = selectedCountries
    .map((country) => country.name) // Get country names
    .sort(() => Math.random() - 0.5) // Shuffle the names
    .map((name, index) => ({
      id: String.fromCharCode(65 + index), // Convert index (0, 1, 2, 3) to A, B, C, D
      text: name.common, // Use the country name as the text
    }));

  const questionTemplates = [
    `What is the name of the country with the capital ${correctCountry.capital}?`,
    `Which country has this flag: ${correctCountry.flag}?`,
    `Which country is located in the region ${correctCountry.region} and subregion ${correctCountry.subregion}?`,
  ];

  const randomQuestion = questionTemplates[getRandomIndex(questionTemplates.length)];

  // Generate hints, passing the question type to avoid repetition
  const hints = generateHints(correctCountry, randomQuestion);

  return {
    question: randomQuestion,
    options: shuffledOptions,
    correctAnswer: shuffledOptions.find((each) => each.text === correctCountry.name.common)?.id as string,
    hints
  };
};
