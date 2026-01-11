
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getAIInsights = async (transactions: Transaction[]) => {
  if (transactions.length === 0) return "Add some transactions to get AI insights!";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const summary = transactions.map(t => ({
    dealer: t.dealerName,
    weight: t.weightKg,
    price: t.pricePerKg,
    total: t.totalAmount,
    paid: t.isPaid,
    date: t.date
  }));

  const prompt = `
    Analyze the following chicken farm shop sales data and provide a concise 3-sentence summary of business performance.
    Identify the most active dealer and any concerns regarding unpaid balances.
    Data: ${JSON.stringify(summary)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Error connecting to AI service.";
  }
};
