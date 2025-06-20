# Updated Pricing Component Documentation

## Overview

The pricing component has been updated with the following key features:

### 1. **Updated Pricing Structure**

- **Free Plan**: ₹0 (Free forever)
- **Pro Plan**: ₹1,200/month or ₹12,000/year (saves 2 months)
- **Enterprise Plan**: Custom pricing (contact sales)

### 2. **Currency Converter**

The component now includes a dropdown to convert prices to 10 different currencies:

| Currency | Symbol | Example Conversion (₹1200) |
| -------- | ------ | -------------------------- |
| INR      | ₹      | ₹1,200                     |
| USD      | $      | $14.40                     |
| EUR      | €      | €13.20                     |
| GBP      | £      | £11.52                     |
| JPY      | ¥      | ¥2,196                     |
| CAD      | C$     | C$20.40                    |
| AUD      | A$     | A$22.80                    |
| CNY      | ¥      | ¥104                       |
| SGD      | S$     | S$19.20                    |
| AED      | د.إ    | د.إ52.80                   |

### 3. **Features**

- **Monthly/Yearly Toggle**: Switch between monthly and yearly billing
- **Exchange Rate Display**: Shows current exchange rate when currency other than INR is selected
- **Smart Price Formatting**: Automatically formats prices based on currency conventions
- **Responsive Design**: Works on all device sizes
- **Animated Cards**: Smooth animations for better user experience

### 4. **Usage**

```tsx
import { Pricing4 } from "@/components/price";

const plans = [
  {
    name: "Pro",
    price: {
      monthly: 1200, // Amount in INR
      yearly: 12000,
    },
    description: "For growing teams",
    features: ["Feature 1", "Feature 2"],
    badge: "Most Popular",
    isPopular: true,
  },
];

<Pricing4
  title="Choose Your Plan"
  description="Select the plan that fits your needs"
  plans={plans}
/>;
```

### 5. **Live Demo**

Visit `/pricing-demo` to see the component in action with the updated pricing structure.

## Implementation Details

The component uses real-time currency conversion with approximate exchange rates. The Pro plan base price is set in Indian Rupees (₹1,200) and automatically converts to other currencies when selected.

### Exchange Rate Updates

Exchange rates are currently hardcoded but can be easily updated by modifying the `currencies` array in the component. For production use, consider integrating with a live exchange rate API.
