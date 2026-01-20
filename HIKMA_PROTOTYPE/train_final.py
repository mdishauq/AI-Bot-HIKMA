import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# ==========================================
# 🧠 THE DATASET (The Robot's Knowledge)
# ==========================================
# We teach it many ways to say the same thing.
data = [
    # 1. MOTION - FORWARD
    ("move forward", "motion_forward"),
    ("go forward", "motion_forward"),
    ("go straight", "motion_forward"),
    ("advance", "motion_forward"),
    ("come here", "motion_forward"),
    ("proceed", "motion_forward"),
    ("drive ahead", "motion_forward"),
    ("move up", "motion_forward"),
    
    # 2. MOTION - BACKWARD
    ("move back", "motion_backward"),
    ("go back", "motion_backward"),
    ("reverse", "motion_backward"),
    ("back up", "motion_backward"),
    ("retreat", "motion_backward"),
    ("go in reverse", "motion_backward"),
    
    # 3. MOTION - LEFT
    ("turn left", "motion_left"),
    ("go left", "motion_left"),
    ("rotate left", "motion_left"),
    ("spin left", "motion_left"),
    ("steer left", "motion_left"),
    ("look left", "motion_left"),
    
    # 4. MOTION - RIGHT
    ("turn right", "motion_right"),
    ("go right", "motion_right"),
    ("rotate right", "motion_right"),
    ("spin right", "motion_right"),
    ("steer right", "motion_right"),
    ("look right", "motion_right"),
    
    # 5. MOTION - STOP
    ("stop", "motion_stop"),
    ("halt", "motion_stop"),
    ("brake", "motion_stop"),
    ("pause", "motion_stop"),
    ("don't move", "motion_stop"),
    ("stay", "motion_stop"),
    ("freeze", "motion_stop"),
    ("hold on", "motion_stop"),

    # 6. CONVERSATION (Everything else goes to AI)
    ("who are you", "chat"),
    ("hello", "chat"),
    ("tell me a joke", "chat"),
    ("what is the weather", "chat"),
    ("how are you", "chat"),
    ("say something", "chat"),
    ("good morning", "chat"),
    ("what is your name", "chat"),
    ("explain quantum physics", "chat"),
    ("sing a song", "chat"),
    ("what can you do", "chat"),
]

# Separate the input (text) from the output (labels)
texts = [text for text, label in data]
labels = [label for text, label in data]

# ==========================================
# ⚙️ BUILDING THE BRAIN
# ==========================================
print("🧠 TRAINING NEURAL PATHWAYS...")

# We use a Pipeline: 
# 1. CountVectorizer turns words into numbers
# 2. MultinomialNB finds patterns in those numbers
model = make_pipeline(CountVectorizer(), MultinomialNB())

# Train the model
model.fit(texts, labels)
print("✅ TRAINING COMPLETE.")

# ==========================================
# 💾 SAVING THE BRAIN
# ==========================================
filename = "hikma_brain.pkl"
with open(filename, 'wb') as f:
    pickle.dump(model, f)

print(f"✅ BRAIN SAVED TO: {filename}")
print("---------------------------------------")
print("TESTING BRAIN ACCURACY:")
print(f"Input: 'Please go ahead' -> Prediction: {model.predict(['Please go ahead'])[0]}")
print(f"Input: 'Reverse the car' -> Prediction: {model.predict(['Reverse the car'])[0]}")
print(f"Input: 'Tell me a story' -> Prediction: {model.predict(['Tell me a story'])[0]}")