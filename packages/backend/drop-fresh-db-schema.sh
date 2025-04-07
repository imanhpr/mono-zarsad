npx -w packages/backend mikro-orm-esm schema:fresh -r
npx -w packages/backend mikro-orm-esm seeder:run -c CurrencyTypeSeeder
npx -w packages/backend mikro-orm-esm seeder:run -c CurrencyPriceSeeder
npx -w packages/backend mikro-orm-esm seeder:run -c CompanyInfoSeeder
echo 'success'