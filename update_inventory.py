import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import json

# Load Firebase Admin SDK credentials
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load CSV file
csv_file = "Inventory.csv"
chunk_size = 500  # Firestore has a limit, so we upload in chunks

# Define correct column names based on your CSV
required_columns = [
    "Product Title", "MSRP", "Image 1", "SKU", "Current Inventory Stock", "Category", "Body HTML",
    "Image 1", "Image 2", "Image 3", "Image 4", "Image 5", "Image 6", "Image 7", "Image 8", "Image 9", "Image 10"
