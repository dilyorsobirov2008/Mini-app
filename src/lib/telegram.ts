import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN!;
let bot: TelegramBot | null = null;

export const getBot = () => {
  if (!bot && typeof window === 'undefined') {
    if (!token) {
      console.error('TELEGRAM_BOT_TOKEN is not set!');
      return null;
    }
    bot = new TelegramBot(token);

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      bot?.sendMessage(chatId, 'Assalomu alaykum! Bozorcha botiga xush kelibsiz. \n\nPastdagi tugmani bosib do\'konimizga kiring:', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🛍 Do\'konni ochish',
                web_app: { url: process.env.NEXT_PUBLIC_APP_URL! }
              }
            ]
          ]
        }
      });
    });
  }

  return bot;
};

interface OrderItem {
  name: string;
  quantity: number;
}

interface OrderDetails {
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
}

export const sendOrderNotification = async (adminChatId: string, orderDetails: OrderDetails) => {
  const message = `📦 Yangi buyurtma!\n\n` +
    `👤 Mijoz: ${orderDetails.customerName}\n` +
    `📞 Tel: ${orderDetails.customerPhone}\n` +
    `📍 Manzil: ${orderDetails.address}\n\n` +
    `🛍 Mahsulotlar:\n${orderDetails.items.map((item: any) => `- ${item.name} x ${item.quantity}`).join('\n')}\n\n` +
    `💰 Jami: ${orderDetails.totalAmount} so'm`;

  await getBot()?.sendMessage(adminChatId, message);
};
