import pickle
import time
import os

# Clear screen for a clean look
os.system('cls' if os.name == 'nt' else 'clear')

print("╔══════════════════════════════════════╗")
print("║      HIKMA ROBOT - LOGIC CORE        ║")
print("║      Status: SYSTEM ONLINE           ║")
print("╚══════════════════════════════════════╝")

# 1. Load the Brain
try:
    with open('hikma_brain.pkl', 'rb') as f:
        classifier = pickle.load(f)
    print("✅ Brain Module Loaded Successfully.\n")
except FileNotFoundError:
    print("❌ ERROR: Brain file missing! Run train.py first.")
    exit()

def process_command(user_text):
    # Start Timer
    start_time = time.perf_counter() # High precision timer
    
    # AI PREDICTION
    prediction = classifier.predict([user_text])[0]
    
    # Stop Timer
    end_time = time.perf_counter()
    latency_ms = (end_time - start_time) * 1000
    
    return prediction, latency_ms

# --- MAIN LOOP ---
while True:
    user_input = input("🎤 Speak (Type command): ").lower().strip()
    
    if user_input == 'q':
        print("Shutting down...")
        break
    
    if not user_input:
        continue

    # Get Decision
    intent, speed = process_command(user_input)
    
    # VISUAL OUTPUT
    print("-" * 40)
    print(f"🧠 AI Analysis:")
    print(f"   • Input:    '{user_input}'")
    print(f"   • Intent:   [{intent.upper()}]")
    print(f"   • Speed:    {speed:.4f} ms") # Shows speed in milliseconds
    
    # SIMULATE HARDWARE ACTION
    if intent.startswith("motion_"):
        print(f"🤖 HARDWARE: GPIO Pins triggered for {intent.split('_')[1]}")
    elif intent == "chat":
        print(f"🗣️  SOFTWARE: Sending text to LLM (Phi-3.5) for response...")
    
    print("-" * 40 + "\n")