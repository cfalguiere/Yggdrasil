echo converting companies
iconv -t iso-8859-1 -f utf-8 out/companies.csv > out/companies_latin1.csv
echo converting agreements
iconv -t iso-8859-1 -f utf-8 out/agreements.csv > out/agreements_latin1.csv
echo converting plans
iconv -t iso-8859-1 -f utf-8 out/plans.csv > out/plans_latin1.csv
