RANGE="12500-13499"

OUTPUT_FOLDER=out
RANGE_FOLDER=$RANGE
SPLIT_FOLDER=split
mkdir -p ${OUTPUT_FOLDER}/${RANGE_FOLDER}/${SPLIT_FOLDER}

#split -l101 --numeric-suffixes=1 --suffix-length=2  out/1400-2399/latin1/plans_1400-2399_latin1.csv out/1400-2399/split/plans_1400-2399_latin1.csv
split -l501 --numeric-suffixes=1 --suffix-length=2  ${OUTPUT_FOLDER}/${RANGE_FOLDER}/latin1/plans_${RANGE}_latin1.csv ${OUTPUT_FOLDER}/${RANGE_FOLDER}/${SPLIT_FOLDER}/plans_${RANGE}_latin1.csv

for file in 02
#03 04 05 06 07 08 09 10
do
sed -i "1i$(head -1 out/2500-3499/latin1/plans_2500-3499_latin1.csv)" "${OUTPUT_FOLDER}/${RANGE_FOLDER}/${SPLIT_FOLDER}/plans_${RANGE}_latin1.csv${file}"
done
