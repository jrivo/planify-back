for var in "$@"
do
    nest generate module $var
    nest generate service $var
done