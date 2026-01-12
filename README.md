
# World ID Verification Platform

A bilingual (English/Spanish) platform that helps users verify their humanity with World ID and access Worldcoin benefits.

## Features

- 🌍 **Bilingual Support**: Full Spanish and English translations
- 🔐 **World ID Integration**: Secure verification using World ID protocol
- 📊 **Owner Dashboard**: Track verifications, revenue, and conversion rates
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔗 **Referral System**: Track users through custom referral codes
- 💰 **Revenue Tracking**: Monitor your earnings from verifications

## Quick Start

### Prerequisites

- World ID Developer Portal account
- App ID and Action from World ID

### Environment Variables

Set these in your v0 project (Vars section):

\`\`\`env
NEXT_PUBLIC_WORLDCOIN_APP_ID=your_app_id_here
NEXT_PUBLIC_WORLDCOIN_ACTION=verify-for-benefits
\`\`\`

### Installation

1. Clone or download this project
2. Configure environment variables in v0
3. Deploy to Vercel
4. Share your referral link

## Usage

### For End Users

Visit your deployed app to:
1. Switch between English/Spanish
2. Verify with World ID
3. Access Worldcoin benefits

### For Owners

Access dashboard with: `?ref=owner-dashboard-2025`

View metrics:
- Total verifications
- Estimated revenue
- Conversion rates
- Average per user

### Referral Tracking

Share links with custom codes: `?ref=your-custom-code`

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Verification**: World ID IDKit
- **Analytics**: Vercel Analytics
- **Language**: TypeScript

## Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Detailed configuration instructions
- [World ID Docs](https://docs.world.org/world-id) - Official World ID documentation

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Check the setup guide
- Review World ID documentation
- Open an issue on GitHub
- Contact Vercel support

---

Built with ❤️ using v0.app
