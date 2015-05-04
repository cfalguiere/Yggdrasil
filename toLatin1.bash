echo "====================== Configuration ======================"

RANGE="25500-26499"

OUTPUT_FOLDER=out
RANGE_FOLDER=$RANGE
LATIN1_FOLDER=latin1
mkdir -p ${OUTPUT_FOLDER}/${RANGE_FOLDER}
mkdir -p ${OUTPUT_FOLDER}/${RANGE_FOLDER}/${LATIN1_FOLDER}

echo "RANGE: $RANGE"
echo "OUTPUT_FOLDER: $OUTPUT_FOLDER"
echo "RANGE_FOLDER: $RANGE_FOLDER"
echo "LATIN1_FOLDER: $LATIN1_FOLDER"

echo -e
echo "========================== JSON =========================="
echo "Parking Info files"

cp "range.json" "${OUTPUT_FOLDER}/${RANGE_FOLDER}/range.json"


for file in companiesInfo contractInfo companiesConfiguration contractConfiguration
do
  in="${file}_${RANGE}.json"
  mv "${OUTPUT_FOLDER}/${in}" "${OUTPUT_FOLDER}/${RANGE_FOLDER}/${in}"
done

for file in companies agreements plans
do
  echo -e
  echo "========================== ${file} =========================="
  echo "Converting and moving CSV files"
  in="${file}_${RANGE}.csv"
  out="${file}_${RANGE}_latin1.csv"
  latin1="${OUTPUT_FOLDER}/${RANGE_FOLDER}/${LATIN1_FOLDER}/${out}"

  mv "${OUTPUT_FOLDER}/${in}" "${OUTPUT_FOLDER}/${RANGE_FOLDER}/${in}"
  iconv -t iso-8859-1 -f utf-8 "${OUTPUT_FOLDER}/${RANGE_FOLDER}/${in}" > $latin1

  echo -e
  echo "=========================="
  wc -l $latin1
  #head -2 $latin1
  #tail -1 $latin1

  # companies
  if [ "$file" = "companies" ]; then
    for field in 1 3 9 10 12
    do
      head -2 $latin1 | cut -f $field -d ';'
    done
  fi

  # agreements
  if [ "$file" = "agreements" ]; then
    for field in 4 6 7
    do
      head -2 $latin1 | cut -f $field -d ';'
    done
    echo "dernier id:"
    tail -1 $latin1 | cut -f 4 -d ';'
  fi

  # plans
  if [ "$file" = "plans" ]; then
    for field in 4 5 6 17 20 28 30 40
    do
      head -2 $latin1 | cut -f $field -d ';'
    done
    echo "dernier id:"
    tail -1 $latin1 | cut -f 5 -d ';'
  fi

done


