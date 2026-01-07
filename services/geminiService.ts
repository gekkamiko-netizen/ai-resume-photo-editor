
import { GoogleGenAI } from "@google/genai";
import { GeminiEditResponse, ProcessOptions } from "../types";

export const editImageToProfessional = async (
  base64Image: string,
  options: ProcessOptions
): Promise<GeminiEditResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  // 安定性の高い2.5 Flash Imageを使用
  const model = 'gemini-2.5-flash-image';
  
  const colorMap = {
    black: '黒のビジネススーツ',
    navy: '紺色のビジネススーツ',
    gray: 'グレーのビジネススーツ'
  };

  const prompt = `
    この人物を日本の履歴書用の証明写真に変換してください。
    
    【必須条件】
    1. 服装を「${colorMap[options.suitColor]}」と「白いワイシャツ」に変更してください。
    2. 背景を完全な「無地の白」にしてください。影は不要です。
    3. 顔のパーツや特徴は一切変えず、本人であることがはっきりわかるようにしてください。
    4. 日本のビジネスシーンにふさわしい、清潔感のある明るいライティングにしてください。
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      }
    });

    let generatedImageUrl: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    return { imageUrl: generatedImageUrl };
  } catch (error: any) {
    if (error.message?.includes('429')) {
      throw new Error("現在混み合っています。少し時間をおいてからやり直してください。");
    }
    throw new Error("画像の作成に失敗しました。顔がはっきり写っている別の写真で試してください。");
  }
};
