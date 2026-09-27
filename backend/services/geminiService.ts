import { GoogleGenAI, Type } from "@google/genai";

export interface ClassificationResult {
  category: string;
  subCategory: string;
  summary: string;
  confidence: number;
  disclaimer: string;
}

const ALLOWED_CATEGORIES = [
  "Divorce & Family Law",
  "Criminal Law",
  "Property Law",
  "Civil Law",
  "Corporate & Business Law",
  "Employment & Labour Law",
  "Consumer Law",
  "Cyber Law",
  "Tax Law",
  "Intellectual Property",
  "Immigration Law",
  "Banking & Finance",
  "Motor Vehicle / Accident Claims",
  "Real Estate Law",
  "Other",
];

// Fallback heuristic classifier for offline/rate-limit resilience
function fallbackClassify(text: string): ClassificationResult {
  const lower = text.toLowerCase();

  if (lower.includes("tenant") || lower.includes("landlord") || lower.includes("deposit") || lower.includes("rent") || lower.includes("evict") || lower.includes("lease")) {
    return {
      category: "Property Law",
      subCategory: "Rental / Tenant Dispute",
      summary: "The query pertains to rental property rights, tenancy obligations, or deposit recovery.",
      confidence: 0.88,
      disclaimer: "This classification is informational and is not legal advice.",
    };
  }

  if (lower.includes("divorce") || lower.includes("custody") || lower.includes("child support") || lower.includes("spouse") || lower.includes("alimony") || lower.includes("marriage")) {
    return {
      category: "Divorce & Family Law",
      subCategory: "Matrimonial & Custody Relations",
      summary: "The inquiry involves domestic relations, marital separation, or child custody arrangements.",
      confidence: 0.89,
      disclaimer: "This classification is informational and is not legal advice.",
    };
  }

  if (lower.includes("car accident") || lower.includes("crash") || lower.includes("hit and run") || lower.includes("injury") || lower.includes("collision") || lower.includes("vehicle")) {
    return {
      category: "Motor Vehicle / Accident Claims",
      subCategory: "Traffic Collision & Bodily Injury",
      summary: "The problem relates to motor vehicle damage, insurance liability, or accident-related injury claims.",
      confidence: 0.87,
      disclaimer: "This classification is informational and is not legal advice.",
    };
  }

  if (lower.includes("fired") || lower.includes("severance") || lower.includes("boss") || lower.includes("wage") || lower.includes("overtime") || lower.includes("harassment") || lower.includes("employment")) {
    return {
      category: "Employment & Labour Law",
      subCategory: "Workplace Rights & Severance",
      summary: "The issue touches upon employer-employee relations, wage compliance, or termination disputes.",
      confidence: 0.85,
      disclaimer: "This classification is informational and is not legal advice.",
    };
  }

  if (lower.includes("trademark") || lower.includes("patent") || lower.includes("copyright") || lower.includes("stolen logo") || lower.includes("ip infringement")) {
    return {
      category: "Intellectual Property",
      subCategory: "Brand & Trademark Protection",
      summary: "The matter concerns proprietary creative assets, trademark ownership, or intellectual property rights.",
      confidence: 0.91,
      disclaimer: "This classification is informational and is not legal advice.",
    };
  }

  if (lower.includes("hack") || lower.includes("crypto") || lower.includes("data breach") || lower.includes("phishing") || lower.includes("scam online")) {
    return {
      category: "Cyber Law",
      subCategory: "Digital Fraud & Privacy Breach",
      summary: "The inquiry addresses digital compromise, unauthorized access, or online financial scams.",
      confidence: 0.86,
      disclaimer: "This classification is informational and is not legal advice.",
    };
  }

  if (lower.includes("arrest") || lower.includes("bail") || lower.includes("police") || lower.includes("charges") || lower.includes("warrant") || lower.includes("court hearing")) {
    return {
      category: "Criminal Law",
      subCategory: "Criminal Defense & Proceedings",
      summary: "The situation involves state allegations, law enforcement citations, or criminal defense procedures.",
      confidence: 0.84,
      disclaimer: "This classification is informational and is not legal advice.",
    };
  }

  if (lower.includes("visa") || lower.includes("green card") || lower.includes("immigration") || lower.includes("citizenship") || lower.includes("deport")) {
    return {
      category: "Immigration Law",
      subCategory: "Visas & Nationality Law",
      summary: "The topic relates to residency petitions, travel visas, or immigration clearance.",
      confidence: 0.88,
      disclaimer: "This classification is informational and is not legal advice.",
    };
  }

  return {
    category: "Civil Law",
    subCategory: "General Dispute Resolution",
    summary: "The user has described a general dispute or situation requiring legal clarification.",
    confidence: 0.65,
    disclaimer: "This classification is informational and is not legal advice.",
  };
}

export async function classifyLegalIssue(problemDescription: string): Promise<ClassificationResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY not configured or placeholder, using intelligent semantic fallback.");
    return fallbackClassify(problemDescription);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `You are a legal issue classification assistant. Classify the user's description into a broad legal category. Do not provide legal advice. Do not predict outcomes. Do not recommend a legal strategy. Do not claim that a law definitely applies. Do not predict whether the user will win or lose. Return structured JSON only.

Permitted categories:
${ALLOWED_CATEGORIES.map((c) => `- ${c}`).join("\n")}

User Problem Description:
"${problemDescription}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an informational legal category classification assistant. You identify which legal specialization matches a user's problem. You never provide legal advice or predict case outcomes.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "One of the permitted broad legal categories.",
            },
            subCategory: {
              type: Type.STRING,
              description: "A concise 2-4 word sub-category description.",
            },
            summary: {
              type: Type.STRING,
              description: "A neutral 1-2 sentence summary of what legal area this touches upon. Never predict outcomes.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score between 0.1 and 0.99.",
            },
            disclaimer: {
              type: Type.STRING,
              description: "Disclaimer stating this is informational and not legal advice.",
            },
          },
          required: ["category", "subCategory", "summary", "confidence", "disclaimer"],
        },
      },
    });

    const text = response.text?.trim() || "";
    const parsed = JSON.parse(text) as ClassificationResult;

    // Validate category
    if (!ALLOWED_CATEGORIES.includes(parsed.category)) {
      parsed.category = "Civil Law";
    }

    if (!parsed.disclaimer) {
      parsed.disclaimer = "This classification is informational and is not legal advice.";
    }

    return parsed;
  } catch (error) {
    console.error("Gemini classification failed, utilizing fallback classifier:", error);
    return fallbackClassify(problemDescription);
  }
}
