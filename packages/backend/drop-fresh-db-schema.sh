npx -w packages/backend mikro-orm-esm schema:fresh -r
npx -w packages/backend mikro-orm-esm seeder:run -c CurrencyTypeSeeder
npx -w packages/backend mikro-orm-esm seeder:run -c CompanyInfoSeeder
npx -w packages/backend mikro-orm-esm seeder:run -c PairSeeder

echo 'success'