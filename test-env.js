// Quick script to verify environment variables are loaded
// Run with: node test-env.js

console.log('🔍 Checking Environment Variables...\n');

const requiredVars = [
    'NEXT_PUBLIC_APP_URL',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'RESEND_API_KEY',
    'BUSINESS_EMAIL'
];

let allGood = true;

requiredVars.forEach(varName => {
    const value = process.env[varName];
    const isSet = !!value;
    const prefix = value ? value.substring(0, 20) + '...' : 'NOT SET';

    console.log(`${isSet ? '✅' : '❌'} ${varName}: ${isSet ? prefix : '❌ MISSING'}`);

    if (!isSet) {
        allGood = false;
    }
});

console.log('\n' + (allGood ? '✅ All environment variables are set!' : '❌ Some environment variables are missing!'));

if (!allGood) {
    console.log('\n💡 Make sure to:');
    console.log('   1. Create .env.local file');
    console.log('   2. Add all required variables');
    console.log('   3. Restart your dev server');
}
