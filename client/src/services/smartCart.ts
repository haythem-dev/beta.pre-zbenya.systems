
interface CartItem {
  id: string;
  quantity: number;
}

interface ProductSuggestion {
  id: string;
  title: string;
  price: number;
  reason: string;
}

class SmartCartService {
  private cartItems: CartItem[] = [];
  private lastActivity: Date | null = null;

  addToCart(productId: string, quantity: number = 1) {
    this.cartItems.push({ id: productId, quantity });
    this.lastActivity = new Date();
    this.saveCart();
    this.trackCartActivity();
  }

  async getSuggestions(): Promise<ProductSuggestion[]> {
    try {
      const response = await fetch('/api/cart/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: this.cartItems })
      });
      return response.json();
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }

  private trackCartActivity() {
    const abandonmentThreshold = 1000 * 60 * 30; // 30 minutes
    
    if (this.lastActivity) {
      const timeSinceActivity = Date.now() - this.lastActivity.getTime();
      
      if (timeSinceActivity > abandonmentThreshold && this.cartItems.length > 0) {
        this.sendAbandonmentReminder();
      }
    }
  }

  private async sendAbandonmentReminder() {
    try {
      await fetch('/api/cart/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: this.cartItems })
      });
    } catch (error) {
      console.error('Failed to send cart reminder:', error);
    }
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify({
      items: this.cartItems,
      lastActivity: this.lastActivity
    }));
  }
}

export const smartCart = new SmartCartService();
