import requests
import json
from .Location import Location

class Weather():
    def __init__(self):
        self.weather = None
        self.error = None

    def fetch_weather(self):
        try:
            loc = Location().get_location_by_ip()

            latitude, longitude = loc.split(",")

            # URL de l'API
            url = "https://my.meteoblue.com/packages/current_sunmoon"
            params = {
                "apikey": "qmdoYCl7DMcXxQIg",
                "lat": latitude,
                "lon": longitude,
                "format": "json"
            }

            
            # Requête GET vers l'API
            response = requests.get(url, params=params)
            response.raise_for_status()  # Vérifie si la requête a réussi (status 200)

            # Convertir la réponse en JSON
            self.weather = response.json()
            
            # Afficher les données météo récupérées
            print("Weather :\n", self.weather, "\n\n")

        except requests.exceptions.RequestException as e:
            print("Erreur lors de la récupération des données météo:", e)

    def get_weather(self):
        self.fetch_weather()
        if self.error:
            print(self.error)
            return f"Erreur: {self.error}"
        else:
            print("Self-Weather :\n", self.weather["metadata"], "\n\n")
            return f"{self.weather["metadata"]}"


# ['data_day']['moonrise']
    




