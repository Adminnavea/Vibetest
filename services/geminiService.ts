import { GoogleGenAI } from "@google/genai";
import { Customer, EmailDraft } from "../types";

// Initialize Gemini AI Client
// Note: In a production app, never expose API keys on the client side.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRetentionEmail = async (
  customer: Customer, 
  discountValue: string = "20%"
): Promise<EmailDraft> => {
  
  const prompt = `
    You are a world-class marketing copywriter specializing in customer retention.
    
    Task: Write a personalized retention email for a customer who is at high risk of churning.
    
    Customer Details:
    - Name: ${customer.name}
    - Segment: ${customer.segment}
    - Lifetime Value: $${customer.ltv}
    - Last Purchase: ${customer.lastPurchaseDate}
    
    Offer:
    - We are offering a specific coupon: ${discountValue} off their next month/purchase.
    - Coupon Code: SAVE${discountValue.replace('%', '')}NOW
    
    Tone: Empathetic, professional, concise, and value-driven. Do not sound desperate.
    
    Output format:
    Return a JSON object with "subject" and "body" fields. The body should be plain text but formatted with newlines.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const parsed = JSON.parse(text);
    return {
      subject: parsed.subject || "Special Offer For You",
      body: parsed.body || "We missed you! Here is a coupon."
    };

  } catch (error) {
    console.error("Error generating email:", error);
    // Fallback if API fails or key is missing
    return {
      subject: `Exclusive Offer for ${customer.name}`,
      body: `Hi ${customer.name},\n\nWe noticed it's been a while since we've seen you. We value your business and would love to welcome you back with an exclusive ${discountValue} discount on your next order.\n\nUse code: SAVE${discountValue.replace('%', '')}NOW\n\nBest,\nThe Team`
    };
  }
};

export const generateUnsubscribePreventionEmail = async (
    customer: Customer
  ): Promise<EmailDraft> => {
    
    const prompt = `
      You are a marketing specialist.
      
      Task: Write a re-engagement email for a customer who is at risk of unsubscribing from our newsletter, but not necessarily churning from the product yet. The goal is to remind them of the value we provide in our content without being salesy.
      
      Customer Details:
      - Name: ${customer.name}
      - Segment: ${customer.segment}
      
      Tone: Helpful, low-pressure, informative.
      
      Output format:
      Return a JSON object with "subject" and "body" fields.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
      });
  
      const text = response.text;
      if (!text) throw new Error("No text");
      return JSON.parse(text);
  
    } catch (error) {
      console.error("Error generating email:", error);
      return {
        subject: `Getting the most out of your subscription`,
        body: `Hi ${customer.name},\n\nWe wanted to check in and ensure you're getting the value you expect from our updates. We've recently published some guides relevant to your sector.\n\nLet us know if you'd like to adjust your preferences.\n\nBest,\nThe Team`
      };
    }
  };
