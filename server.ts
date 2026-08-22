import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Route: AI Caption & Content Generator for Fashion Wholesale
  app.post("/api/generate-caption", async (req, res) => {
    try {
      const { productName, fabricType, packSize, colors, pricePerPack, channel, targetAudience } = req.body;
      const ai = getGeminiAI();

      if (ai) {
        const prompt = `شما کارشناس بازاریابی و تولید محتوای عمده‌فروشی پوشاک زنانه در بازار بزرگ تهران هستید.
برای محصول زیر یک کپشن بسیار حرفه‌ای، جذاب، خوش‌فروش و ترغیب‌کننده برای کانال ${channel || 'تلگرام'} و خریداران عمده (مغازه‌داران شهرستان و آنلاین‌شاپ‌ها) بنویسید:
- نام کالا: ${productName || 'شلوار راحتی زنانه'}
- جنس پارچه: ${fabricType || 'پنبه سوپر'}
- تعداد در هر پک: ${packSize || 6} عددی
- رنگ‌بندی: ${colors || 'کاربردی و ترند'}
- قیمت عمده هر پک: ${pricePerPack ? Number(pricePerPack).toLocaleString('fa-IR') + ' تومان' : 'استعلام در پیوی'}
- نوع مخاطب: ${targetAudience || 'مغازه‌دار و آنلاین‌شاپ'}

فرمت خروجی باید شامل:
۱. عنوان جذاب با ایموجی‌های متناسب بازار پوشاک
۲. مشخصات فنی دقیق (جنس، تنخور، سایز، تعداد در جین/پک)
۳. مزیت رقابتی و سودآوری برای مغازه‌دار
۴. شرایط ارسال (تیپاکس، باربری وطن) و ثبت سفارش
۵. هشتگ‌های ترند و مرتبط عمده‌فروشی پوشاک (#عمده_فروشی #شلوار_زنانه #بازار_بزرگ_تهران و...)
کپشن کاملاً به زبان فارسی، روان و مناسب بازار پوشاک تهران باشد.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const generatedText = response.text || "";
        return res.json({ success: true, caption: generatedText });
      } else {
        // High quality server fallback template if key not yet provided
        const fallbackCaption = `🌸 حراج ویژه عمده‌فروشی بازار بزرگ تهران 🌸

✨ نام مدل: ${productName || 'شلوار زنانه شیک'}
🧵 جنس پارچه: ${fabricType || 'داکرون درجه یک اعلا'}
📦 بسته‌بندی: پک‌های ${packSize || 6} عددی (جور رنگ)
📐 سایزبندی: فری‌سایز مناسب ۳۸ تا ۴۶
🎨 رنگ‌بندی: ${colors || '۶ رنگ جذاب و پرفروش'}

💰 قیمت همکاری هر پک: ${pricePerPack ? Number(pricePerPack).toLocaleString('fa-IR') + ' تومان' : 'تماس/پیوی'}
🔥 حاشیه سود عالی برای مغازه‌داران و آنلاین‌شاپ‌ها! تنخور ژورنالی و ضمانت دوخت تمیز.

🚚 ارسال سریع به سراسر ایران:
🔹 باربری وطن و پیام‌گیر (میدان شوش)
🔹 تیپاکس و چاپار تحویل ۲۴ ساعته

✍️ جهت ثبت سفارش و فاکتور فوری در پیوی پیام دهید:
🆔 @bazar_poshak_admin
📞 09121234567

#عمده_فروشی_پوشاک #پوشاک_زنانه #بازار_تهران #شلوار_زنانه #پخش_عمده #تولیدی_پوشاک`;

        return res.json({ success: true, caption: fallbackCaption });
      }
    } catch (error: any) {
      console.error("Caption generation error:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to generate caption" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bazar Wholesale ERP running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
