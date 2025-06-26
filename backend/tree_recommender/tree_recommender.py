tree_recommendations = {
    "alluvial": {
        "urban": [
            {"name": "Neem", "purpose": ["shade", "air_purifier"]},
            {"name": "Peepal", "purpose": ["shade", "biodiversity"]},
            {"name": "Ashoka", "purpose": ["ornamental"]}
        ],
        "roadside": [
            {"name": "Rain Tree", "purpose": ["shade", "urban canopy"]},
            {"name": "Ficus", "purpose": ["shade", "ornamental"]}
        ],
        "farm": [
            {"name": "Papaya", "purpose": ["fruit"]},
            {"name": "Banana", "purpose": ["fruit"]},
            {"name": "Moringa", "purpose": ["nutrition", "biodiversity"]}
        ],
        "forest": [
            {"name": "Banyan", "purpose": ["shade", "ecosystem"]},
            {"name": "Jamun", "purpose": ["fruit", "biodiversity"]}
        ],
        "highway": [
            {"name": "Gulmohar", "purpose": ["ornamental", "shade"]},
            {"name": "Amla", "purpose": ["fruit", "medicinal"]}
        ]
    },
    "black": {
        "urban": [
            {"name": "Neem", "purpose": ["shade", "air_purifier"]},
            {"name": "Ashoka", "purpose": ["ornamental"]},
            {"name": "Guava", "purpose": ["fruit"]}
        ],
        "roadside": [
            {"name": "Tamarind", "purpose": ["shade", "fruit"]},
            {"name": "Teak", "purpose": ["timber"]},
            {"name": "Arjuna", "purpose": ["air_purifier", "medicinal"]}
        ],
        "farm": [
            {"name": "Mango", "purpose": ["fruit"]},
            {"name": "Custard Apple", "purpose": ["fruit"]},
            {"name": "Drumstick", "purpose": ["nutrition"]}
        ],
        "forest": [
            {"name": "Indian Rosewood", "purpose": ["timber"]},
            {"name": "Banyan", "purpose": ["shade", "ecosystem"]}
        ],
        "highway": [
            {"name": "Pongamia", "purpose": ["biodiesel", "shade"]},
            {"name": "Subabul", "purpose": ["fast_growing", "fodder"]}
        ]
    },
    "clay": {
        "urban": [
            {"name": "Flame Tree", "purpose": ["ornamental", "shade"]},
            {"name": "Peepal", "purpose": ["shade", "biodiversity"]}
        ],
        "roadside": [
            {"name": "Teak", "purpose": ["timber"]},
            {"name": "Neem", "purpose": ["shade", "air_purifier"]}
        ],
        "farm": [
            {"name": "Pomegranate", "purpose": ["fruit"]},
            {"name": "Mango", "purpose": ["fruit"]},
            {"name": "Guava", "purpose": ["fruit"]}
        ],
        "forest": [
            {"name": "Jackfruit", "purpose": ["fruit", "shade"]},
            {"name": "Mahua", "purpose": ["biodiversity", "medicinal"]}
        ],
        "highway": [
            {"name": "Acacia", "purpose": ["shade", "erosion_control"]},
            {"name": "Eucalyptus", "purpose": ["fast_growing", "timber"]}
        ]
    },
    "red": {
        "urban": [
            {"name": "Bougainvillea", "purpose": ["ornamental"]},
            {"name": "Neem", "purpose": ["shade", "pollution_control"]},
            {"name": "Ashoka", "purpose": ["ornamental"]},
        ],
        "roadside": [
            {"name": "Tamarind", "purpose": ["fruit", "shade"]},
            {"name": "Amla", "purpose": ["fruit", "medicinal"]}
        ],
        "farm": [
            {"name": "Cashew", "purpose": ["fruit", "economic"]},
            {"name": "Mango", "purpose": ["fruit"]}
        ],
        "forest": [
            {"name": "Jamun", "purpose": ["fruit", "biodiversity"]},
            {"name": "Indian Rosewood", "purpose": ["timber"]}
        ],
        "highway": [
            {"name": "Eucalyptus", "purpose": ["fast_growing", "timber"]},
            {"name": "Acacia", "purpose": ["shade", "erosion_control"]}
        ]
    },
    "sandy": {
        "urban": [
            {"name": "Babool", "purpose": ["fodder", "shade"]},
            {"name": "Neem", "purpose": ["shade", "air_purifier"]}
        ],
        "roadside": [
            {"name": "Khejri", "purpose": ["drought_resistant", "shade"]},
            {"name": "Prosopis", "purpose": ["arid_tolerant", "erosion_control"]}
        ],
        "farm": [
            {"name": "Date Palm", "purpose": ["fruit", "desert_friendly"]},
            {"name": "Ber", "purpose": ["fruit", "drought_tolerant"]}
        ],
        "forest": [
            {"name": "Khejri", "purpose": ["drought_resistant", "shade"]},
            {"name": "Prosopis", "purpose": ["arid_tolerant", "ecosystem"]}
        ],
        "highway": [
            {"name": "Babool", "purpose": ["fodder", "shade"]},
            {"name": "Acacia", "purpose": ["shade", "erosion_control"]}
        ]
    },
}


def recommend_trees(soil_type, location_type):
    """
    Returns a list of recommended trees based on soil and location type.
    """
    soil_data = tree_recommendations.get(soil_type.lower())
    if not soil_data:
        return ["❌ No data found for this soil type"]

    location_data = soil_data.get(location_type.lower())
    if not location_data:
        return ["❌ No recommendations for this location type in selected soil"]

    return [f"{tree['name']} ({', '.join(tree['purpose'])})" for tree in location_data]


# ✅ Example usage:
if __name__ == "__main__":
    soil = input("Enter soil type (alluvial/black/clay/red/sandy): ").strip()
    location = input("Enter location type (urban/roadside/farm/forest/highway): ").strip()
    print("\n🌳 Recommended Trees:")
    recommendations = recommend_trees(soil, location)
    for tree in recommendations:
        print(" -", tree)
