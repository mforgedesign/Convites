"""
Convert builder.html (Jinja2) to standalone HTML with Supabase integration
"""
import re

# Read original builder.html
with open('templates/builder.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Read base.html
with open('templates/base.html', 'r', encoding='utf-8') as f:
    base_content = f.read()

# Extract body content from builder.html
# Remove Jinja2 extends
content = re.sub(r'{%\s*extends\s*["\'].*?["\']\s*%}', '', content)
content = re.sub(r'{%\s*block\s+title\s*%}.*?{%\s*endblock\s*%}', '', content, flags=re.DOTALL)

# Extract body block content
body_match = re.search(r'{%\s*block\s+body\s*%}(.*?){%\s*endblock\s*%}', content, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
else:
    body_content = content

# Remove remaining Jinja2 syntax
body_content = re.sub(r'{%.*?%}', '', body_content)
body_content = re.sub(r'{{\s*url_for\([^)]+\)\s*}}', '', body_content)

# Build final HTML
html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoBuilder v4 - Criador de Convites Digitais</title>
    
    <!-- Supabase Client -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    
    <!-- TailwindCSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    
    <!-- Google Fonts - Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Tailwind Config -->
    <script>
        tailwind.config = {{
            theme: {{
                extend: {{
                    colors: {{
                        brand: {{
                            50: '#eef2ff',
                            100: '#e0e7ff',
                            500: '#6366f1',
                            600: '#4f46e5',
                            700: '#4338ca',
                            900: '#312e81',
                        }},
                        saas: {{
                            bg: '#f6f8fa',
                            sidebar: '#1e293b',
                            border: '#e2e8f0'
                        }}
                    }}
                }}
            }}
        }}
    </script>
    
    <style>
        body {{
            font-family: 'Inter', sans-serif;
        }}
        
        ::-webkit-scrollbar {{
            width: 6px;
            height: 6px;
        }}
        
        ::-webkit-scrollbar-track {{
            background: #f1f1f1;
        }}
        
        ::-webkit-scrollbar-thumb {{
            background: #c1c1c1;
            border-radius: 3px;
        }}
        
        ::-webkit-scrollbar-thumb:hover {{
            background: #a8a8a8;
        }}
        
        .device-frame {{
            box-shadow: 0 0 0 12px #1f2937, 0 0 0 14px #4b5563, 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }}
        
        .toggle-checkbox {{
            left: 0;
            transition: left 0.3s ease-in-out, border-color 0.3s ease-in-out;
        }}
        
        .toggle-checkbox:checked {{
            left: calc(100% - 1.5rem);
            border-color: #4f46e5;
        }}
        
        .toggle-checkbox:checked+.toggle-label {{
            background-color: #4f46e5;
        }}
        
        .window-panel {{
            transition: opacity 0.2s ease-in-out;
        }}
        
        .window-panel.hidden {{
            display: none;
        }}
    </style>
</head>
<body class="bg-saas-bg h-screen w-screen overflow-hidden text-gray-700">
{body_content}

    <!-- Supabase Adapter (MUST load first) -->
    <script src="static/js/supabase-adapter.js"></script>
    
    <!-- Original Scripts -->
    <script src="static/js/navigation.js"></script>
    <script src="static/js/form.js"></script>
    <script src="static/js/links-extras.js"></script>
    <script src="static/js/preview.js"></script>
    <script src="static/js/chatbot.js"></script>
    <script src="static/js/windows.js"></script>
    <script src="static/js/app.js"></script>
    
    <script>
        // Mobile menu helpers
        function openMobileMenu() {{
            document.getElementById('sidebar').classList.remove('-translate-x-full');
            document.getElementById('mobile-overlay').classList.remove('hidden');
        }}
        
        function closeMobileMenu() {{
            document.getElementById('sidebar').classList.add('-translate-x-full');
            document.getElementById('mobile-overlay').classList.add('hidden');
        }}
        
        function openMobilePreview() {{
            // TODO: Implement mobile preview modal
            console.log('Mobile preview modal');
        }}
        
        console.log('[AutoBuilder v4] Initialized');
    </script>
</body>
</html>"""

# Write standalone HTML
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Converted builder.html to standalone index.html")
print(f"📄 File size: {len(html)} bytes")
