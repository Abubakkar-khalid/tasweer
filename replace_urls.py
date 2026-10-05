import os

directory = r'c:\Users\Abubakar Khalid\Desktop\tasweer\src'
target = 'http://127.0.0.1:8000'
replacement = 'https://AbubakarKhalid.pythonanywhere.com'

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            if target in content:
                print(f'Updating {path}')
                content = content.replace(target, replacement)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
print("Done!")
