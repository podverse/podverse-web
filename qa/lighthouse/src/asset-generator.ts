import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execAsync = promisify(exec);

export class AssetGenerator {
  private assetsDir: string;

  constructor() {
    // Assets directory is qa/lighthouse/assets/
    this.assetsDir = path.join(__dirname, '../assets');
  }

  async ensureAssetsDirectory(): Promise<void> {
    if (!fs.existsSync(this.assetsDir)) {
      fs.mkdirSync(this.assetsDir, { recursive: true });
    }
  }

  async generateImage(filename: string, backgroundColor: string = '#FF0000'): Promise<void> {
    const filePath = path.join(this.assetsDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      return;
    }

    try {
      // Import ffmpeg-static dynamically
      const ffmpegStatic = await import('ffmpeg-static').catch((err) => {
        throw new Error(`Failed to import ffmpeg-static. Make sure to run 'npm install' first. Error: ${err instanceof Error ? err.message : String(err)}`);
      });
      const ffmpegPath = ffmpegStatic.default;
      
      if (!ffmpegPath) {
        throw new Error('ffmpeg-static binary not found. Make sure ffmpeg-static is installed.');
      }

      // Generate a colored image using ffmpeg
      // Using color filter to create a solid color image (800x800 pixels, typical for podcast/album art)
      // FFmpeg expects hex color without # symbol
      const hexColor = backgroundColor.replace('#', '');
      const command = `"${ffmpegPath}" -f lavfi -i color=c=${hexColor}:s=800x800:d=1 -frames:v 1 -pix_fmt yuvj420p -y "${filePath}"`;
      
      await execAsync(command);
      console.log(`   ✅ Generated: ${filename} (color: ${backgroundColor})`);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate image file ${filename}: ${errorMessage}`);
    }
  }

  async generateMP3(filename: string, durationSeconds: number = 300): Promise<void> {
    const filePath = path.join(this.assetsDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      return;
    }

    try {
      // Import ffmpeg-static dynamically
      const ffmpegStatic = await import('ffmpeg-static').catch((err) => {
        throw new Error(`Failed to import ffmpeg-static. Make sure to run 'npm install' first. Error: ${err instanceof Error ? err.message : String(err)}`);
      });
      const ffmpegPath = ffmpegStatic.default;
      
      if (!ffmpegPath) {
        throw new Error('ffmpeg-static binary not found. Make sure ffmpeg-static is installed.');
      }

      // Generate 5 minutes of silence as MP3
      // Using anullsrc (null audio source) with libmp3lame encoder
      const command = `"${ffmpegPath}" -f lavfi -i anullsrc=r=44100:cl=stereo -t ${durationSeconds} -acodec libmp3lame -b:a 128k -y "${filePath}"`;
      
      await execAsync(command);
      console.log(`   ✅ Generated: ${filename} (${durationSeconds}s)`);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate MP3 file ${filename}: ${errorMessage}`);
    }
  }

  async generateMP4(filename: string, durationSeconds: number = 300): Promise<void> {
    const filePath = path.join(this.assetsDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      return;
    }

    try {
      // Import ffmpeg-static dynamically
      const ffmpegStatic = await import('ffmpeg-static').catch((err) => {
        throw new Error(`Failed to import ffmpeg-static. Make sure to run 'npm install' first. Error: ${err instanceof Error ? err.message : String(err)}`);
      });
      const ffmpegPath = ffmpegStatic.default;
      
      if (!ffmpegPath) {
        throw new Error('ffmpeg-static binary not found. Make sure ffmpeg-static is installed.');
      }

      // Generate 5 minutes of minimal video (color test pattern with silent audio)
      // Using testsrc2 for video and anullsrc for audio
      const command = `"${ffmpegPath}" -f lavfi -i testsrc2=duration=${durationSeconds}:size=320x240:rate=1 -f lavfi -i anullsrc=r=44100:cl=stereo -c:v libx264 -preset ultrafast -crf 28 -c:a aac -b:a 128k -t ${durationSeconds} -y "${filePath}"`;
      
      await execAsync(command);
      console.log(`   ✅ Generated: ${filename} (${durationSeconds}s)`);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate MP4 file ${filename}: ${errorMessage}`);
    }
  }

  async generateAllAssets(): Promise<void> {
    await this.ensureAssetsDirectory();

    console.log('🎨 Generating test assets...\n');

    // Generate channel images with different colors
    console.log('   → Generating channel images...');
    await this.generateImage('chan-1-image.jpg', '#FF6B6B'); // Red
    await this.generateImage('chan-2-image.jpg', '#4ECDC4'); // Teal
    await this.generateImage('chan-3-image.jpg', '#45B7D1'); // Blue

    // Generate item images with different colors
    console.log('   → Generating item images...');
    await this.generateImage('item-1-image.jpg', '#96CEB4'); // Green
    await this.generateImage('item-2-image.jpg', '#FFEAA7'); // Yellow
    await this.generateImage('item-3-image.jpg', '#DDA0DD'); // Plum

    // Generate media files (5 minutes each = 300 seconds)
    console.log('   → Generating media files (5 minutes each)...');
    await this.generateMP3('item-1-podcast.mp3', 300);
    await this.generateMP4('item-2-video.mp4', 300);
    await this.generateMP3('item-3-music.mp3', 300);

    console.log('   ✅ All assets generated\n');
  }
}
