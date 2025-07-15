# Google Cloud Vertex AI での Gemini API 利用手順書

最終更新: 2025-07-16

## 概要

このドキュメントでは、企業でのセキュアな Gemini API 利用を目的として、Google Cloud Vertex AI プラットフォームでの Gemini API セットアップと利用方法を詳しく説明します。

## 企業利用におけるセキュリティ上の利点

### データプライバシー

- **データの学習利用なし**: Vertex AI での Gemini API 利用時は、送信されたデータがモデルの学習に使用されません
- **エンタープライズグレードセキュリティ**: Google Cloud の企業向けセキュリティ機能が適用されます
- **データの地理的制御**: データの保存場所やアクセスを制御できます

### Google AI Studio と Vertex AI の比較

| 項目                 | Google AI Studio       | Vertex AI               |
| -------------------- | ---------------------- | ----------------------- |
| データの学習利用     | 有料プランでは制限あり | 利用されない            |
| エンタープライズ機能 | 限定的                 | 完全対応                |
| 料金体系             | 従量課金               | 従量課金 + 企業向け機能 |
| 推奨用途             | 個人・小規模開発       | 企業・本格運用          |

## 前提条件

### システム要件

- Node.js 18.0 以上
- Google Cloud アカウント
- 有効なクレジットカード（課金設定用）

### 必要な権限

- Google Cloud プロジェクトの作成・管理権限
- Vertex AI API の有効化権限
- IAM（Identity and Access Management）設定権限

## ステップ 1: Google Cloud プロジェクトのセットアップ

### 1.1 Google Cloud プロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
   - プロジェクト名: `gemini-api-project`（任意）
   - 組織: 適切な組織を選択
   - プロジェクト ID: 自動生成またはカスタム指定

### 1.2 課金設定

1. Google Cloud Console の「課金」セクションにアクセス
2. プロジェクトに課金アカウントを関連付け
3. 課金アラートの設定（推奨）

### 1.3 Google アカウントのプランが有料かどうかの確認方法

企業利用において、現在のアカウントが有料プランかどうかを確認することは重要です。

#### Google Cloud Console での確認方法

1. **課金アカウントの確認**

   - [Google Cloud Console](https://console.cloud.google.com/)にログイン
   - 左側メニューから「課金」をクリック
   - 「課金アカウント」ページで現在の状態を確認

2. **課金ステータスの確認項目**
   - **無料試用期間中**: 「無料試用期間」と表示され、残りクレジット額が表示される
   - **有料アカウント**: 「アクティブ」と表示され、支払い方法が設定されている
   - **課金停止中**: 「課金が無効」と表示される

#### 詳細な確認手順

```bash
# gcloud CLIでの確認
gcloud billing accounts list

# プロジェクトの課金情報確認
gcloud billing projects describe YOUR_PROJECT_ID
```

#### 課金アカウントの状態の種類

| 状態               | 説明                                   | 利用可能サービス     |
| ------------------ | -------------------------------------- | -------------------- |
| **無料試用期間**   | 300 ドルのクレジットが付与された状態   | 全サービス（制限内） |
| **有料アカウント** | クレジットカードが登録され、課金が有効 | 全サービス           |
| **無料利用枠のみ** | クレジットカード未登録                 | 無料利用枠のみ       |

#### 企業利用での推奨設定

- ✅ **有料アカウントの設定**: 企業での継続利用には必須
- ✅ **課金アラートの設定**: 予算超過防止のため
- ✅ **支払い方法の設定**: 法人カードまたは銀行振込
- ✅ **組織の設定**: 複数ユーザーでの管理

#### 無料試用期間から有料プランへの移行

1. Google Cloud Console の「課金」セクションにアクセス
2. 「無料試用期間を終了」または「アップグレード」をクリック
3. 支払い方法を設定（クレジットカード、銀行振込等）
4. 課金アカウントの有効化を確認

#### 重要な注意事項

- **無料試用期間中でも有料サービスの利用が可能**
- **無料試用期間終了後は手動で有料プランに移行が必要**
- **有料プランでないと一部の企業向け機能が制限される**
- **Vertex AI の利用には有料プランが実質的に必要**

## ステップ 2: Google Cloud CLI (gcloud) のインストール

### 2.1 gcloud CLI のインストール

Google Cloud CLI は、Google Cloud サービスを管理するためのコマンドラインツールです。

#### macOS の場合

```bash
# Homebrewを使用してインストール
brew install google-cloud-sdk

# または、公式インストーラーを使用
curl https://sdk.cloud.google.com | bash
```

#### Windows の場合

1. [Google Cloud CLI インストーラー](https://cloud.google.com/sdk/docs/install-sdk#windows)をダウンロード
2. インストーラーを実行し、指示に従ってインストール

#### Linux の場合

```bash
# Debian/Ubuntu
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt-get update && sudo apt-get install google-cloud-cli

# CentOS/RHEL
sudo tee -a /etc/yum.repos.d/google-cloud-sdk.repo << EOM
[google-cloud-cli]
name=Google Cloud CLI
baseurl=https://packages.cloud.google.com/yum/repos/cloud-sdk-el8-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=0
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
       https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOM
sudo yum install google-cloud-cli
```

### 2.2 gcloud CLI の初期設定

```bash
# インストール後の初期化
gcloud init

# 認証設定
gcloud auth login

# デフォルトプロジェクトの設定
gcloud config set project YOUR_PROJECT_ID

# 設定の確認
gcloud config list
```

### 2.3 インストールの確認

```bash
# バージョン確認
gcloud version
Google Cloud SDK 529.0.0
bq 2.1.19
core 2025.06.27
gcloud-crc32c 1.0.0
gsutil 5.35
Updates are available for some Google Cloud CLI components.  To install them,
please run:
  $ gcloud components update

# 認証状態の確認
gcloud auth list

# 現在のプロジェクトの確認
gcloud config get-value project
```

## ステップ 3: Vertex AI API の有効化

### 2.1 API の有効化

1. Google Cloud Console で「API とサービス」→「ライブラリ」にアクセス
2. 以下の API を検索し、有効化：
   - **Vertex AI API**
   - **AI Platform Training & Prediction API**
   - **Cloud Resource Manager API**

### 2.2 有効化の確認

```bash
# Google Cloud CLIでの確認
gcloud services list --enabled --filter="name:aiplatform.googleapis.com"

NAME                       TITLE
aiplatform.googleapis.com  Vertex AI API
```

## ステップ 3: 認証設定

### 3.1 サービスアカウントの作成

1. Google Cloud Console で「IAM と管理」→「サービスアカウント」にアクセス
2. 「サービスアカウントを作成」をクリック
3. 基本設定：
   - サービスアカウント名: `gemini-api-service`
   - 説明: `Gemini API access for application`

### 3.2 権限の設定

サービスアカウントに以下の権限を付与：

- **Vertex AI ユーザー** (`roles/aiplatform.user`)
- **サービス アカウント トークン 作成者** (`roles/iam.serviceAccountTokenCreator`)

### 3.3 認証キーの生成

1. 作成したサービスアカウントの詳細ページにアクセス
2. 「キー」タブで「キーを追加」→「新しいキーを作成」
3. キータイプ: **JSON**
4. 生成された JSON ファイルをダウンロード
5. 安全な場所に保存（例：`~/.gcp/gemini-api-service-key.json`）

### 3.4 環境変数の設定

#### 環境変数ファイルの作成

1. **`.env.sample`をコピーして`.env`ファイルを作成：**

   ```bash
   # プロジェクトルートで実行
   cp .env.sample .env
   ```

2. **`.env`ファイルを編集して実際の値を設定：**

   ```bash
   # Google Cloud 認証情報
   GOOGLE_APPLICATION_CREDENTIALS="/Users/username/.gcp/gemini-api-service-key.json"

   # Google Cloud プロジェクトID
   GOOGLE_CLOUD_PROJECT="gemini-api-service-466014"

   # Google Cloud リージョン
   GOOGLE_CLOUD_LOCATION="us-central1"
   ```

**重要**: `.env`ファイルには機密情報が含まれるため、Git リポジトリにコミットしないでください。既に`.gitignore`で除外設定済みです。

## ステップ 4: Node.js SDK のインストール

### 4.1 プロジェクトの初期化

```bash
# 新しいプロジェクトディレクトリを作成
mkdir gemini-vertex-ai-project
cd gemini-vertex-ai-project

# package.jsonの初期化
npm init -y
  :
{
  "name": "googlecli-hands-on",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "directories": {
    "doc": "docs"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### 4.2 必要なパッケージのインストール

```bash
npm install -g npm@latest

npm -v
11.4.2

# 推奨: 安定版 Vertex AI SDK（企業利用向け）
npm install @google-cloud/vertexai

# 環境変数管理用
npm install dotenv

# 実験的プレビュー版（認証問題の報告あり）
# npm install @google/genai
# npm install google-auth-library
```

### 4.3 TypeScript サポート（推奨）

```bash
# TypeScript関連パッケージのインストール
npm install -D typescript @types/node ts-node

# tsconfig.jsonの生成
npx tsc --init
Created a new tsconfig.json with:
                                                                                            TS
  target: es2016
  module: commonjs
  strict: true
  esModuleInterop: true
  skipLibCheck: true
  forceConsistentCasingInFileNames: true


You can learn more at https://aka.ms/tsconfig
```

## ステップ 5: 基本的な実装

### 5.1 環境変数ファイルの作成

`.env`ファイルを作成：

```env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
```

### 5.2 TypeScript 版の実装例

`index.ts`ファイルの作成：

```typescript
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

// 環境変数の読み込み
dotenv.config();

// Vertex AIを使用するための環境変数設定
process.env.GOOGLE_GENAI_USE_VERTEXAI = "true";

interface VertexAIConfig {
  project: string;
  location: string;
}

class GeminiVertexAIClient {
  private config: VertexAIConfig;
  private genAI: GoogleGenAI;

  constructor() {
    this.config = {
      project: process.env.GOOGLE_CLOUD_PROJECT || "",
      location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
    };

    // Google Gen AIの初期化（Vertex AI用）
    this.genAI = new GoogleGenAI({
      project: this.config.project,
      location: this.config.location,
    });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const chat = this.genAI.chats.create({
        model: "gemini-2.5-pro",
      });

      const result = await chat.sendMessage({
        message: prompt,
      });

      return (
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response generated"
      );
    } catch (error) {
      console.error("Content generation error:", error);
      throw error;
    }
  }

  async streamGenerateContent(prompt: string): Promise<void> {
    try {
      const chat = this.genAI.chats.create({
        model: "gemini-2.5-pro",
      });

      const result = await chat.sendMessageStream({
        message: prompt,
      });

      for await (const chunk of result) {
        const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          process.stdout.write(text);
        }
      }
    } catch (error) {
      console.error("Stream generation error:", error);
      throw error;
    }
  }
}

// 使用例
async function main(): Promise<void> {
  try {
    const client = new GeminiVertexAIClient();

    // テキスト生成
    const prompt = "企業でのAI活用について、簡潔に説明してください。";
    const response = await client.generateContent(prompt);
    console.log("Response:", response);

    // ストリーミング生成
    console.log("\nStreaming response:");
    await client.streamGenerateContent(prompt);
  } catch (error) {
    console.error("Main execution error:", error);
  }
}

// 実行
main();
```

## ステップ 6: 実行とテスト

### 6.1 実行権限の確認

```bash
# 認証情報の確認
gcloud auth application-default print-access-token

# プロジェクトの確認
gcloud config get-value project
```

### 6.2 アプリケーションの実行

```bash
npm install @google-cloud/vertexai
```

```bash
# TypeScriptの場合
npx ts-node index.ts
```

### 6.3 期待される出力

```
Generated content: こんにちは！天気予報については、私はリアルタイムの天気情報にアクセスできませんが...
Response: こんにちは！天気予報については、私はリアルタイムの天気情報にアクセスできませんが...
```

## ステップ 7: 高度な機能の実装

### 7.1 マルチモーダル機能

```javascript
// 画像とテキストの組み合わせ
async function analyzeImageWithText(imageBuffer, textPrompt) {
  const model = await initializeVertexAI();

  const image = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType: "image/jpeg",
    },
  };

  const result = await model.generateContent([textPrompt, image]);
  return result.response.text();
}
```

### 7.2 関数呼び出し機能

```javascript
// 関数定義
const weatherFunction = {
  name: "get_weather",
  description: "指定した都市の天気情報を取得",
  parameters: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "都市名",
      },
    },
    required: ["city"],
  },
};

// 関数呼び出し対応のモデル取得
const model = vertexAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  tools: [{ functionDeclarations: [weatherFunction] }],
});
```

## ステップ 8: セキュリティとベストプラクティス

### 8.1 認証情報の管理

```bash
# 本番環境では環境変数を使用
export GOOGLE_APPLICATION_CREDENTIALS="/secure/path/to/service-account.json"

# 開発環境では.envファイルを使用（.gitignoreに追加）
echo ".env" >> .gitignore
echo "*.json" >> .gitignore
```

### 8.2 エラーハンドリング

```javascript
// 堅牢なエラーハンドリング
async function safeGenerateContent(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await generateContent(prompt);
    } catch (error) {
      if (i === retries - 1) throw error;

      // 指数バックオフ
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### 8.3 レート制限対応

```javascript
// レート制限を考慮した実装
class RateLimitedClient {
  constructor(requestsPerMinute = 60) {
    this.requestsPerMinute = requestsPerMinute;
    this.requests = [];
  }

  async throttledRequest(requestFunction) {
    const now = Date.now();
    const minute = 60 * 1000;

    // 1分前より古いリクエストを削除
    this.requests = this.requests.filter((time) => now - time < minute);

    if (this.requests.length >= this.requestsPerMinute) {
      const waitTime = minute - (now - this.requests[0]);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.requests.push(now);
    return await requestFunction();
  }
}
```

## ステップ 9: 監視と運用

### 9.1 ログ設定

```javascript
// Google Cloud Loggingの設定
const { Logging } = require("@google-cloud/logging");

const logging = new Logging({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
});

const log = logging.log("gemini-api-log");

// 使用量のログ記録
async function logUsage(prompt, response, metadata) {
  const logEntry = log.entry({
    timestamp: new Date(),
    prompt_length: prompt.length,
    response_length: response.length,
    ...metadata,
  });

  await log.write(logEntry);
}
```

### 9.2 コスト監視

```javascript
// 使用量追跡
class UsageTracker {
  constructor() {
    this.dailyUsage = {
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      date: new Date().toDateString(),
    };
  }

  trackRequest(inputTokens, outputTokens) {
    const today = new Date().toDateString();

    if (this.dailyUsage.date !== today) {
      this.dailyUsage = {
        requests: 0,
        inputTokens: 0,
        outputTokens: 0,
        date: today,
      };
    }

    this.dailyUsage.requests++;
    this.dailyUsage.inputTokens += inputTokens;
    this.dailyUsage.outputTokens += outputTokens;
  }

  getDailyUsage() {
    return this.dailyUsage;
  }
}
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. 認証エラー

```
Error: Could not load the default credentials
```

**解決方法:**

- `GOOGLE_APPLICATION_CREDENTIALS`環境変数が正しく設定されているか確認
- サービスアカウントキーファイルのパスが正しいか確認
- サービスアカウントに適切な権限が付与されているか確認

#### 2. API が有効になっていない

```
Error: Vertex AI API has not been used before
```

**解決方法:**

- Google Cloud Console で Vertex AI API を有効化
- プロジェクト ID が正しいか確認

#### 3. 権限不足

#### 4. 無効なプロジェクト番号エラー

```
Error: Invalid project number: 104486568965153578347
```

**原因:**

- プロジェクト番号（数値）を使用しているが、プロジェクト ID（文字列）を使用する必要がある
- プロジェクト ID の形式が間違っている

**解決方法:**

1. **正しいプロジェクト ID の確認:**

   ```bash
   # 現在のプロジェクトIDを確認
   gcloud config get-value project

   # プロジェクト一覧を確認
   gcloud projects list
   ```

2. **プロジェクト ID の形式:**

   - 正しい形式: `my-project-id-123456` (文字列)
   - 間違った形式: `104486568965153578347` (数値)

3. **環境変数の修正:**

   ```bash
   # .envファイルで正しいプロジェクトIDを設定
   GOOGLE_CLOUD_PROJECT="your-correct-project-id"
   ```

4. **Google Cloud Console での確認:**
   - Google Cloud Console の上部でプロジェクト名をクリック
   - 表示される「プロジェクト ID」をコピー（「プロジェクト番号」ではない）

#### 5. @google/genai パッケージの TypeScript エラー

```
Property 'generateContent' does not exist on type 'Model'
```

**原因:**

- @google/genai パッケージの新しい API では、従来の API と異なる構造になっている

**解決方法:**

1. **正しい API 使用方法:**

   ```typescript
   // 正しい実装例
   import { GoogleGenAI } from "@google/genai";

   const genAI = new GoogleGenAI({
     project: process.env.GOOGLE_CLOUD_PROJECT,
     location: process.env.GOOGLE_CLOUD_LOCATION,
   });

   const chat = genAI.chats.create({
     model: "gemini-1.5-pro",
   });

   const result = await chat.sendMessage({
     message: prompt,
   });
   ```

#### 7. 課金が無効になっているエラー

```
Error: This API method requires billing to be enabled
```

**原因:**

- Google Cloud プロジェクトで課金が有効になっていない
- Vertex AI API は有料サービスのため、課金アカウントが必要

**解決方法:**

1. **課金の有効化:**

   - [Google Cloud Console の課金ページ](https://console.developers.google.com/billing/enable?project=gemini-api-service-466014)にアクセス
   - 課金アカウントを作成または既存のアカウントを選択
   - プロジェクトに課金アカウントを関連付け

2. **課金設定の確認:**

   ```bash
   # 課金が有効になっているか確認
   gcloud billing accounts list

   # プロジェクトと課金アカウントの関連付け確認
   gcloud billing projects list
   ```

3. **設定後の待機時間:**

   - 課金を有効にした後、5-10 分程度待機してから再試行
   - システムに設定が反映されるまで時間がかかる場合があります

4. **課金アラートの設定（推奨）:**
   - Google Cloud Console で予算アラートを設定
   - 意図しない高額請求を防ぐため

**注意事項:**

- Vertex AI API は使用量に応じて課金されます
- 開発・テスト時は適切な予算制限を設定してください
- 詳細な料金については[Vertex AI 料金ページ](https://cloud.google.com/vertex-ai/pricing)を参照

  ```

  ```

2. **パッケージの更新:**

   ```bash
   # パッケージを最新版に更新
   npm update @google/genai

   # 依存関係の再インストール
   rm -rf node_modules package-lock.json
   npm install
   ```

#### 6. 環境変数の設定エラー

```
Error: No such file or directory: /path/to/service-account-key.json
```

**解決方法:**

1. **サービスアカウントキーファイルのパスの確認:**

   ```bash
   # ファイルの存在確認
   ls -la ~/.gcp/gemini-api-service-key.json
   ```

2. **正しい.env ファイルの設定:**

   ```bash
   # .envファイルの形式（exportは不要）
   GOOGLE_APPLICATION_CREDENTIALS="/Users/username/.gcp/gemini-api-service-key.json"
   GOOGLE_CLOUD_PROJECT="your-project-id"
   GOOGLE_CLOUD_LOCATION="us-central1"
   ```

3. **権限の確認:**
   ```bash
   # ファイルの読み取り権限を確認
   chmod 600 ~/.gcp/gemini-api-service-key.json
   ```

```
Error: Permission denied
```

**解決方法:**

- サービスアカウントに`roles/aiplatform.user`権限を付与
- プロジェクトの課金が有効になっているか確認

#### 8. Vertex AI API 権限不足エラー

```
Error: Permission 'aiplatform.endpoints.predict' denied on resource
```

**解決方法:**

```bash
# 1. Vertex AI APIの有効化
gcloud services enable aiplatform.googleapis.com

# 2. サービスアカウントへの権限付与
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
  --role="roles/aiplatform.admin"

# 3. 課金アカウントの関連付け
gcloud billing projects link PROJECT_ID --billing-account=BILLING_ACCOUNT_ID
```

#### 9. 課金設定エラー

```
Error: This API method requires billing to be enabled
```

**解決方法:**

1. Google Cloud Console で課金アカウントを設定
2. コマンド: `gcloud billing projects link PROJECT_ID --billing-account=BILLING_ACCOUNT_ID`
3. 設定反映まで数分待機

#### 4. レート制限

```
Error: Quota exceeded
```

**解決方法:**

- リクエスト間隔を調整
- Google Cloud Console で Quota の確認・増加申請

#### 10. @google/genai パッケージの認証問題

```
Error: Request is missing required authentication credential
ApiError: {"error":{"code":401,"message":"Request is missing required authentication credential"}}
```

**原因:**

- @google/genai パッケージは実験的プレビュー段階で認証処理に問題がある
- サービスアカウント認証が正しく処理されない場合がある

**解決方法:**

1. **安定版パッケージへの切り替え（推奨）:**

   ```bash
   # @google/genai を削除
   npm uninstall @google/genai google-auth-library

   # 安定版をインストール
   npm install @google-cloud/vertexai
   ```

2. **コードの書き換え:**

   ```typescript
   // @google-cloud/vertexai を使用した実装
   import { VertexAI } from "@google-cloud/vertexai";

   const vertexAI = new VertexAI({
     project: process.env.GOOGLE_CLOUD_PROJECT,
     location: process.env.GOOGLE_CLOUD_LOCATION,
   });

   const model = vertexAI.getGenerativeModel({
     model: "gemini-2.5-pro",
   });
   ```

#### 11. TypeScript 設定ファイルエラー

```
Cannot read file 'tsconfig-google.json'
```

**原因:**

- @google-cloud/vertexai パッケージの内部依存関係（GTS）の設定ファイルが見つからない
- VS Code 表示上の問題で、実際のコード実行には影響しない

**解決方法:**

1. **tsconfig.json の設定追加:**

   ```json
   {
     "compilerOptions": {
       "skipLibCheck": true
     },
     "exclude": [
       "node_modules",
       "dist",
       "node_modules/@google-cloud/vertexai/node_modules",
       "**/node_modules/@google-cloud/vertexai/tsconfig.json"
     ]
   }
   ```

2. **エラーの無視:**
   - このエラーはコード実行に影響しないため、無視しても問題ありません
   - VS Code でのインテリセンス機能は正常に動作します

## 参考資料

- [Google Cloud Vertex AI 公式ドキュメント](https://cloud.google.com/vertex-ai/docs)
- [Gemini API リファレンス](https://ai.google.dev/gemini-api/docs)
- [Node.js SDK ドキュメント](https://cloud.google.com/nodejs/docs/reference/vertexai/latest)
- [Google Cloud 料金体系](https://cloud.google.com/vertex-ai/pricing)

## 料金情報

### Vertex AI での Gemini API 料金（2025 年 7 月現在）

#### 最新の Gemini 2.5 シリーズ（推奨）

| モデル               | 入力トークン      | 出力トークン      |
| -------------------- | ----------------- | ----------------- |
| **Gemini 2.5 Pro**   | $1.25 / 1M tokens | $10 / 1M tokens   |
| **Gemini 2.5 Flash** | $0.15 / 1M tokens | $0.60 / 1M tokens |

#### Gemini 2.0 シリーズ（マルチモーダル対応）

| モデル                    | 入力トークン       | 出力トークン      |
| ------------------------- | ------------------ | ----------------- |
| **Gemini 2.0 Flash**      | $0.15 / 1M tokens  | $0.60 / 1M tokens |
| **Gemini 2.0 Flash Lite** | $0.075 / 1M tokens | $0.30 / 1M tokens |

#### 従来の Gemini 1.5 シリーズ

| モデル               | 入力トークン         | 出力トークン       |
| -------------------- | -------------------- | ------------------ |
| **Gemini 1.5 Pro**   | $0.3125 / 1K tokens  | $1.25 / 1K tokens  |
| **Gemini 1.5 Flash** | $0.01875 / 1K tokens | $0.075 / 1K tokens |

#### 主な変更点と特徴

- **新モデル**: Gemini 2.5 Pro/Flash が最新の推奨モデル
- **価格体系**: 2.5 シリーズは 100 万トークン単位、従来モデルは 1,000 トークン単位で課金
- **マルチモーダル**: 2.0 シリーズは音声、動画、画像に対応
- **バッチ処理**: バッチ API を使用すると 50%割引が適用
- **コンテキストキャッシュ**: 長いコンテキストのキャッシュ機能で 75%のコスト削減が可能

※料金は米ドル表記です。最新の料金や詳細は[Vertex AI 公式価格ページ](https://cloud.google.com/vertex-ai/generative-ai/pricing)でご確認ください。

## まとめ

この手順書に従うことで、企業環境でのセキュアな Gemini API 利用が可能になります。Vertex AI を利用することで、Google AI Studio よりも高いセキュリティレベルとエンタープライズ機能を活用できます。

### 重要なポイント

1. **データセキュリティ**: Vertex AI ではデータがモデル学習に使用されません
2. **エンタープライズ機能**: 高度な認証・認可機能が利用可能
3. **スケーラビリティ**: 大規模運用に対応した機能とサポート
4. **コスト管理**: 詳細な使用量監視とコスト制御が可能

定期的な監視とメンテナンスにより、安定した AI 機能の運用を実現できます。
