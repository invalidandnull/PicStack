export const fluxService = {
  async removeBackground(imageUrl: string) {
    return await this.processImage(imageUrl, 'remove-bg');
  },

  async enhanceImage(imageUrl: string) {
    return await this.processImage(imageUrl, 'enhance');
  },

  async changeStyle(imageUrl: string, style: string) {
    return await this.processImage(imageUrl, 'change-style');
  },

  async blurBackground(imageUrl: string) {
    return await this.processImage(imageUrl, 'blur-bg');
  },

  async restoreOldPhoto(imageUrl: string) {
    return await this.processImage(imageUrl, 'restore');
  },

  async processImage(imageUrl: string, style: string) {
    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl, style }),
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const data = await response.json();
      return data.output;
    } catch (error) {
      console.error(`${style} error:`, error);
      throw error;
    }
  }
}; 