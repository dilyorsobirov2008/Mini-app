import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN || '8642489665:AAGDp8DyCK2DCitVDUC8dNYdYWBRffZKg7E';
let bot: TelegramBot | null = null;

export const getBot = () => {
  if (!bot && typeof window === 'undefined') {
    bot = new TelegramBot(token, { polling: true });

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      bot?.sendMessage(chatId, 'Assalomu alaykum! Bozorcha botiga xush kelibsiz. \n\nPastdagi tugmani bosib do\'konimizga kiring:', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🛍 Do\'konni ochish',
                web_app: { url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com' }
              }
            ]
          ]
        }
      });
    });
  }
  return bot;
};

export const sendOrderNotification = async (adminChatId: string, orderDetails: any) => {
  const message = `📦 Yangi buyurtma!\n\n` +
    `👤 Mijoz: ${orderDetails.customerName}\n` +
    `📞 Tel: ${orderDetails.customerPhone}\n` +
    `📍 Manzil: ${orderDetails.address}\n\n` +
    `🛍 Mahsulotlar:\n${orderDetails.items.map((item: any) => `- ${item.name} x ${item.quantity}`).join('\n')}\n\n` +
    `💰 Jami: ${orderDetails.totalAmount} so'm`;

  await getBot()?.sendMessage(adminChatId, message);
};
