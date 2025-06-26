import requests
import base64

# Place your API key here (keep it secure in production)
PLANT_ID_API_KEY = "UCCcFrOf1TQhBxsSFLWH3RA6BfpRTz6KnBUMDh9EDlo5vSz2Z8"

def identify_plant(image_path: str):
    """
    Identifies a plant using the Plant.id API and returns its name and description.
    """
    try:
        # Step 1: Read and Encode Image
        with open(image_path, "rb") as img_file:
            img_base64 = base64.b64encode(img_file.read()).decode()

        # Step 2: Prepare request payload
        data = {
            "api_key": PLANT_ID_API_KEY,
            "images": [img_base64],
            "modifiers": ["similar_images"],
            "plant_language": "en",
            "plant_details": ["common_names", "wiki_description"]
        }

        # Step 3: Send POST request
        response = requests.post("https://api.plant.id/v2/identify", json=data)

        # Step 4: Process response
        if response.status_code == 200:
            result = response.json()
            suggestion = result.get('suggestions', [])[0]

            plant_name = suggestion.get('plant_name', 'Unknown')
            description = suggestion.get('plant_details', {}).get('wiki_description', {}).get('value', 'No description available.')

            return plant_name, description
        else:
            return "API Error", f"Status Code: {response.status_code}"

    except Exception as e:
        return "Error", str(e)
