echo -e
echo "======================= gen companies =========================="
shuf data/companyNames.txt > data/companyNamesShuffled.txt

shuf data/villes_cp_pop_over_10000.csv > data/villes_cp_pop_over_10000_shuffled.csv


node genCompaniesInfo.js
node genCompanies.js

#echo -e
#echo "nombre de villes manquantes avant"
#cut -d ';' -f9-10 out/companies_*.csv  | grep "^;$" | wc -l

#grep -v 'Avenue;;;' out/companies_1500-2499.csv  > out/companies.csv
#mv out/companies.csv out/companies_1500-2499.csv

echo -e
echo "nombre de villes manquantes apres"
cut -d ';' -f9-10 out/companies_*.csv  | grep "^;$" | wc -l

echo -e
echo "======================= gen contrats =========================="

node genContractsInfo.js

node genAgreements.js
node genPlans.js

echo -e
echo "======================= check =========================="
node checkProduct.js

./toLatin1.bash

