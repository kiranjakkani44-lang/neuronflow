import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const agentsData = [
  {
    slug: 'ai-voice-inbound',
    name: 'AI Voice Agent (Inbound)',
    category: 'VOICE',
    price_one_time: 45000,
    roi_promise: 'Never miss an inbound call again, 24/7',
    setup_time_days: 7,
    industries: JSON.stringify(['real-estate', 'clinics', 'legal', 'coaching']),
    features: JSON.stringify([
      { title: '24/7 Call Handling', desc: 'AI answers every call instantly' },
      { title: 'Lead Qualification', desc: 'Qualifies leads with smart questions' },
      { title: 'CRM Integration', desc: 'Pushes qualified leads to your CRM' },
      { title: 'Call Recording', desc: 'Every conversation recorded and transcribed' }
    ]),
    is_featured: true,
    sort_order: 1,
    short_description: '24/7 inbound AI voice reception and qualification.',
    description: 'An intelligent voice agent that answers every inbound call, qualifies leads based on your specific criteria, and seamlessly transfers them to your sales team or CRM.',
    icon_name: 'PhoneIncoming'
  },
  {
    slug: 'ai-voice-outbound',
    name: 'AI Voice Agent (Outbound)',
    category: 'VOICE',
    price_one_time: 55000,
    roi_promise: 'Call 500 leads per day without a sales team',
    setup_time_days: 7,
    industries: JSON.stringify(['real-estate', 'ecommerce', 'd2c', 'coaching']),
    features: JSON.stringify([
      { title: 'Automated Dialing', desc: 'Calls lists of leads automatically' },
      { title: 'Natural Conversations', desc: 'Human-like voice interactions' },
      { title: 'Objection Handling', desc: 'Smart responses to common objections' },
      { title: 'Appointment Setting', desc: 'Books meetings directly on your calendar' }
    ]),
    is_featured: false,
    sort_order: 2,
    short_description: 'Automate your outbound sales and lead generation.',
    description: 'Scale your sales outreach infinitely. This agent calls hundreds of leads daily, engages in natural conversations, and sets appointments for your human closers.',
    icon_name: 'PhoneOutgoing'
  },
  {
    slug: 'whatsapp-automation',
    name: 'WhatsApp Automation Agent',
    category: 'WHATSAPP',
    price_one_time: 35000,
    roi_promise: 'Reply to every customer in under 60 seconds',
    setup_time_days: 5,
    industries: JSON.stringify(['ecommerce', 'clinics', 'd2c', 'real-estate']),
    features: JSON.stringify([
      { title: 'Instant Replies', desc: 'Answers FAQs automatically' },
      { title: 'Rich Media', desc: 'Sends images, documents, and videos' },
      { title: 'Order Tracking', desc: 'Automated updates for e-commerce' },
      { title: 'Human Handoff', desc: 'Seamlessly transfers complex queries to agents' }
    ]),
    is_featured: true,
    sort_order: 3,
    short_description: 'Instant, intelligent WhatsApp customer support.',
    description: 'Engage customers where they already are. Automate FAQs, provide order updates, and capture leads directly through WhatsApp with a 100% response rate.',
    icon_name: 'MessageCircle'
  },
  {
    slug: 'lead-qualification',
    name: 'AI Lead Qualification Agent',
    category: 'AUTOMATION',
    price_one_time: 40000,
    roi_promise: 'Only talk to leads ready to buy',
    setup_time_days: 5,
    industries: JSON.stringify(['real-estate', 'legal', 'coaching', 'ecommerce']),
    features: JSON.stringify([
      { title: 'Multi-Channel', desc: 'Qualifies across Web, WhatsApp, and SMS' },
      { title: 'Dynamic Scoring', desc: 'Scores leads based on interactions' },
      { title: 'Routing', desc: 'Sends hot leads to the right salesperson' },
      { title: 'Data Enrichment', desc: 'Automatically gathers company info' }
    ]),
    is_featured: false,
    sort_order: 4,
    short_description: 'Automatically filter and score incoming leads.',
    description: 'Stop wasting time on unqualified prospects. This agent engages every new lead, asks qualifying questions, scores them, and routes only the best opportunities to your team.',
    icon_name: 'Filter'
  },
  {
    slug: 'appointment-booking',
    name: 'Appointment Booking Agent',
    category: 'AUTOMATION',
    price_one_time: 30000,
    roi_promise: '30% fewer no-shows guaranteed',
    setup_time_days: 5,
    industries: JSON.stringify(['clinics', 'legal', 'coaching', 'real-estate']),
    features: JSON.stringify([
      { title: 'Calendar Sync', desc: 'Integrates with Google/Outlook' },
      { title: 'Smart Reminders', desc: 'Automated SMS & WhatsApp reminders' },
      { title: 'Rescheduling', desc: 'Handles cancellations and rebookings automatically' },
      { title: 'Pre-consultation Forms', desc: 'Collects necessary info before the meeting' }
    ]),
    is_featured: false,
    sort_order: 5,
    short_description: 'Automate scheduling and reduce no-shows.',
    description: 'A dedicated booking assistant that manages your calendar, schedules appointments 24/7, and sends automated reminders to drastically reduce no-show rates.',
    icon_name: 'Calendar'
  },
  {
    slug: 'workflow-automation',
    name: 'Workflow Automation Agent',
    category: 'AUTOMATION',
    price_one_time: 80000,
    roi_promise: 'Eliminate 30 hours of manual work weekly',
    setup_time_days: 14,
    industries: JSON.stringify(['ecommerce', 'legal', 'd2c', 'real-estate']),
    features: JSON.stringify([
      { title: 'Custom Workflows', desc: 'Tailored to your specific business processes' },
      { title: 'App Integration', desc: 'Connects 100+ different software tools' },
      { title: 'Data Entry Automation', desc: 'Eliminates copy-pasting between systems' },
      { title: 'Error Reduction', desc: '100% accuracy in repetitive tasks' }
    ]),
    is_featured: true,
    sort_order: 6,
    short_description: 'Custom AI workflows connecting all your tools.',
    description: 'The ultimate operational upgrade. We map your repetitive manual processes and build custom n8n/AI workflows to automate data transfer, report generation, and system updates.',
    icon_name: 'Workflow'
  },
  {
    slug: 'cart-abandonment',
    name: 'Cart Abandonment Recovery Agent',
    category: 'WHATSAPP',
    price_one_time: 35000,
    roi_promise: 'Recover 20-30% of abandoned carts automatically',
    setup_time_days: 5,
    industries: JSON.stringify(['ecommerce', 'd2c']),
    features: JSON.stringify([
      { title: 'Instant Triggers', desc: 'Messages sent minutes after abandonment' },
      { title: 'Dynamic Offers', desc: 'Creates personalized discount codes' },
      { title: 'Conversational Checkout', desc: 'Helps complete purchase in-chat' },
      { title: 'A/B Testing', desc: 'Optimizes messages for higher recovery' }
    ]),
    is_featured: true,
    sort_order: 7,
    short_description: 'Recover lost sales via automated WhatsApp.',
    description: 'Stop losing revenue at checkout. This agent detects abandoned carts and immediately engages customers via WhatsApp with personalized incentives to complete their purchase.',
    icon_name: 'ShoppingCart'
  },
  {
    slug: 'invoice-payment',
    name: 'Invoice & Payment Agent',
    category: 'AUTOMATION',
    price_one_time: 25000,
    roi_promise: 'Get paid faster with zero manual follow-up',
    setup_time_days: 5,
    industries: JSON.stringify(['legal', 'coaching', 'real-estate', 'clinics']),
    features: JSON.stringify([
      { title: 'Auto-Invoicing', desc: 'Generates and sends invoices automatically' },
      { title: 'Payment Links', desc: 'Includes Razorpay/Stripe links in messages' },
      { title: 'Smart Follow-ups', desc: 'Gentle reminders for overdue payments' },
      { title: 'Reconciliation', desc: 'Updates accounting software when paid' }
    ]),
    is_featured: false,
    sort_order: 8,
    short_description: 'Automated invoicing and payment collection.',
    description: 'Improve your cash flow without the awkward conversations. Automate invoice generation, send payment links, and follow up relentlessly but politely until paid.',
    icon_name: 'CreditCard'
  },
  {
    slug: 'regional-language',
    name: 'Regional Language Agent',
    category: 'WHATSAPP',
    price_one_time: 40000,
    roi_promise: 'Serve Hindi, Telugu, Tamil customers natively',
    setup_time_days: 10,
    industries: JSON.stringify(['ecommerce', 'clinics', 'd2c', 'real-estate']),
    features: JSON.stringify([
      { title: 'Auto-Translation', desc: 'Real-time translation of customer queries' },
      { title: 'Native Responses', desc: 'Generates replies in 10+ Indian languages' },
      { title: 'Voice Note Support', desc: 'Transcribes and responds to voice notes' },
      { title: 'Cultural Nuance', desc: 'Maintains polite, culturally appropriate tone' }
    ]),
    is_featured: false,
    sort_order: 9,
    short_description: 'AI support in all major Indian languages.',
    description: 'Expand your market reach. This agent automatically detects the customers language and provides fluent, native support in Hindi, Tamil, Telugu, Marathi, and more.',
    icon_name: 'Globe'
  },
  {
    slug: 'social-media-content',
    name: 'Social Media Content Agent',
    category: 'MARKETING',
    price_one_time: 30000,
    roi_promise: '30 days of content created in 10 minutes',
    setup_time_days: 5,
    industries: JSON.stringify(['d2c', 'coaching', 'ecommerce', 'real-estate']),
    features: JSON.stringify([
      { title: 'Idea Generation', desc: 'Endless viral content ideas' },
      { title: 'Copywriting', desc: 'Writes engaging captions and threads' },
      { title: 'Visual Prompts', desc: 'Generates prompts for Midjourney/DALL-E' },
      { title: 'Auto-Scheduling', desc: 'Posts directly to IG, X, LinkedIn' }
    ]),
    is_featured: false,
    sort_order: 10,
    short_description: 'Automated social media content engine.',
    description: 'Maintain a consistent, high-quality social media presence without the effort. Give the agent a topic, and it generates a months worth of posts, captions, and scheduling.',
    icon_name: 'Share2'
  },
  {
    slug: 'seo-content-marketing',
    name: 'SEO & Content Marketing Agent',
    category: 'MARKETING',
    price_one_time: 45000,
    roi_promise: 'Rank on Google without an SEO team',
    setup_time_days: 7,
    industries: JSON.stringify(['ecommerce', 'legal', 'coaching', 'd2c']),
    features: JSON.stringify([
      { title: 'Keyword Research', desc: 'Finds high-intent, low-competition keywords' },
      { title: 'Long-form Writing', desc: 'Generates 2,000+ word SEO-optimized articles' },
      { title: 'Internal Linking', desc: 'Automatically links to your other content' },
      { title: 'CMS Integration', desc: 'Publishes directly to WordPress/Webflow' }
    ]),
    is_featured: false,
    sort_order: 11,
    short_description: 'Scale your organic traffic automatically.',
    description: 'Dominate search results with AI-generated, high-quality blogs and articles. The agent handles keyword research, writing, formatting, and publishing entirely on autopilot.',
    icon_name: 'Search'
  },
  {
    slug: 'ai-ad-campaign',
    name: 'AI Ad Campaign Agent',
    category: 'MARKETING',
    price_one_time: 50000,
    roi_promise: '2x your ROAS without a media buyer',
    setup_time_days: 10,
    industries: JSON.stringify(['ecommerce', 'd2c', 'real-estate', 'coaching']),
    features: JSON.stringify([
      { title: 'Ad Copy Creation', desc: 'Generates hundreds of copy variations' },
      { title: 'Audience Targeting', desc: 'Finds hidden profitable audience segments' },
      { title: 'Budget Optimization', desc: 'Shifts spend to winning ads automatically' },
      { title: 'Performance Reporting', desc: 'Daily ROI summaries via Slack/WhatsApp' }
    ]),
    is_featured: true,
    sort_order: 12,
    short_description: 'Autonomous Meta & Google Ads management.',
    description: 'Your AI media buyer. It continuously tests new ad creatives, optimizes bids, targets profitable audiences, and scales winning campaigns to maximize your Return on Ad Spend.',
    icon_name: 'Target'
  },
  {
    slug: 'customer-support',
    name: 'Customer Support Agent',
    category: 'WHATSAPP',
    price_one_time: 40000,
    roi_promise: 'Handle 90% of support queries automatically',
    setup_time_days: 7,
    industries: JSON.stringify(['ecommerce', 'd2c', 'clinics', 'real-estate']),
    features: JSON.stringify([
      { title: 'Ticket Resolution', desc: 'Resolves common issues instantly' },
      { title: 'Knowledge Retrieval', desc: 'Reads your docs to answer complex queries' },
      { title: 'Sentiment Analysis', desc: 'Escalates angry customers immediately' },
      { title: 'Multi-platform', desc: 'Works on Email, Live Chat, and WhatsApp' }
    ]),
    is_featured: true,
    sort_order: 13,
    short_description: '24/7 intelligent customer support desk.',
    description: 'Provide instant, accurate support 24/7. Trained on your knowledge base and past tickets, this agent resolves the vast majority of customer issues without human intervention.',
    icon_name: 'Headset'
  },
  {
    slug: 'hr-onboarding',
    name: 'HR & Onboarding Agent',
    category: 'AUTOMATION',
    price_one_time: 35000,
    roi_promise: 'Onboard new employees in 1 day, not 1 week',
    setup_time_days: 7,
    industries: JSON.stringify(['ecommerce', 'legal', 'd2c', 'real-estate']),
    features: JSON.stringify([
      { title: 'Document Collection', desc: 'Automates ID and tax form gathering' },
      { title: 'Account Provisioning', desc: 'Creates email, Slack, and software accounts' },
      { title: 'Training Delivery', desc: 'Drips training materials over first 30 days' },
      { title: 'Policy Q&A', desc: 'Answers employee questions about leave/benefits' }
    ]),
    is_featured: false,
    sort_order: 14,
    short_description: 'Automate new hire onboarding and HR FAQs.',
    description: 'Ensure a perfect onboarding experience every time. Automate document collection, software provisioning, and provide an AI assistant to answer all new-hire questions.',
    icon_name: 'Users'
  },
  {
    slug: 'pricing-optimization',
    name: 'Pricing Optimization Agent',
    category: 'ANALYTICS',
    price_one_time: 45000,
    roi_promise: 'Increase margins by 15% with smart pricing',
    setup_time_days: 14,
    industries: JSON.stringify(['ecommerce', 'd2c']),
    features: JSON.stringify([
      { title: 'Competitor Tracking', desc: 'Monitors competitor pricing daily' },
      { title: 'Demand Forecasting', desc: 'Predicts demand surges to adjust prices' },
      { title: 'Dynamic Pricing', desc: 'Updates prices automatically in your store' },
      { title: 'Margin Protection', desc: 'Ensures prices never drop below cost' }
    ]),
    is_featured: false,
    sort_order: 15,
    short_description: 'Dynamic, algorithmic pricing for e-commerce.',
    description: 'Stop leaving money on the table. This agent monitors competitors, inventory levels, and market demand to dynamically adjust your prices for maximum profitability.',
    icon_name: 'TrendingUp'
  },
  {
    slug: 'inventory-management',
    name: 'Inventory Management Agent',
    category: 'OPERATIONS',
    price_one_time: 40000,
    roi_promise: 'Never run out of stock unexpectedly again',
    setup_time_days: 10,
    industries: JSON.stringify(['ecommerce', 'd2c']),
    features: JSON.stringify([
      { title: 'Stock Alerts', desc: 'Predictive warnings before you run out' },
      { title: 'Auto-Reordering', desc: 'Drafts purchase orders to suppliers' },
      { title: 'Sales Velocity', desc: 'Calculates true run-rate for every SKU' },
      { title: 'Dead Stock ID', desc: 'Identifies inventory that needs discounting' }
    ]),
    is_featured: false,
    sort_order: 16,
    short_description: 'Predictive AI inventory management.',
    description: 'Prevent stockouts and overstocking. The agent analyzes sales velocity and lead times to accurately predict when you need to reorder, drafting POs automatically.',
    icon_name: 'Package'
  },
  {
    slug: 'review-reputation',
    name: 'Review & Reputation Agent',
    category: 'MARKETING',
    price_one_time: 30000,
    roi_promise: 'Go from 3.9 to 4.8 stars in 60 days',
    setup_time_days: 5,
    industries: JSON.stringify(['clinics', 'real-estate', 'coaching', 'ecommerce']),
    features: JSON.stringify([
      { title: 'Review Generation', desc: 'Automatically asks happy customers for reviews' },
      { title: 'Review Response', desc: 'Drafts tailored replies to all Google Reviews' },
      { title: 'Negative Interception', desc: 'Routes unhappy customers to support before they post' },
      { title: 'Competitor Intel', desc: 'Analyzes competitor reviews for weaknesses' }
    ]),
    is_featured: false,
    sort_order: 17,
    short_description: 'Automate 5-star reviews and reputation management.',
    description: 'Build an untouchable online reputation. Automatically request reviews from satisfied customers, intercept negative feedback, and reply to all public reviews professionally.',
    icon_name: 'Star'
  },
  {
    slug: 'knowledge-base',
    name: 'Knowledge Base Agent',
    category: 'OPERATIONS',
    price_one_time: 35000,
    roi_promise: 'Give every employee an instant expert to ask',
    setup_time_days: 10,
    industries: JSON.stringify(['legal', 'ecommerce', 'coaching', 'd2c']),
    features: JSON.stringify([
      { title: 'Document Ingestion', desc: 'Reads PDFs, Docs, Notion, and Wikis' },
      { title: 'Instant Answers', desc: 'Provides accurate answers with citations' },
      { title: 'Slack/Teams Integration', desc: 'Available where your team already works' },
      { title: 'Always Updating', desc: 'Learns as new documents are added' }
    ]),
    is_featured: false,
    sort_order: 18,
    short_description: 'An AI expert trained on your internal data.',
    description: 'Turn your chaotic internal documentation into an instantly searchable AI expert. Employees ask questions in natural language and get immediate, accurate answers with citations.',
    icon_name: 'Database'
  }
];

async function main() {
  console.log('Seeding Database...');
  for (const agent of agentsData) {
    await prisma.agents.upsert({
      where: { slug: agent.slug },
      update: {
        ...agent,
      },
      create: {
        ...agent,
      },
    });
  }
  console.log('Seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
