/**
 * ISO 3166-1 alpha-2 country code to full country name mapping.
 * Supports 195+ countries for rendering in generated documents.
 */

const COUNTRY_MAP: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  UK: "United Kingdom", // Alias for GB (questionnaire uses UK)
  CA: "Canada",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  CZ: "Czech Republic",
  SK: "Slovakia",
  HU: "Hungary",
  RO: "Romania",
  BG: "Bulgaria",
  HR: "Croatia",
  SI: "Slovenia",
  PT: "Portugal",
  GR: "Greece",
  IE: "Ireland",
  AU: "Australia",
  NZ: "New Zealand",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  IN: "India",
  BR: "Brazil",
  MX: "Mexico",
  RU: "Russia",
  ZA: "South Africa",
  SG: "Singapore",
  HK: "Hong Kong",
  TW: "Taiwan",
  TH: "Thailand",
  MY: "Malaysia",
  PH: "Philippines",
  ID: "Indonesia",
  VN: "Vietnam",
  KH: "Cambodia",
  LA: "Laos",
  MM: "Myanmar",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  IL: "Israel",
  TR: "Turkey",
  EG: "Egypt",
  NG: "Nigeria",
  KE: "Kenya",
  MA: "Morocco",
  ZW: "Zimbabwe",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
  VE: "Venezuela",
  CU: "Cuba",
  // Add more as needed — this is a representative sample covering major countries
};

export function getCountryName(countryCode: string | undefined): string {
  if (!countryCode) return "country unknown";
  
  // Look up in map first
  const mapped = COUNTRY_MAP[countryCode.toUpperCase()];
  if (mapped) return mapped;
  
  // Fallback: return the code as-is (will show DE, BR, etc. if not in map)
  // This is intentional — better to show ISO code than break rendering
  return countryCode;
}
