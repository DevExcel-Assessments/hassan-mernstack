import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

class VideoCompression {
  constructor() {
    this.compressionPresets = {
      low: {
        resolution: '640x360',
        bitrate: '500k',
        audioBitrate: '64k',
        fps: 24,
        quality: 'low'
      },
      medium: {
        resolution: '1280x720',
        bitrate: '1500k',
        audioBitrate: '128k',
        fps: 30,
        quality: 'medium'
      },
      high: {
        resolution: '1920x1080',
        bitrate: '3000k',
        audioBitrate: '192k',
        fps: 30,
        quality: 'high'
      }
    };
  }



  async compressVideo(inputPath, outputPath, quality = 'medium') {
    try {
      const preset = this.compressionPresets[quality];
      if (!preset) {
        throw new Error(`Invalid quality preset: ${quality}`);
      }


      return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions([
            `-c:v libx264`,
            `-preset medium`,
            `-crf 23`,
            `-b:v ${preset.bitrate}`,
            `-maxrate ${preset.bitrate}`,
            `-bufsize ${parseInt(preset.bitrate) * 2}k`,
            `-vf scale=${preset.resolution}`,
            `-r ${preset.fps}`,
            `-c:a aac`,
            `-b:a ${preset.audioBitrate}`,
            `-movflags +faststart`,
            `-y`
          ])
          .output(outputPath)
          .on('start', (commandLine) => {
           
          })
          .on('progress', (progress) => {
           
          })
          .on('end', () => {
           
            resolve({
              success: true,
              outputPath,
              quality,
              preset
            });
          })
          .on('error', (err) => {
           
            reject(err);
          })
          .run();
      });
    } catch (error) {
     
      cons
    }
  }



  async createAdaptiveStream(inputPath, outputDir, filename) {
    try {
     

      const qualities = ['low', 'medium', 'high'];
      const outputs = [];

     
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

     
      for (const quality of qualities) {
        const preset = this.compressionPresets[quality];
        const outputPath = path.join(outputDir, `${filename}_${quality}.mp4`);
        
        await this.compressVideo(inputPath, outputPath, quality);
        outputs.push({
          quality,
          path: outputPath,
          preset
        });
      }

     
      const playlistPath = path.join(outputDir, `${filename}.m3u8`);
      await this.createHLSPlaylist(outputs, playlistPath);

      return {
        success: true,
        playlistPath,
        outputs,
        qualities
      };
    } catch (error) {
     
      cons
    }
  }

  async createHLSPlaylist(outputs, playlistPath) {
    try {
      let playlist = '#EXTM3U\n';
      playlist += '#EXT-X-VERSION:3\n\n';

      for (const output of outputs) {
        const { quality, path, preset } = output;
        const duration = await this.getVideoDuration(path);
        
        playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(preset.bitrate) * 1000},RESOLUTION=${preset.resolution}\n`;
        playlist += `${path.split('/').pop()}\n\n`;
      }

      await writeFile(playlistPath, playlist);
     
    } catch (error) {
     
      cons
    }
  }



  async getVideoInfo(inputPath) {
    try {
      return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(inputPath, (err, metadata) => {
          if (err) {
            reject(err);
          } else {
            resolve(metadata);
          }
        });
      });
    } catch (error) {
     
      cons
    }
  }

  async getVideoDuration(inputPath) {
    try {
      const metadata = await this.getVideoInfo(inputPath);
      return metadata.format.duration;
    } catch (error) {
     
      return 0;
    }
  }

  async generateThumbnail(inputPath, outputPath, time = '00:00:05') {
    try {
      return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .screenshots({
            timestamps: [time],
            filename: path.basename(outputPath),
            folder: path.dirname(outputPath),
            size: '320x240'
          })
          .on('end', () => {
           
            resolve({ success: true, outputPath });
          })
          .on('error', (err) => {
            
            reject(err);
          });
      });
    } catch (error) {
     
      console.error('Error generating thumbnail:', error);
    }
  }



  async compressVideoBatch(inputFiles, outputDir, quality = 'medium') {
    try {
     

      const results = [];
      for (const inputFile of inputFiles) {
        const filename = path.basename(inputFile, path.extname(inputFile));
        const outputPath = path.join(outputDir, `${filename}_compressed.mp4`);
        
        try {
          const result = await this.compressVideo(inputFile, outputPath, quality);
          results.push({
            input: inputFile,
            ...result
          });
        } catch (error) {
         
          results.push({
            input: inputFile,
            success: false,
            error: error.message
          });
        }
      }

      return {
        success: true,
        results,
        total: inputFiles.length,
        successful: results.filter(r => r.success).length
      };
    } catch (error) {
     
      cons
    }
  }

  

  getCompressionPresets() {
    return this.compressionPresets;
  }

  calculateFileSizeReduction(originalSize, compressedSize) {
    const reduction = ((originalSize - compressedSize) / originalSize) * 100;
    return Math.round(reduction * 100) / 100;
  }

  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  async cleanupTempFiles(files) {
    try {
      for (const file of files) {
        if (fs.existsSync(file)) {
          await unlink(file);
         
        }
      }
    } catch (error) {
      
    }
  }
}

export default new VideoCompression(); 