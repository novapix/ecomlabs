# Output and aux directories
$out_dir = "build";
$aux_dir = "build";

$pdf_previewer = "none";
$jobname = "Lab1";

# --- Clean up temporary files after successful build ---
$cleanup_includes_cusdep_generated = 1;
$cleanup_mode = 1;  # 1 = remove all nonessential files

# Run cleanup after building
$success_hook = sub {
    system("latexmk -c");
};
