export const fluxService = {
  async removeBackground(imageUrl: string) {
    return await this.processImage(imageUrl, 'remove-bg');
  },

  async enhanceImage(imageUrl: string) {
    return await this.processImage(imageUrl, 'enhance');
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

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Processing failed');
      }

      const outputUrl = data.output;
      if (!outputUrl || typeof outputUrl !== 'string') {
        throw new Error('Invalid output URL received');
      }

      return outputUrl;
    } catch (error) {
      console.error(`${style} error:`, error);
      throw error;
    }
  }
}; 