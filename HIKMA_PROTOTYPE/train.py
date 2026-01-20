import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import pickle
import os

print("--- TRAINING START ---")

# 1. Load the dataset
if not os.path.exists('commands.csv'):
    print("❌ ERROR: commands.csv not found!")
    exit()

print("1. Loading dataset...")
data = pd.read_csv('commands.csv')
print(f"   - Found {len(data)} examples.")

# 2. Prepare Data
X = data['command'] # Input text
y = data['intent']  # Output label

# 3. Create Pipeline (Text -> Numbers -> AI Model)
# We use Naive Bayes because it requires very little CPU power
model = make_pipeline(CountVectorizer(), MultinomialNB())

# 4. Train
print("2. Training the model...")
model.fit(X, y)

# 5. Save the 'Brain'
print("3. Saving the brain file...")
with open('hikma_brain.pkl', 'wb') as f:
    pickle.dump(model, f)

print("\n✅ SUCCESS: 'hikma_brain.pkl' has been created.")
print("You can now run the robot logic.")