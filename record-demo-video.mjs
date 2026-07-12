import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runDemoRecording() {
  console.log('🎬 Launching Playwright Chromium for Screen Recording...');

  const videoDir = path.join(__dirname, 'videos');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--window-size=1280,720'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  try {
    // ------------------------------------------------------------------
    // STEP 1: LOGIN
    // ------------------------------------------------------------------
    console.log('Step 1: Navigating to /login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    console.log('Filling email and password...');
    await page.fill('input[type="email"]', 'demo@resumerank.ai');
    await page.fill('input[type="password"]', 'demo123456');
    await page.waitForTimeout(1000);
    await page.click('button[type="submit"]');

    console.log('Waiting for Dashboard...');
    await page.waitForURL('**/dashboard**', { timeout: 25000 });
    console.log('Step 2: Landed on Dashboard Overview');
    await page.waitForTimeout(3000);

    // ------------------------------------------------------------------
    // STEP 2: ADD A JOB
    // ------------------------------------------------------------------
    console.log('Step 3: Navigating to Job Adding (/dashboard/jobs/create)...');
    await page.goto('http://localhost:3000/dashboard/jobs/create', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    console.log('Filling out new Job requisition form...');
    await page.fill('input[name="title"]', 'Staff Full Stack AI Engineer');
    await page.fill('input[name="location"]', 'San Francisco, CA (Hybrid)');
    await page.fill('input[name="department"]', 'Engineering & Applied AI');
    await page.fill('input[name="salary"]', '$180,000 - $220,000');
    await page.selectOption('select[name="experience"]', '5');
    await page.fill('textarea[name="description"]', 'Lead our core frontend and real-time AI resume ranking architecture. Responsible for React 19 Server Components, Gemini integrations, and automated applicant evaluation pipelines.');
    await page.fill('input[name="skills"]', 'React 19, Next.js App Router, TypeScript, Google Gemini AI, PostgreSQL, Prisma');

    await page.waitForTimeout(1500);
    console.log('Submitting new job...');
    const submitJobBtn = page.locator('button[type="submit"]');
    await submitJobBtn.click();

    await page.waitForTimeout(3500);

    // ------------------------------------------------------------------
    // STEP 3: ADD CANDIDATE & RESUME SCREENING
    // ------------------------------------------------------------------
    console.log('Step 4: Navigating to Candidate Profile for Resume Screening...');
    await page.goto('http://localhost:3000/dashboard/candidates/cmrer71xf0007envwoyeiomtw', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Upload sample resume
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      console.log('Uploading sample resume file (sample_resume.txt)...');
      const sampleResumePath = path.join(__dirname, 'public', 'sample_resume.txt');
      await fileInput.setInputFiles(sampleResumePath);
      await page.waitForTimeout(5000);
    }

    // Trigger AI Analyze Resume if visible
    const aiAnalyzeBtn = page.locator('button:has-text("AI Analyze Resume")');
    if (await aiAnalyzeBtn.isVisible()) {
      console.log('Sparking AI Match Evaluation...');
      await aiAnalyzeBtn.click();
      await page.waitForTimeout(7000);
    }

    // ------------------------------------------------------------------
    // STEP 4: AI RESUME LEADERBOARD
    // ------------------------------------------------------------------
    console.log('Step 5: Navigating to AI Leaderboard Engine (/dashboard/resumes)...');
    await page.goto('http://localhost:3000/dashboard/resumes', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);

    // ------------------------------------------------------------------
    // STEP 5: HIRING ANALYTICS DASHBOARD
    // ------------------------------------------------------------------
    console.log('Step 6: Navigating to Analytics (/dashboard/analytics)...');
    await page.goto('http://localhost:3000/dashboard/analytics', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);

    console.log('✅ End-to-end walkthrough completed successfully!');
  } catch (err) {
    console.error('Error during recording:', err);
  } finally {
    const videoPath = await page.video()?.path();
    await page.close();
    await context.close();
    await browser.close();

    if (videoPath && fs.existsSync(videoPath)) {
      const targetRootPath = path.join(__dirname, 'ResumeRank_AI_Full_Demo_Video.webm');
      const targetPublicPath = path.join(__dirname, 'public', 'ResumeRank_AI_Full_Demo_Video.webm');

      fs.copyFileSync(videoPath, targetRootPath);
      fs.copyFileSync(videoPath, targetPublicPath);

      console.log('\n🎉 SCREEN RECORDING VIDEO SAVED SUCCESSFULLY:');
      console.log('1. Root folder: ' + targetRootPath);
      console.log('2. Public URL:  http://localhost:3000/ResumeRank_AI_Full_Demo_Video.webm');
    }
  }
}

runDemoRecording();
