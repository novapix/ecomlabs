# Output and aux directories
$out_dir = "build";
$aux_dir = "build";
$pdf_mode = 1;
$pdflatex = 'pdflatex -shell-escape -interaction=nonstopmode -synctex=1 %O %S';
$jobname = 'Lab3';

# Cleanup file lists
$clean_ext .= ' %R.aux %R.fls %R.fdb_latexmk %R.log %R.out %R.toc %R.synctex.gz';
$clean_full_ext .= ' %R.nav %R.snm %R.vrb %R.pyg %R.listing %R.pygstyle';
