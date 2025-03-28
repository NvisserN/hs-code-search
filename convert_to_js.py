import pandas as pd
import json

# Lees het Excel bestand
df = pd.read_excel('../Goederen codes lijst met categorisering_updated.xlsx')

# Converteer naar een lijst van dictionaries
data = []
for _, row in df.iterrows():
    data.append({
        'code': str(row['CN2025']),
        'sectie': row['Sectie'],
        'hoofdstuk': row['Hoofdstuk'],
        'omschrijving': row['Omschrijving']
    })

# Maak het JavaScript bestand
js_content = f"const hsData = {json.dumps(data, ensure_ascii=False, indent=2)};"

# Schrijf naar bestand
with open('static/data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
