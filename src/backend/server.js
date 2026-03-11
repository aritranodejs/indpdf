import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
app.use(cors());

// Stripe webhook needs raw body
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// Parse JSON bodies for other routes
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

const tools = [
    { id: '1', name: 'Merge PDF', slug: 'merge-pdf', description: 'Combine multiple PDF files into one.', category: 'Organize', tier: 'free', iconName: 'merge' },
    { id: '2', name: 'Split PDF', slug: 'split-pdf', description: 'Divide a PDF into multiple files.', category: 'Organize', tier: 'free', iconName: 'split' },
    { id: '3', name: 'Rotate PDF', slug: 'rotate-pdf', description: 'Rotate pages in your PDF documents.', category: 'Organize', tier: 'free', iconName: 'rotate' },
    { id: '4', name: 'Reorder Pages', slug: 'reorder-pages', description: 'Change the order of pages in PDFs.', category: 'Organize', tier: 'free', iconName: 'reorder' },
    { id: '5', name: 'PDF to Word', slug: 'pdf-to-word', description: 'Convert PDF files to editable Word documents.', category: 'Convert', tier: 'free', iconName: 'word' },
    { id: '6', name: 'PDF to Excel', slug: 'pdf-to-excel', description: 'Transform PDFs into Excel spreadsheets.', category: 'Convert', tier: 'free', iconName: 'excel' },
    { id: '7', name: 'PDF to PowerPoint', slug: 'pdf-to-powerpoint', description: 'Convert PDFs to PowerPoint presentations.', category: 'Convert', tier: 'free', iconName: 'powerpoint' },
    { id: '8', name: 'PDF to JPG', slug: 'pdf-to-jpg', description: 'Convert PDF pages to JPG images.', category: 'Convert', tier: 'free', iconName: 'jpg' },
    { id: '9', name: 'Word to PDF', slug: 'word-to-pdf', description: 'Convert Word documents to PDF.', category: 'Convert', tier: 'free', iconName: 'word' },
    { id: '10', name: 'JPG to PDF', slug: 'jpg-to-pdf', description: 'Create PDFs from JPG images.', category: 'Convert', tier: 'free', iconName: 'jpg' },
    { id: '11', name: 'Compress PDF', slug: 'compress-pdf', description: 'Reduce the file size of PDFs.', category: 'Optimize', tier: 'free', iconName: 'compress' },
    { id: '12', name: 'Repair PDF', slug: 'repair-pdf', description: 'Fix corrupted or damaged PDFs.', category: 'Optimize', tier: 'free', iconName: 'repair' },
    { id: '13', name: 'PDF to Grayscale', slug: 'pdf-to-grayscale', description: 'Convert PDFs to grayscale.', category: 'Optimize', tier: 'free', iconName: 'grayscale' },
    { id: '14', name: 'Flatten PDF', slug: 'flatten-pdf', description: 'Flatten layers in PDF documents.', category: 'Optimize', tier: 'free', iconName: 'flatten' },
    { id: '15', name: 'Protect PDF', slug: 'protect-pdf', description: 'Add encryption and passwords to PDFs.', category: 'Security', tier: 'free', iconName: 'protect' },
    { id: '16', name: 'Unlock PDF', slug: 'unlock-pdf', description: 'Remove encryption from PDFs.', category: 'Security', tier: 'free', iconName: 'unlock' },
    { id: '17', name: 'Add Watermark', slug: 'add-watermark', description: 'Insert watermarks into PDFs.', category: 'Edit', tier: 'free', iconName: 'watermark' },
    { id: '18', name: 'Remove Watermark', slug: 'remove-watermark', description: 'Erase watermarks from PDFs.', category: 'Edit', tier: 'free', iconName: 'watermark' },
    { id: '19', name: 'Add Page Numbers', slug: 'add-page-numbers', description: 'Insert page numbers into PDFs.', category: 'Edit', tier: 'free', iconName: 'page_numbers' },
    { id: '20', name: 'Edit Metadata', slug: 'edit-metadata', description: 'Modify PDF metadata information.', category: 'Edit', tier: 'free', iconName: 'metadata' },
    { id: '21', name: 'Sign PDF', slug: 'sign-pdf', description: 'Digitally sign PDF documents.', category: 'Advanced', tier: 'premium', iconName: 'sign' },
    { id: '22', name: 'Annotate PDF', slug: 'annotate-pdf', description: 'Add annotations to PDF files.', category: 'Advanced', tier: 'premium', iconName: 'annotate' },
    { id: '23', name: 'Compare PDFs', slug: 'compare-pdfs', description: 'Compare two PDF documents for differences.', category: 'Advanced', tier: 'premium', iconName: 'compare' },
];

const getCategoryOrder = (category) => {
    switch (category) {
        case 'Organize': return 0;
        case 'Convert': return 1;
        case 'Optimize': return 2;
        case 'Security': return 3;
        case 'Edit': return 4;
        case 'Advanced': return 5;
        default: return 6;
    }
};

app.get('/api/tools', (req, res) => {
    const sortedTools = [...tools].sort((a, b) => {
        const catA = getCategoryOrder(a.category);
        const catB = getCategoryOrder(b.category);
        if (catA === catB) {
            return a.name.localeCompare(b.name);
        }
        return catA - catB;
    });
    res.json(sortedTools);
});

app.get('/api/tools/:slug', (req, res) => {
    const tool = tools.find(t => t.slug === req.params.slug);
    if (tool) res.json(tool);
    else res.status(404).json({ error: 'Tool not found' });
});

app.get('/api/tools/category/:category', (req, res) => {
    const filtered = tools.filter(t => t.category === req.params.category);
    res.json(filtered);
});

app.post('/api/create-subscription', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // 1. Create or find customer
        const customers = await stripe.customers.list({ email, limit: 1 });
        let customer = customers.data[0];

        if (!customer) {
            customer = await stripe.customers.create({ email });
        }

        // 2. Create Product (or fetch existing, but creating for simplicity in this flow)
        const product = await stripe.products.create({
            name: 'Premium Subscription',
            description: 'Embedded Trial Flow'
        });

        // 3. Create subscription with 7-day trial and the product ID
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{
                price_data: {
                    currency: 'usd',
                    product: product.id,
                    unit_amount: 999,
                    recurring: {
                        interval: 'month'
                    }
                }
            }],
            trial_period_days: 7,
            payment_behavior: 'default_incomplete',
            payment_settings: {
                payment_method_types: ['card'],
                save_default_payment_method: 'on_subscription'
            },
            expand: ['pending_setup_intent', 'latest_invoice.payment_intent'],
        });

        let clientSecret = null;

        // For trials, Stripe creates a setup intent to verify the card for future charges.
        if (subscription.pending_setup_intent) {
            clientSecret = subscription.pending_setup_intent.client_secret;
        }
        // If there's no trial (or it expired), it creates a payment intent.
        else if (subscription.latest_invoice && subscription.latest_invoice.payment_intent) {
            clientSecret = subscription.latest_invoice.payment_intent.client_secret;
        }

        if (!clientSecret) {
            // This happens if the subscription is already active (e.g., card already on file)
            // Or if the payment behavior wasn't default_incomplete. 
            // We need to return an error to handle this flow if we expect an element to mount.
            throw new Error("Could not generate a client secret for payment. The user might already have an active subscription or a card on file.");
        }

        res.json({
            subscriptionId: subscription.id,
            clientSecret: clientSecret,
        });
    } catch (error) {
        console.error('Subscription Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { email } = req.body;

        // In production, we should map the email to a Stripe Customer ID if they already exist.
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Premium Subscription (7-Day Free Trial)',
                            description: 'Access to advanced PDF tools like Sign, Annotate, and Compare.'
                        },
                        unit_amount: 999, // $9.99/month
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            subscription_data: {
                trial_period_days: 7,
            },
            customer_email: email,
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}`,
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/webhook', (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.warn("No STRIPE_WEBHOOK_SECRET config. Skipping webhook verification for testing.");
        // For local dev without webhook secret
        res.send();
        return;
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Checkout Session Completed for:', session.customer_email);
            // Here you would typically save the subscription state to DB
            break;
        case 'customer.subscription.updated':
            const subscription = event.data.object;
            console.log('Subscription Updated:', subscription.id);
            break;
        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object;
            console.log('Subscription Deleted:', deletedSubscription.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
