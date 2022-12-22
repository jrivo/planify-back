for var in "$@"
do
    nest generate module $var
    nest generate service $var
    nest generate controller $var
done