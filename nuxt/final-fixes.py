#!/usr/bin/env python3
import re

# File-specific fixes
fixes = {
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useCustomers.ts": [
        (193, r'(\): )any\b', r'\1unknown'),
    ],
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useGrapesJS.ts": [
        (520, r'\(e:', r'(_e:'),
        (633, r'\(elInput:', r'(_elInput:'),
        (1035, r' as any', r' as unknown'),
        (1139, r'\(e:', r'(_e:'),
        (1225, r'\(e:', r'(_e:'),
        (1393, r' as any', r' as unknown'),
    ],
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useImpersonation.ts": [
        (16, r': any\b', r': unknown'),
    ],
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useSettings.ts": [
        (253, r': any\b', r': unknown'),
    ],
}

def fix_file(filepath, line_fixes):
    """Apply line-specific fixes"""
    try:
        with open(filepath, 'r') as f:
            lines = f.readlines()

        modified = False
        for line_num, pattern, replacement in line_fixes:
            idx = line_num - 1
            if idx < len(lines):
                original = lines[idx]
                lines[idx] = re.sub(pattern, replacement, lines[idx])
                if lines[idx] != original:
                    modified = True
                    print(f"  Line {line_num}: Fixed")

        if modified:
            with open(filepath, 'w') as f:
                f.writelines(lines)
            return True
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

print("Applying final fixes...")
for filepath, line_fixes in fixes.items():
    print(f"\n{filepath.split('/')[-1]}:")
    fix_file(filepath, line_fixes)

print("\n✓ All fixes applied")
