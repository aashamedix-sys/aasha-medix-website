import re

# Read SVG
with open('aasha_medix/assets/images/logo.svg', 'r') as f:
    content = f.read()

# Extract style definitions
styles = {}
style_match = re.search(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
if style_match:
    styles_text = style_match.group(1)
    # Parse CSS styles
    for rule in re.findall(r'\.st(\d+)\{([^}]*)\}', styles_text):
        class_name = f'st{rule[0]}'
        styles[class_name] = rule[1]

# Remove the <style> block
content = re.sub(r'<style[^>]*>.*?</style>\s*', '', content, flags=re.DOTALL)

# Replace class references with inline style attributes
for class_name, style_str in styles.items():
    # Match elements with this class
    pattern = f'class="{class_name}"'
    replacement = f'style="{style_str}"'
    content = content.replace(pattern, replacement)

# Write back
with open('aasha_medix/assets/images/logo.svg', 'w') as f:
    f.write(content)

print("SVG converted: <style> block removed and classes converted to inline styles")
