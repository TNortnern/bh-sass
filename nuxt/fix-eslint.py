#!/usr/bin/env python3
"""
Fix ESLint errors in composables directory
"""
import re
import os
import glob

# Directory containing composables
COMPOSABLES_DIR = "/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/composables"

def fix_catch_any(content):
    """Replace 'catch (err: any)' and 'catch (error: any)' patterns"""
    # Pattern 1: catch (err: any) - with error data access
    content = re.sub(
        r'catch \((err|error): any\)',
        r'catch (\1: unknown)',
        content
    )
    return content

def fix_unused_vars(content):
    """Prefix unused variables with underscore"""
    # Fix unused function parameters - add underscore prefix
    content = re.sub(
        r'(\([^)]*?)(\b\w+)(\s*[,:])',
        lambda m: f"{m.group(1)}_{m.group(2)}{m.group(3)}" if 'is defined but never used' in content else m.group(0),
        content
    )
    return content

def fix_any_types(content):
    """Replace : any with : Record<string, unknown>"""
    # Pattern for function return types and parameters
    patterns = [
        (r': any\b', r': Record<string, unknown>'),
        (r': any\[\]', r': Array<Record<string, unknown>>'),
    ]

    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content)

    return content

def process_file(filepath):
    """Process a single TypeScript file"""
    print(f"Processing {os.path.basename(filepath)}...")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Apply fixes
    content = fix_catch_any(content)
    content = fix_any_types(content)

    # Only write if content changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Fixed {filepath}")
        return True
    else:
        print(f"  - No changes needed")
        return False

def main():
    """Main entry point"""
    ts_files = glob.glob(f"{COMPOSABLES_DIR}/*.ts")

    fixed_count = 0
    for filepath in sorted(ts_files):
        if process_file(filepath):
            fixed_count += 1

    print(f"\n✓ Fixed {fixed_count} files")

if __name__ == "__main__":
    main()
