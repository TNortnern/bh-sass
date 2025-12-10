#!/usr/bin/env python3
"""
Fix remaining ESLint errors in composables directory - Phase 2
"""
import re

files_to_fix = {
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useBundles.ts": [
        (r'fetchData\(term: Record<string, unknown>\)', 'fetchData(_term: Record<string, unknown>)'),
        (r'category: Record<string, unknown>', 'category: Record<string, unknown>'),
        (r'async \(category: Record<string, unknown>\)', 'async (_category: Record<string, unknown>)'),
        (r'customer: Record<string, unknown>', '_customer: Record<string, unknown>'),
    ],
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useContentDetection.ts": [
        (r"^import { Booking, Customer, InventoryItem } from", "// import { Booking, Customer, InventoryItem } from"),
    ],
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useGrapesJS.ts": [
        (r"^import { onMounted, onUnmounted,", "import {"),
        (r'\(e: Record<string, unknown>\) => {', '(_e: Record<string, unknown>) => {'),
        (r'\((elInput: Record<string, unknown>)\) =>', '((_elInput: Record<string, unknown>)) =>'),
        (r'on\(Record<string, unknown>, Record<string, unknown>\)', 'on(_event: Record<string, unknown>, _data: Record<string, unknown>)'),
    ],
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/usePayloadApi.ts": [
        (r'const config = useRuntimeConfig\(\)', '// const config = useRuntimeConfig()'),
    ],
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/usePublicBooking.ts": [
        (r'export interface CreateRbPayloadBookingData', 'export interface _CreateRbPayloadBookingData'),
        (r'async \(params: Record<string, unknown>\)', 'async (_params: Record<string, unknown>)'),
    ],
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useSettings.ts": [
        (r'async \(webhookId: string\)', 'async (_webhookId: string)'),
    ],
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useWebsiteBuilderData.ts": [
        (r'^import { Ref } from', '// import { Ref } from'),
    ],
}

def fix_file(filepath, replacements):
    """Apply replacements to a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Fixed {filepath}")
            return True
        else:
            print(f"- No changes for {filepath}")
            return False
    except Exception as e:
        print(f"✗ Error fixing {filepath}: {e}")
        return False

def main():
    """Main entry point"""
    fixed_count = 0
    for filepath, replacements in files_to_fix.items():
        if fix_file(filepath, replacements):
            fixed_count += 1
    print(f"\n✓ Fixed {fixed_count} files")

if __name__ == "__main__":
    main()
