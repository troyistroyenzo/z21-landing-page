# Typeform-Style CTA Implementation

A beautiful, animated multi-step form CTA built with Next.js, Framer Motion, and Supabase.

## 🚀 Features

- **Smooth Animations**: Beautiful Framer Motion transitions between questions
- **Swipe Gestures**: Navigate between questions by dragging left/right
- **Smart Validation**: Real-time field validation with helpful error messages
- **Progress Tracking**: Visual progress bar and step indicators
- **Auto-advance**: Select questions automatically move to the next step
- **Keyboard Navigation**: Press Enter to move forward, navigate naturally
- **Analytics Integration**: Google Analytics event tracking for form starts and completions
- **Fully Responsive**: Works beautifully on all device sizes
- **Decoupled Questions**: Questions are stored separately from UI for easy customization

## 📁 Files Created

```
app/
├── components/
│   ├── TypeformCTA.tsx          # Main form component
│   └── TypeformCTAButton.tsx    # Button to trigger the form
├── content/
│   └── ctaQuestions.ts          # Questions configuration (decoupled)
├── api/
│   └── cta-submit/
│       └── route.ts              # API endpoint for form submission
└── cta-demo/
    └── page.tsx                  # Demo page for testing

lib/
└── supabase.ts                   # Supabase client configuration

types/
└── gtag.d.ts                     # TypeScript definitions for Google Analytics

supabase/
└── create_cta_table.sql          # SQL script to create database table
```

## 🔧 Setup Instructions

### 1. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script from `supabase/create_cta_table.sql`
4. Get your credentials from Settings > API:
   - Project URL
   - Anon/public key
   - Service role key (keep this secret!)

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Test the Implementation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit the demo page:
   ```
   http://localhost:3000/cta-demo
   ```

3. Click any button to open the form and test the flow

## 🎨 Customization

### Customize Questions

Edit `app/content/ctaQuestions.ts` to modify the questions:

```typescript
export const ctaQuestions: Question[] = [
  {
    id: 'name',
    type: 'text',
    label: "What's your name?",
    placeholder: 'Enter your name',
    description: "We'll use this to personalize your experience",
    validation: {
      required: true,
      minLength: 2,
      errorMessage: 'Please enter your name'
    }
  },
  // Add more questions...
];
```

### Question Types Available

- `text`: Single-line text input
- `email`: Email input with validation
- `multiline`: Multi-line textarea
- `select`: Dropdown/choice selection
- `phone`: Phone number input
- `url`: URL input
- `number`: Numeric input

### Styling the Button

Use the `TypeformCTAButton` component with different variants:

```tsx
// Primary button (accent color)
<TypeformCTAButton 
  text="Get Started"
  variant="primary"
  size="lg"
/>

// Secondary button (gray)
<TypeformCTAButton 
  text="Learn More"
  variant="secondary"
  size="md"
/>

// Outline button
<TypeformCTAButton 
  text="Join Now"
  variant="outline"
  size="sm"
/>
```

## 📊 Database Schema

The `cta_responses` table stores:

- `id`: Unique identifier (UUID)
- `created_at`: Timestamp of submission
- `name`: User's name
- `email`: User's email address
- `current_role`: User's current role/position
- `biggest_challenge`: Their biggest challenge with AI
- `time_commitment`: Hours per week they can commit
- `specific_goal`: Their specific goal (text)
- `urgency`: When they need results
- `source_url`: Where the form was submitted from
- `metadata`: JSON object with IP, user agent, etc.

## 🔄 Integration Points

### Add to Your Landing Page

Import and use the button in any component:

```tsx
import TypeformCTAButton from '@/app/components/TypeformCTAButton';

export default function Hero() {
  return (
    <section>
      <h1>Transform AI potential into production power</h1>
      <TypeformCTAButton 
        text="Start Your Journey"
        variant="primary"
        size="lg"
      />
    </section>
  );
}
```

### Track Analytics Events

The form automatically tracks:
- `form_start`: When the user opens the form
- `form_submit`: When the form is successfully submitted

These events are sent to Google Analytics if configured.

### Email Integration (Optional)

In `app/api/cta-submit/route.ts`, uncomment and implement:

```typescript
// Send a welcome email
await sendWelcomeEmail(body.email, body.name);

// Add to email list
await addToEmailList(body.email, body.name);
```

## 🎯 Best Practices

1. **Keep questions concise**: Users prefer short, clear questions
2. **Limit total questions**: 5-8 questions is optimal for conversion
3. **Start easy**: Begin with simple questions like name
4. **Save email early**: Capture email in the first 2-3 questions
5. **Use descriptions**: Add helpful context below questions
6. **Test thoroughly**: Check validation, navigation, and submission

## 🐛 Troubleshooting

### Form submission fails
- Check that Supabase credentials are set in `.env.local`
- Verify the `cta_responses` table exists in Supabase
- Check browser console for specific error messages

### Animations are choppy
- Ensure you're using production build for best performance
- Check that Framer Motion is properly installed

### Questions don't appear
- Verify `ctaQuestions.ts` exports the questions array
- Check for TypeScript errors in the console

## 📈 Viewing Responses

To view submitted responses in Supabase:

1. Go to your Supabase dashboard
2. Navigate to Table Editor
3. Select the `cta_responses` table
4. Or use the `cta_responses_summary` view for formatted data

You can also use the `get_cta_stats()` function to get aggregated statistics.

## 🚦 Next Steps

1. ✅ Set up Supabase and run the SQL script
2. ✅ Add environment variables
3. ✅ Customize questions for your use case
4. ✅ Add the TypeformCTAButton to your main pages
5. ✅ Set up email automation (optional)
6. ✅ Monitor responses and optimize questions

---

Built with ❤️ for Z21 Founders
