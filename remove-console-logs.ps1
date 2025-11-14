# Script để xóa tất cả console.log, console.error, console.warn, console.debug

$files = @(
    "src\services\searchAPI.ts",
    "src\services\ingredientsAPI.ts",
    "src\services\userProfileAPI.ts",
    "src\services\mealReviewAPI.ts",
    "src\services\mealPlanAPI.ts",
    "src\services\mealHistoryAPI.ts",
    "src\services\filterAPI.ts",
    "src\services\favoritesAPI.ts",
    "src\services\apiClient.ts",
    "src\services\api.ts",
    "src\utils\userUtils.ts",
    "src\utils\proUserTest.ts",
    "src\hooks\useBase64Upload.ts",
    "src\screens\register&login\RegisterScreen.tsx",
    "src\screens\register&login\UserInfoScreen.tsx",
    "src\screens\register&login\GoalsScreen.tsx",
    "src\screens\home\community\EditPostScreen.tsx",
    "src\screens\home\community\CreatePostScreen.tsx",
    "src\screens\profile\setting\PersonalNutritionScreen.tsx",
    "src\screens\detail\review\ReviewsScreen.tsx",
    "src\screens\search\FilterResultsScreen.tsx"
)

foreach ($file in $files) {
    $fullPath = Join-Path (Get-Location) $file
    if (Test-Path $fullPath) {
        Write-Host "Processing: $file"
        
        $content = Get-Content $fullPath -Raw
        
        # Remove console.log statements
        $content = $content -replace "console\.log\([^;]*\);?", ""
        
        # Remove console.error statements
        $content = $content -replace "console\.error\([^;]*\);?", ""
        
        # Remove console.warn statements
        $content = $content -replace "console\.warn\([^;]*\);?", ""
        
        # Remove console.debug statements
        $content = $content -replace "console\.debug\([^;]*\);?", ""
        
        # Clean up multiple empty lines
        $content = $content -replace "(\r?\n){3,}", "`n`n"
        
        Set-Content $fullPath -Value $content -NoNewline
        
        Write-Host "✓ Cleaned: $file" -ForegroundColor Green
    } else {
        Write-Host "✗ Not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✨ Done! All console statements have been removed." -ForegroundColor Cyan
