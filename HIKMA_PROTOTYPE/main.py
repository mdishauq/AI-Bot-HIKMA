import ollama
from ollama import Client
import speech_recognition as sr
import sounddevice as sd
import soundfile as sf
import pyttsx3
import pickle
import time
import sys
import os

# ==========================================
# ⚙️ CONFIGURATION
# ==========================================
client = Client(host='http://localhost:11434')
MODEL_NAME = "qwen2.5:0.5b"
BRAIN_FILE = "hikma_brain.pkl"
SAMPLE_RATE = 44100
DURATION = 5

SYSTEM_PROMPT = """
You are HIKMA. You are a helpful robot assistant. 
Answer in 1 brief sentence. Never call yourself Hikaru.
"""

# ==========================================
# 🛠️ SYSTEM CHECK
# ==========================================
print("------------------------------------------------")
print(f"🚀 BOOTING HIKMA SYSTEM (v6 - Fresh Audio)...")

try:
    with open(BRAIN_FILE, 'rb') as f:
        reflex_brain = pickle.load(f)
    print(f"✅ REFLEX CORE: Loaded")
except:
    sys.exit()

try:
    client.list()
    print(f"✅ WISDOM CORE: Connected")
except:
    sys.exit()

print("✅ EARS: Active")
print("✅ MOUTH: Active (Fresh Mode)")
print("------------------------------------------------\n")

# ==========================================
# 🗣️ THE FIXED SPEAK FUNCTION
# ==========================================
def speak(text):
    print(f"🔊 SPEAKING: {text}")
    try:
        # 🟢 FIX: Initialize a NEW engine every time we speak
        # This prevents the engine from getting "stuck" after the first sentence.
        engine = pyttsx3.init('sapi5')
        engine.setProperty('rate', 160)
        engine.setProperty('volume', 1.0)
        
        # Select voice (optional, tries to find a good one)
        voices = engine.getProperty('voices')
        if len(voices) > 0: engine.setProperty('voice', voices[0].id)

        engine.say(text)
        engine.runAndWait() # Speak and finish
        
        # 🟢 FIX: Kill the engine cleanly
        engine.stop()
        del engine
        
    except Exception as e:
        print(f"❌ MOUTH ERROR: {e}")

# ==========================================
# 👂 LISTEN FUNCTION
# ==========================================
def listen_to_mic():
    print("\n👂 LISTENING... (Speak for 5 seconds)")
    try:
        recording = sd.rec(int(DURATION * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1)
        for i in range(DURATION):
            print(f"   Recording... {DURATION-i}s left", end='\r')
            time.sleep(1)
        sd.wait()
        print("\n⏳ Processing...")

        filename = 'temp_audio.wav'
        sf.write(filename, recording, SAMPLE_RATE)
        
        recognizer = sr.Recognizer()
        text = None
        
        with sr.AudioFile(filename) as source:
            audio_data = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio_data)
                print(f"📝 HEARD: '{text}'")
            except:
                pass 
        
        time.sleep(0.5)
        try:
            if os.path.exists(filename): os.remove(filename)
        except: pass
            
        return text

    except:
        return None

# ==========================================
# 🕹️ LOGIC
# ==========================================
def move_robot(direction):
    msg = f"Moving {direction}"
    print(f"\n⚡ [MOTOR] ===> {direction.upper()} ⚡")
    speak(msg) 

def chat_with_ai(user_text):
    print(f"🤔 [AI THINKING] ...", end="", flush=True)
    try:
        response = client.chat(model=MODEL_NAME, messages=[
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': user_text},
        ])
        reply = response['message']['content']
        print(f"\r🗣️  [HIKMA SAYS]: {reply}\n")
        speak(reply)
    except Exception as e:
        print(f"\n❌ AI FAILED: {e}")

# ==========================================
# 🔁 MAIN LOOP
# ==========================================
def main():
    speak("System Online. I am listening.")
    print("🤖 SYSTEM READY. Press 'Enter' to talk (or 'q' to quit).")
    
    while True:
        try:
            user_input = input("USER > Press ENTER to speak: ").strip()
            if user_input.lower() == 'q': break
            
            voice_text = listen_to_mic()
            if not voice_text: 
                speak("I didn't hear you.")
                continue
                
            final_input = voice_text

            # INTENT
            intent = reflex_brain.predict([final_input])[0]
            
            if intent.startswith("motion_"):
                move_robot(intent.split("_")[1])
            elif intent == "chat":
                chat_with_ai(final_input)
                
        except KeyboardInterrupt:
            break

if __name__ == "__main__":
    main()