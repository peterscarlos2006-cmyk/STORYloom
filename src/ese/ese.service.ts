import { Injectable } from '@nestjs/common';

@Injectable()
export class EseService {
  private emotionKeywords = {
    joy: ['happy', 'joy', 'excited', 'pleased', 'delighted'],
    sadness: ['sad', 'unhappy', 'miserable', 'depressed', 'heartbroken'],
    anger: ['angry', 'furious', 'enraged', 'irritated', 'annoyed'],
    fear: ['fear', 'scared', 'terrified', 'anxious', 'worried'],
    surprise: ['surprise', 'amazed', 'astonished', 'shocked'],
    disgust: ['disgust', 'revolted', 'sickened', 'appalled'],
    hope: ['hope', 'optimistic', 'encouraged', 'positive'],
    love: ['love', 'adore', 'cherish', 'affection'],
    regret: ['regret', 'sorry', 'remorse', 'apologize'],
    determination: ['determination', 'resolved', 'steadfast', 'unwavering'],
  };

  async analyze(text: string): Promise<any> {
    const emotions = {};
    let totalEmotionWords = 0;

    for (const emotion in this.emotionKeywords) {
      emotions[emotion] = 0;
      for (const keyword of this.emotionKeywords[emotion]) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          emotions[emotion] += matches.length;
          totalEmotionWords += matches.length;
        }
      }
    }

    let intensity = 0;
    if (totalEmotionWords > 0) {
      intensity = Math.min(1, totalEmotionWords / 10); // Cap intensity at 1
    }

    return {
      emotions,
      intensity,
    };
  }
}
