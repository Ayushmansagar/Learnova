import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
model = os.getenv("GEMINI_MODEL")

try:
    response = client.models.generate_content(
        model=model,
        contents="Say hello to a student in one short sentence."
    )
    print("Model:", model)
    print("Reply:", response.text)
except Exception as e:
    print("Error:", e)
    print("\nModels available to your key:")
    for m in client.models.list():
        if "flash" in m.name:
            print(" ", m.name.replace("models/", ""))