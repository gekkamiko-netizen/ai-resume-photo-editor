
# 履歴書AI写真くん (AI Resume Photo Editor)

スマホで撮影したカジュアルな写真を、AIの力で「スーツ着用・白背景」のプロフェッショナルな履歴書用写真に変換するWebアプリケーションです。

## ✨ 特徴
- **スーツ自動着用**: AIが服装を自然なビジネススーツに差し替えます。
- **背景自動補正**: どんな場所で撮った写真でも、清潔感のある白背景に変換します。
- **プライバシー配慮**: アップロードされた画像はサーバーに保存されず、ブラウザを閉じると消去されます。

## 🚀 デプロイ方法

このプロジェクトは [Vercel](https://vercel.com) を使って1分で公開できます。

1. このリポジトリを自分のGitHubアカウントにフォーク/プッシュします。
2. Vercelで新しいプロジェクトを作成し、このリポジトリを選択します。
3. **Environment Variables** に以下の設定を追加してください：
   - `API_KEY`: [Google AI Studio](https://aistudio.google.com/app/apikey) で取得したGemini APIキー
4. 「Deploy」をクリックして完了です。

## 🛠 技術スタック
- **Frontend**: React 19, Tailwind CSS
- **AI Engine**: Gemini 2.5 Flash Image (Google GenAI SDK)
- **Deployment**: Vercel

## ⚖️ 免責事項
本サービスはAIによる画像生成を利用しています。生成された画像の正確性や、特定の公的書類での有効性を完全に保証するものではありません。使用の際は、提出先の規定を確認してください。
