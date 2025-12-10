#!/usr/bin/env python3
import re

# Map of files to their line-specific fixes
fixes = {
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useContentDetection.ts": {
        84: (r': any\b', ': Record<string, unknown>'),
        113: (r': any\b', ': Record<string, unknown>'),
        157: (r': any\b', ': Record<string, unknown>'),
    },
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useCustomers.ts": {
        193: (r': any\b', ': Record<string, unknown>'),
    },
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useGrapesJS.ts": {
        487: (r': any\b', ': Record<string, unknown>'),
        514: (r': any\b', ': Record<string, unknown>'),
        520: (r'\(e:', '(_e:'),
        588: (r': any\b', ': Record<string, unknown>'),
        633: (r'\(elInput:', '(_elInput:'),
        1035: (r': any\b', ': Record<string, unknown>'),
        1060: (r': any\b', ': Record<string, unknown>'),
        1122: (r': any\b', ': Record<string, unknown>'),
        1133: (r': any\b', ': Record<string, unknown>'),
        1139: (r'\(e:', '(_e:'),
        1152: (r': any\b', ': Record<string, unknown>'),
        1180: (r': any\b', ': Record<string, unknown>'),
        1209: (r': any\b', ': Record<string, unknown>'),
        1219: (r': any\b', ': Record<string, unknown>'),
        1225: (r'\(e:', '(_e:'),
        1237: (r': any\b', ': Record<string, unknown>'),
        1393: (r': any\b', ': Record<string, unknown>'),
    },
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useImpersonation.ts": {
        16: (r': any\b', ': Record<string, unknown>'),
    },
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useNotifications.ts": {
        16: (r': any\b', ': Record<string, unknown>'),
    },
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/usePayloadApi.ts": {
        23: (r': any\b', ': Record<string, unknown>'),
    },
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/usePublicBooking.ts": {
        143: (r': any\b', ': Record<string, unknown>'),
        160: (r': any\b', ': Record<string, unknown>'),
        191: (r': any\b', ': Record<string, unknown>'),
        225: (r': any\b', ': Record<string, unknown>'),
        257: (r': any\b', ': Record<string, unknown>'),
        283: (r': any\b', ': Record<string, unknown>'),
        299: (r': any\b', ': Record<string, unknown>'),
    },
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useSettings.ts": {
        253: (r': any\b', ': Record<string, unknown>'),
        448: (r': any\b', ': Record<string, unknown>'),
    },
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useWebsiteBuilderData.ts": {
        288: (r': any\b', ': Record<string, unknown>'),
        289: (r': any\b', ': Record<string, unknown>'),
    },
    "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables/useWebsiteVariables.ts": {
        107: (r': any\b', ': Record<string, unknown>'),
        108: (r': any\b', ': Record<string, unknown>'),
        109: (r': any\b', ': Record<string, unknown>'),
        110: (r': any\b', ': Record<string, unknown>'),
        111: (r': any\b', ': Record<string, unknown>'),
        112: (r': any\b', ': Record<string, unknown>'),
        113: (r': any\b', ': Record<string, unknown>'),
        114: (r': any\b', ': Record<string, unknown>'),
        115: (r': any\b', ': Record<string, unknown>'),
    },
}

def fix_file(filepath, line_fixes):
    """Apply line-specific fixes to a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        modified = False
        for line_num, (pattern, replacement) in line_fixes.items():
            idx = line_num - 1  # Convert to 0-indexed
            if idx < len(lines):
                original = lines[idx]
                lines[idx] = re.sub(pattern, replacement, lines[idx])
                if lines[idx] != original:
                    modified = True

        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            print(f"✓ Fixed {filepath}")
            return True
        return False
    except Exception as e:
        print(f"✗ Error fixing {filepath}: {e}")
        return False

def main():
    """Main entry point"""
    fixed_count = 0
    for filepath, line_fixes in fixes.items():
        if fix_file(filepath, line_fixes):
            fixed_count += 1
    print(f"\n✓ Fixed {fixed_count} files")

if __name__ == "__main__":
    main()
